import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { supabase } from '@/lib/db/supabase';
import {
  handleApiError,
  ValidationError,
  SessionNotFoundError,
  SessionExpiredError,
} from '@/lib/errors';

const recoverSessionSchema = z.object({
  recoveryToken: z.string().min(1, 'Recovery token is required'),
});

// POST /api/session/recover - Recover a session using recovery token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = recoverSessionSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { recoveryToken } = validation.data;

    // Hash the provided token to match against stored hash
    const recoveryTokenHash = crypto
      .createHash('sha256')
      .update(recoveryToken)
      .digest('hex');

    // Find session by recovery token hash
    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('recovery_token_hash', recoveryTokenHash)
      .single();

    if (error || !session) {
      throw new SessionNotFoundError('recovery token');
    }

    // Check if session has expired
    if (new Date(session.expires_at) < new Date()) {
      throw new SessionExpiredError();
    }

    // Check if session is abandoned or completed
    if (session.status === 'abandoned') {
      throw new ValidationError('This session has been abandoned');
    }

    // Fetch associated messages and inputs for the session
    const [messagesResult, inputsResult] = await Promise.all([
      supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true }),
      supabase
        .from('inputs')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true }),
    ]);

    return NextResponse.json({
      session: {
        id: session.id,
        email: session.email,
        status: session.status,
        currentDomain: session.current_domain,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        expiresAt: session.expires_at,
      },
      messages: messagesResult.data || [],
      inputs: inputsResult.data || [],
    });
  } catch (error) {
    return handleApiError(error);
  }
}
