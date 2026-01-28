import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getValidSession } from '@/lib/db/session';
import { getSessionMessages } from '@/lib/db/messages';
import { streamConversation, generateWelcomeMessage } from '@/lib/ai/agents/conversation';
import { handleApiError, ValidationError } from '@/lib/errors';

const chatRequestSchema = z.object({
  sessionId: z.string().uuid(),
  content: z.string().min(1).max(10000),
});

// POST /api/chat - Send a message and stream response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = chatRequestSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { sessionId, content } = validation.data;

    // Validate session exists and is active
    const session = await getValidSession(sessionId);

    // Check if session is in a valid state for chat
    if (session.status === 'completed' || session.status === 'abandoned') {
      throw new ValidationError('This session is no longer active');
    }

    // Check if this is the first message (need welcome message first)
    const existingMessages = await getSessionMessages(sessionId);
    if (existingMessages.length === 0) {
      // Generate welcome message first
      await generateWelcomeMessage(sessionId);
    }

    // Create SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of streamConversation(
            sessionId,
            content,
            session.current_domain
          )) {
            const data = JSON.stringify(event);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          let errMsg = 'Stream error';
          if (error instanceof Error) {
            errMsg = error.message;
          } else if (typeof error === 'string') {
            errMsg = error;
          } else if (error && typeof error === 'object') {
            errMsg = (error as Record<string, unknown>).message as string
              || (error as Record<string, unknown>).error as string
              || JSON.stringify(error);
          }
          const errorData = JSON.stringify({
            type: 'error',
            content: errMsg,
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
