import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/db/supabase';
import { handleApiError, ValidationError } from '@/lib/errors';
import crypto from 'crypto';

// Request validation schema
const createSessionSchema = z.object({
  email: z.string().email('Valid email is required'),
});

// POST /api/session - Create a new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createSessionSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { email } = validation.data;

    // Generate recovery token
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    const recoveryTokenHash = crypto
      .createHash('sha256')
      .update(recoveryToken)
      .digest('hex');

    // Create session
    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        email,
        recovery_token_hash: recoveryTokenHash,
        status: 'started',
        current_domain: 'market',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create session');
    }

    return NextResponse.json({
      session: {
        id: session.id,
        email: session.email,
        status: session.status,
        currentDomain: session.current_domain,
        createdAt: session.created_at,
        expiresAt: session.expires_at,
      },
      recoveryToken,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
