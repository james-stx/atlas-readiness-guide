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
      description: 'Record a captured input from the user with confidence classification. Call this whenever the user provides substantive information about any topic.',
      parameters: z.object({
        questionId: z.string().describe('Identifier for the question being answered (e.g. market_driver, target_segment, etc.)'),
        userResponse: z.string().describe('The user response to capture'),
        summary: z.string().describe('Brief summary of what was captured'),
      }),
      execute: async ({ questionId, userResponse, summary }) => {
        try {
          // Use fast regex-based classification only (no API calls)
          // to avoid blocking the SSE stream for seconds
          const level = quickClassify(userResponse) || 'medium';

          // Save to database
          const input = await saveInput({
            sessionId,
            domain: currentDomain,
            questionId,
            userResponse,
            extractedData: { summary },
            confidenceLevel: level,
            confidenceRationale: 'Classified based on language patterns',
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

    // Keep history short to stay within rate limits (~10 msgs ≈ 500-1000 tokens)
    const recentMessages = await getRecentMessages(sessionId, 10);
    const formattedMessages = formatMessagesForLLM(recentMessages);

    // Get domain context
    const domainConfig = getDomainConfig(currentDomain);

    // Create tools with session context via closure
    const tools = createConversationTools(sessionId, currentDomain);

    // maxSteps: 2 allows the model to call tools AND see results in a follow-up turn.
    // This uses at most 2 API calls per message (~6,500 tokens total),
    // safely within the 10,000 input tokens/min rate limit at conversational pace.
    const result = await streamText({
      model: anthropic(models.conversation),
      system: `${SYSTEM_PROMPT}

Current Domain: ${domainConfig.name}
Domain Description: ${domainConfig.description}
Key topics: ${domainConfig.keyQuestions.map((q) => q.id).join(', ')}

IMPORTANT: You MUST always respond with conversational text to the user. After the user answers a question, call recordInput to capture their answer, but ALSO acknowledge their response and ask a follow-up question or move the conversation forward. Never just call tools without providing a text response.

When the domain's key topics are covered, call transitionDomain and announce the transition to the user.`,
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

    // Only save and send message if there's actual content
    // (Sometimes the AI only calls tools without generating text)
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
      // No text generated - just signal completion without a message
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

    yield {
      type: 'error',
      content: message,
    };
  }
}
