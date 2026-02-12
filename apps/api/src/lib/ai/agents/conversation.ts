import { streamText, tool } from 'ai';
import { z } from 'zod';
import { anthropic, models, modelConfig } from '../client';
import { SYSTEM_PROMPT, WELCOME_MESSAGE } from '../prompts/system';
import { getDomainConfig, getNextDomain } from '../prompts/domains';
import { quickClassify } from '../confidence/classifier';
import { saveInput } from '@/lib/db/inputs';
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
      description: 'Transition to the next domain in the assessment. Call this when the key topics for the current domain have been sufficiently explored.',
      parameters: z.object({
        currentDomainSummary: z.string().describe('Brief summary of what was learned in the current domain'),
      }),
      execute: async ({ currentDomainSummary }) => {
        try {
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

    // Create tools with session context via closure
    const tools = createConversationTools(sessionId, currentDomain);

    // maxSteps: 2 allows the model to call tools AND see results in a follow-up turn.
    // This uses at most 2 API calls per message (~6,500 tokens total),
    // safely within the 10,000 input tokens/min rate limit at conversational pace.
    // Build explicit list of question IDs for this domain
    const questionIdList = domainConfig.keyQuestions
      .map((q) => `- "${q.id}": ${q.question}`)
      .join('\n');

    const result = await streamText({
      model: anthropic(models.conversation),
      system: `${SYSTEM_PROMPT}

Current Domain: ${domainConfig.name}
Domain Description: ${domainConfig.description}

VALID QUESTION IDs FOR THIS DOMAIN (you MUST use these exact IDs when calling recordInput):
${questionIdList}

CRITICAL INSTRUCTIONS:
1. When the user provides information, call recordInput with the EXACT questionId from the list above. Do NOT make up new IDs.
2. You MUST always respond with conversational text. Never just call tools without also providing a spoken response.
3. After covering 3-4 topics in this domain, call transitionDomain to move to the next domain. Announce the transition naturally in your response.
4. If the user's response covers multiple topics, you can call recordInput multiple times with different questionIds.`,
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

    // Use fullStream to capture both text deltas and tool results
    for await (const part of result.fullStream) {
      if (part.type === 'text-delta') {
        fullText += part.textDelta;
        yield { type: 'text', content: part.textDelta };
      } else if (part.type === 'tool-result') {
        if (part.toolName === 'recordInput' && part.result?.success && part.result.input?.id) {
          yield { type: 'input', input: part.result.input };
        } else if (part.toolName === 'transitionDomain' && part.result?.success) {
          if (part.result.nextDomain) {
            yield { type: 'domain_change', domain: part.result.nextDomain };
          }
        }
      }
    }

    // If no text was generated (AI only used tools), make a follow-up call
    // without tools to force a conversational response
    if (!fullText.trim()) {
      console.log('[Atlas] No text generated, making follow-up call for response');

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

      for await (const part of followUpResult.fullStream) {
        if (part.type === 'text-delta') {
          fullText += part.textDelta;
          yield { type: 'text', content: part.textDelta };
        }
      }
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

    // Extract a meaningful message from any error type.
    // The AI SDK can throw non-Error objects (API response objects, strings).
    let message = 'An unexpected error occurred. Please try again.';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      message = (error as Record<string, unknown>).message as string
        || (error as Record<string, unknown>).error as string
        || JSON.stringify(error);
    }

    // Make rate limit errors more user-friendly
    if (message.toLowerCase().includes('rate limit') || message.includes('10,000 input tokens')) {
      message = "I'm receiving a lot of requests right now. Please wait about 30 seconds before sending your next message.";
    }

    yield {
      type: 'error',
      content: message,
    };
  }
}
