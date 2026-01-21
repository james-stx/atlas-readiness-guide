import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getValidSession, updateSessionStatus } from '@/lib/db/session';
import { getSessionMessages } from '@/lib/db/messages';
import { generateWelcomeMessage } from '@/lib/ai/agents/conversation';
import { handleApiError, ValidationError } from '@/lib/errors';

const initRequestSchema = z.object({
  sessionId: z.string().uuid(),
});

// POST /api/chat/init - Initialize chat with welcome message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = initRequestSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { sessionId } = validation.data;

    // Validate session
    const session = await getValidSession(sessionId);

    // Check if chat already initialized
    const existingMessages = await getSessionMessages(sessionId);
    if (existingMessages.length > 0) {
      // Return existing messages
      return NextResponse.json({
        initialized: true,
        messages: existingMessages,
        isExisting: true,
      });
    }

    // Generate welcome message
    const welcomeMessage = await generateWelcomeMessage(sessionId);

    // Update session status to in_progress
    await updateSessionStatus(sessionId, 'in_progress');

    return NextResponse.json({
      initialized: true,
      messages: [welcomeMessage],
      isExisting: false,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
