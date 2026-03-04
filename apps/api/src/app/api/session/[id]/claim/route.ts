import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/db/supabase';
import { getValidSession } from '@/lib/db/session';
import { handleApiError, ValidationError } from '@/lib/errors';
import crypto from 'crypto';

const claimSchema = z.object({
  email: z.string().email('Valid email is required'),
});

/**
 * POST /api/session/[id]/claim
 *
 * Promotes a guest session to an authenticated session.
 * - Validates the session exists, is unexpired, and is currently a guest
 * - Updates email, clears guest flags, issues a fresh recovery token
 * - All existing messages/inputs are preserved (same session ID)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: sessionId } = params;

    const body = await request.json();
    const validation = claimSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { email } = validation.data;

    // Validate session exists and hasn't expired
    const session = await getValidSession(sessionId);

    if (!(session as any).is_guest) {
      throw new ValidationError('This session is already claimed');
    }

    // Generate a fresh recovery token for the now-authenticated session
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    const recoveryTokenHash = crypto
      .createHash('sha256')
      .update(recoveryToken)
      .digest('hex');

    // Promote: set real email, clear guest flags, store new token hash
    const { data: updatedSession, error } = await supabase
      .from('sessions')
      .update({
        email,
        is_guest: false,
        guest_expires_at: null,
        recovery_token_hash: recoveryTokenHash,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error || !updatedSession) {
      throw new Error('Failed to claim session');
    }

    return NextResponse.json({
      session: {
        id: updatedSession.id,
        email: updatedSession.email,
        status: updatedSession.status,
        currentDomain: updatedSession.current_domain,
        createdAt: updatedSession.created_at,
        expiresAt: updatedSession.expires_at,
        isGuest: false,
      },
      recoveryToken,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
