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

    // Get recent conversation history
    const recentMessages = await getRecentMessages(sessionId, 20);
    const formattedMessages = formatMessagesForLLM(recentMessages);

    // Get domain context
    const domainConfig = getDomainConfig(currentDomain);

    // Create tools with session context via closure
    const tools = createConversationTools(sessionId, currentDomain);

    // Create the streaming response with tools
    const result = await streamText({
      model: anthropic(models.conversation),
      system: `${SYSTEM_PROMPT}

Current Domain: ${domainConfig.name}
Domain Description: ${domainConfig.description}
Key topics to explore: ${domainConfig.keyQuestions.map((q) => `${q.id} (${q.question})`).join('; ')}

IMPORTANT: After the user answers a question, you MUST call the recordInput tool to capture their response before asking the next question. Use the appropriate question_id from the list above. When you've covered the key topics for this domain, call transitionDomain to move to the next one.`,
      messages: [
        ...formattedMessages,
        { role: 'user', content: userMessage },
      ],
      tools,
      maxSteps: 5,
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
        if (part.toolName === 'recordInput' && part.result?.success) {
          yield { type: 'input', input: part.result.input };
        } else if (part.toolName === 'transitionDomain' && part.result?.success) {
          if (part.result.nextDomain) {
            yield { type: 'domain_change', domain: part.result.nextDomain };
          }
        }
      }
    }

    // Save assistant message
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
  } catch (error) {
    console.error('Conversation error:', error);
    yield {
      type: 'error',
      content: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}
