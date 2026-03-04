import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/db/supabase';
import { handleApiError, ValidationError } from '@/lib/errors';
import crypto from 'crypto';

// Request validation schema
const createSessionSchema = z.union([
  // Guest session — no email required
  z.object({
    isGuest: z.literal(true),
    email: z.string().optional(),
  }),
  // Authenticated session — email required
  z.object({
    isGuest: z.literal(false).optional(),
    email: z.string().email('Valid email is required'),
  }),
]);

// POST /api/session - Create a new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createSessionSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const isGuest = validation.data.isGuest === true;

    // For guest sessions use a stable placeholder so the NOT NULL constraint is met.
    // The placeholder is deterministic per-request but never exposed to the user.
    const guestEmail = `guest-${crypto.randomUUID()}@atlas-guest.internal`;
    const email = isGuest ? guestEmail : (validation.data.email as string);

    // Generate recovery token (still useful for non-guest sessions)
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    const recoveryTokenHash = crypto
      .createHash('sha256')
      .update(recoveryToken)
      .digest('hex');

    // Build insert payload — include is_guest only if the column exists (added by migration
    // 001_add_guest_session_fields.sql). Using a spread so the field can be omitted gracefully
    // in environments where the migration hasn't run yet.
    const insertPayload: Record<string, unknown> = {
      email,
      recovery_token_hash: recoveryTokenHash,
      status: 'started',
      current_domain: 'market',
      is_guest: isGuest,
    };

    // Create session
    const { data: session, error } = await supabase
      .from('sessions')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create session');
    }

    return NextResponse.json({
      session: {
        id: session.id,
        email: isGuest ? '' : session.email,
        status: session.status,
        currentDomain: session.current_domain,
        createdAt: session.created_at,
        expiresAt: session.expires_at,
        isGuest,
      },
      recoveryToken: isGuest ? null : recoveryToken,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
