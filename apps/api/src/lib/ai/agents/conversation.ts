import { streamText, tool } from 'ai';
import { z } from 'zod';
import { anthropic, models, modelConfig } from '../client';
import { SYSTEM_PROMPT, WELCOME_MESSAGE } from '../prompts/system';
import { getDomainConfig, getNextDomain } from '../prompts/domains';
import { classifyConfidence } from '../confidence/classifier';
import { saveInput } from '@/lib/db/inputs';
import { saveMessage, getRecentMessages, formatMessagesForLLM } from '@/lib/db/messages';
import { updateSessionDomain, updateSessionStatus } from '@/lib/db/session';
import type { DomainType, ChatMessage } from '@atlas/types';

interface ConversationContext {
  sessionId: string;
  currentDomain: DomainType;
}

// Define the tools available to the conversation agent
const conversationTools = {
  recordInput: tool({
    description: 'Record a captured input from the user with confidence classification',
    parameters: z.object({
      questionId: z.string().describe('Identifier for the question being answered'),
      userResponse: z.string().describe('The user response to capture'),
      summary: z.string().describe('Brief summary of what was captured'),
    }),
    execute: async ({ questionId, userResponse, summary }, { sessionId, currentDomain }: ConversationContext) => {
      // Classify confidence
      const { level, rationale, extractedData } = await classifyConfidence(
        userResponse,
        questionId
      );

      // Save to database
      const input = await saveInput({
        sessionId,
        domain: currentDomain,
        questionId,
        userResponse,
        extractedData,
        confidenceLevel: level,
        confidenceRationale: rationale,
      });

      return {
        success: true,
        input: {
          id: input.id,
          questionId,
          confidence: level,
          summary,
        },
      };
    },
  }),

  transitionDomain: tool({
    description: 'Transition to the next domain in the assessment',
    parameters: z.object({
      currentDomainSummary: z.string().describe('Brief summary of what was learned in the current domain'),
    }),
    execute: async ({ currentDomainSummary }, { sessionId, currentDomain }: ConversationContext) => {
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
    },
  }),
};

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

    // Build context for tools
    const toolContext: ConversationContext = {
      sessionId,
      currentDomain,
    };

    // Create the streaming response
    const result = await streamText({
      model: anthropic(models.conversation),
      system: `${SYSTEM_PROMPT}

Current Domain: ${domainConfig.name}
Domain Description: ${domainConfig.description}
Key topics to explore: ${domainConfig.keyQuestions.map((q) => q.id).join(', ')}

When the conversation naturally covers the key topics for this domain, use the transitionDomain tool to move to the next domain.`,
      messages: [
        ...formattedMessages,
        { role: 'user', content: userMessage },
      ],
      maxTokens: modelConfig.conversation.maxTokens,
      temperature: modelConfig.conversation.temperature,
    });

    let fullText = '';

    // Stream the response
    for await (const chunk of result.textStream) {
      fullText += chunk;
      yield { type: 'text', content: chunk };
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
