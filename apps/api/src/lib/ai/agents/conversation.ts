import { streamText, tool } from 'ai';
import { z } from 'zod';
import { anthropic, models, modelConfig } from '../client';
import { SYSTEM_PROMPT, WELCOME_MESSAGE } from '../prompts/system';
import { getDomainConfig, getNextDomain } from '../prompts/domains';
import { quickClassify } from '../confidence/classifier';
import { saveInput, getDomainInputs } from '@/lib/db/inputs';
import { saveMessage, getRecentMessages, formatMessagesForLLM } from '@/lib/db/messages';
import { updateSessionDomain, updateSessionStatus } from '@/lib/db/session';
import type { DomainType, ChatMessage } from '@atlas/types';

/**
 * Create conversation tools with session context captured via closure.
 * The Vercel AI SDK does not pass custom context to tool execute functions,
 * so we close over sessionId and currentDomain.
 *
 * Tool execution must be fast to avoid blocking the SSE stream.
 * We use only the instant regex-based classifier here (no LLM calls).
 */
function createConversationTools(sessionId: string, currentDomain: DomainType) {
  return {
    recordInput: tool({
      description: 'Record a captured input from the user with AI-generated insights. IMPORTANT: The questionId MUST be one of the exact IDs listed in the system prompt for the current domain.',
      parameters: z.object({
        questionId: z.string().describe('MUST be an exact questionId from the current domain list (e.g., market_driver, target_segment, competition, product_description, us_product_fit, localization, competitive_advantage, product_validation, gtm_strategy, etc.)'),
        userResponse: z.string().describe('The user response to capture'),
        summary: z.string().describe('Brief summary of what was captured'),
        keyInsight: z.string().describe('One-sentence key insight or takeaway from this response'),
        strengths: z.array(z.string()).describe('1-2 strengths or positive aspects identified in the response'),
        considerations: z.array(z.string()).describe('0-2 areas that could be strengthened or explored further'),
        confidenceAssessment: z.enum(['high', 'medium', 'low']).describe('Confidence level: high = specific, data-backed; medium = clear but general; low = vague or uncertain'),
        confidenceReason: z.string().describe('Brief explanation of why this confidence level was assigned'),
      }),
      execute: async ({ questionId, userResponse, summary, keyInsight, strengths, considerations, confidenceAssessment, confidenceReason }) => {
        try {
          // Validate questionId against the current domain's valid IDs
          const domainConfig = getDomainConfig(currentDomain);
          const validIds = domainConfig.keyQuestions.map(q => q.id);

          if (!validIds.includes(questionId)) {
            console.error(`[Atlas] Invalid questionId "${questionId}" for domain "${currentDomain}". Valid IDs: ${validIds.join(', ')}`);
            return {
              success: false,
              error: `Invalid questionId "${questionId}". Must be one of: ${validIds.join(', ')}`,
              validIds,
            };
          }

          // Use AI-provided confidence assessment, fallback to regex classifier
          const level = confidenceAssessment || quickClassify(userResponse) || 'medium';

          // Save to database with rich extracted data
          const input = await saveInput({
            sessionId,
            domain: currentDomain,
            questionId,
            userResponse,
            extractedData: {
              summary,
              keyInsight,
              strengths,
              considerations,
            },
            confidenceLevel: level,
            confidenceRationale: confidenceReason || 'Classified based on response characteristics',
          });

          return {
            success: true,
            input,
          };
        } catch (error) {
          console.error('recordInput tool error:', error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to record input',
          };
        }
      },
    }),

    transitionDomain: tool({
      description: 'Transition to the next domain in the assessment. Only call this when ALL topics in the current domain have been covered.',
      parameters: z.object({
        currentDomainSummary: z.string().describe('Brief summary of what was learned in the current domain'),
      }),
      execute: async ({ currentDomainSummary }) => {
        try {
          // Check if all topics are covered before allowing transition
          const domainConfig = getDomainConfig(currentDomain);
          const existingInputs = await getDomainInputs(sessionId, currentDomain);
          const completedTopicIds = existingInputs.map(input => input.question_id);
          const totalTopics = domainConfig.keyQuestions.length;
          const uncoveredTopics = domainConfig.keyQuestions
            .filter(q => !completedTopicIds.includes(q.id))
            .map(q => q.id);

          // If there are still uncovered topics, don't allow transition
          if (uncoveredTopics.length > 0) {
            console.log('[Atlas] Transition blocked - uncovered topics:', uncoveredTopics);
            return {
              success: false,
              error: `Cannot transition yet. ${uncoveredTopics.length} topic(s) still need to be covered: ${uncoveredTopics.join(', ')}. Please ask about these topics first.`,
              uncoveredTopics,
            };
          }

          const nextDomain = getNextDomain(currentDomain);

          if (!nextDomain) {
            // All domains complete - transition to synthesis
            await updateSessionStatus(sessionId, 'synthesizing');
            return {
              success: true,
              nextDomain: null,
              isComplete: true,
              message: 'All domains complete. Ready for synthesis.',
            };
          }

          // Update session to next domain
          await updateSessionDomain(sessionId, nextDomain);
          const nextConfig = getDomainConfig(nextDomain);

          console.log('[Atlas] Transitioning from', currentDomain, 'to', nextDomain);

          return {
            success: true,
            nextDomain,
            isComplete: false,
            domainName: nextConfig.name,
            openingPrompt: nextConfig.openingPrompt,
          };
        } catch (error) {
          console.error('transitionDomain tool error:', error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to transition domain',
          };
        }
      },
    }),
  };
}

/**
 * Generate the initial welcome message for a new session
 */
export async function generateWelcomeMessage(sessionId: string): Promise<ChatMessage> {
  const message = await saveMessage({
    sessionId,
    role: 'assistant',
    content: WELCOME_MESSAGE,
    metadata: {
      type: 'welcome',
      domain: 'market',
    },
  });

  return message;
}

/**
 * Stream a conversation response
 */
export async function* streamConversation(
  sessionId: string,
  userMessage: string,
  currentDomain: DomainType
): AsyncGenerator<{
  type: 'text' | 'input' | 'domain_change' | 'complete' | 'error';
  content?: string;
  data?: unknown;
  input?: unknown;
  domain?: string;
}> {
  console.log('[Atlas] streamConversation called:', { sessionId, domain: currentDomain, messageLength: userMessage.length });

  try {
    // Save user message
    await saveMessage({
      sessionId,
      role: 'user',
      content: userMessage,
      metadata: { domain: currentDomain },
    });

    // Keep history short to stay within rate limits
    // 6 messages ≈ 1500-3000 tokens, plus system prompt ≈ 700 tokens
    // Total ~4000-5000 tokens per request, safe for 10k/min limit
    const recentMessages = await getRecentMessages(sessionId, 6);
    const formattedMessages = formatMessagesForLLM(recentMessages);

    // Get domain context
    const domainConfig = getDomainConfig(currentDomain);

    // Get existing inputs for this domain to know which topics are already completed
    const existingInputs = await getDomainInputs(sessionId, currentDomain);
    const completedTopicIds = existingInputs.map(input => input.question_id);
    const totalTopics = domainConfig.keyQuestions.length;
    const remainingTopics = totalTopics - completedTopicIds.length;

    console.log('[Atlas] Domain:', currentDomain, 'Completed:', completedTopicIds.length, '/', totalTopics);

    // Create tools with session context via closure
    const tools = createConversationTools(sessionId, currentDomain);

    // Build explicit list of question IDs for this domain, marking completed ones
    const questionIdList = domainConfig.keyQuestions
      .map((q) => {
        const isCompleted = completedTopicIds.includes(q.id);
        return `- "${q.id}": ${q.question}${isCompleted ? ' [COMPLETED - do not ask again]' : ''}`;
      })
      .join('\n');

    // Build list of uncovered topics
    const uncoveredTopics = domainConfig.keyQuestions
      .filter(q => !completedTopicIds.includes(q.id))
      .map(q => q.id);

    const result = await streamText({
      model: anthropic(models.conversation),
      system: `${SYSTEM_PROMPT}

Current Domain: ${domainConfig.name}
Domain Description: ${domainConfig.description}

TOPICS FOR THIS DOMAIN:
${questionIdList}

DOMAIN PROGRESS: ${completedTopicIds.length}/${totalTopics} topics completed
${uncoveredTopics.length > 0 ? `UNCOVERED TOPICS (focus on these): ${uncoveredTopics.join(', ')}` : 'ALL TOPICS COVERED - ready to transition'}

CRITICAL INSTRUCTIONS:
1. DO NOT ask about topics marked [COMPLETED]. These have already been answered. Only discuss completed topics if the user explicitly brings them up.
2. Focus your questions on the UNCOVERED TOPICS listed above.
3. When the user provides information, call recordInput with the EXACT questionId from the list above.
4. You MUST always respond with conversational text. Never just call tools without also providing a spoken response.
5. Only call transitionDomain when ALL ${totalTopics} topics in this domain have been covered (currently ${remainingTopics} remaining).
6. If the user's response covers multiple topics, you can call recordInput multiple times with different questionIds.`,
      messages: [
        ...formattedMessages,
        { role: 'user', content: userMessage },
      ],
      tools,
      maxSteps: 2,
      maxTokens: modelConfig.conversation.maxTokens,
      temperature: modelConfig.conversation.temperature,
    });

    let fullText = '';
    let partCount = 0;

    console.log('[Atlas] Starting to stream response...');

    // Use fullStream to capture both text deltas and tool results
    for await (const part of result.fullStream) {
      partCount++;
      if (part.type === 'text-delta') {
        fullText += part.textDelta;
        yield { type: 'text', content: part.textDelta };
      } else if (part.type === 'tool-result') {
        console.log('[Atlas] Tool result:', part.toolName, part.result?.success);
        if (part.toolName === 'recordInput' && part.result?.success && part.result.input?.id) {
          yield { type: 'input', input: part.result.input };
        } else if (part.toolName === 'transitionDomain' && part.result?.success) {
          if (part.result.nextDomain) {
            yield { type: 'domain_change', domain: part.result.nextDomain };
          }
        }
      } else if (part.type === 'error') {
        console.error('[Atlas] Stream error part:', part);
      }
    }

    console.log('[Atlas] Stream complete. Parts:', partCount, 'Text length:', fullText.length);

    // If no text was generated (AI only used tools), make a follow-up call
    // without tools to force a conversational response
    if (!fullText.trim()) {
      console.log('[Atlas] No text generated after', partCount, 'parts, making follow-up call');

      const followUpResult = await streamText({
        model: anthropic(models.conversation),
        system: `${SYSTEM_PROMPT}

Current Domain: ${domainConfig.name}

You just recorded the user's input. Now acknowledge what they shared and continue the conversation with a follow-up question or transition to the next topic. Be conversational and encouraging.`,
        messages: [
          ...formattedMessages,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: '[Input recorded successfully]' },
        ],
        maxTokens: modelConfig.conversation.maxTokens,
        temperature: modelConfig.conversation.temperature,
        // No tools - force text generation
      });

      let followUpParts = 0;
      for await (const part of followUpResult.fullStream) {
        followUpParts++;
        if (part.type === 'text-delta') {
          fullText += part.textDelta;
          yield { type: 'text', content: part.textDelta };
        } else if (part.type === 'error') {
          console.error('[Atlas] Follow-up stream error:', part);
        }
      }
      console.log('[Atlas] Follow-up complete. Parts:', followUpParts, 'Text length:', fullText.length);
    }

    // Save and send the message
    if (fullText.trim()) {
      const assistantMessage = await saveMessage({
        sessionId,
        role: 'assistant',
        content: fullText,
        metadata: {
          domain: currentDomain,
        },
      });

      yield {
        type: 'complete',
        data: { message: assistantMessage },
      };
    } else {
      // Still no text - this shouldn't happen but handle gracefully
      console.error('[Atlas] No text generated even after follow-up call');
      yield {
        type: 'complete',
        data: { message: null },
      };
    }
  } catch (error) {
    console.error('Conversation error:', error);
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error cause:', error.cause);
    }

    // Extract a meaningful message from any error type.
    // The AI SDK can throw non-Error objects (API response objects, strings).
    let message = 'An unexpected error occurred. Please try again.';
    if (error instanceof Error) {
      // AI SDK errors often have nested cause with actual message
      const cause = error.cause as Record<string, unknown> | undefined;
      message = cause?.message as string || cause?.error as string || error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      const errObj = error as Record<string, unknown>;
      message = errObj.message as string
        || errObj.error as string
        || errObj.text as string
        || JSON.stringify(error);
    }

    // Make common errors more user-friendly
    if (message.toLowerCase().includes('rate limit') || message.includes('10,000 input tokens')) {
      message = "I'm receiving a lot of requests right now. Please wait about 30 seconds before sending your next message.";
    } else if (message.toLowerCase().includes('credit balance') || message.toLowerCase().includes('insufficient_quota')) {
      message = "The AI service is temporarily unavailable. Please contact support or try again later.";
    } else if (message.toLowerCase().includes('invalid api key') || message.toLowerCase().includes('authentication')) {
      message = "There's a configuration issue with the AI service. Please contact support.";
    }

    yield {
      type: 'error',
      content: message,
    };

    // Always send complete event so client knows stream is done
    yield {
      type: 'complete',
      data: { message: null, error: true },
    };
  }
}
