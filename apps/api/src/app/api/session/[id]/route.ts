import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/db/supabase';
import {
  handleApiError,
  ValidationError,
  SessionNotFoundError,
  SessionExpiredError,
} from '@/lib/errors';

// GET /api/session/[id] - Get session by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionId)) {
      throw new ValidationError('Invalid session ID format');
    }

    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !session) {
      throw new SessionNotFoundError(sessionId);
    }

    // Check if session has expired
    if (new Date(session.expires_at) < new Date()) {
      throw new SessionExpiredError();
    }

    return NextResponse.json({
      session: {
        id: session.id,
        email: session.email,
        status: session.status,
        currentDomain: session.current_domain,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        expiresAt: session.expires_at,
        metadata: session.metadata,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Update session schema
const updateSessionSchema = z.object({
  status: z
    .enum([
      'started',
      'in_progress',
      'validating',
      'synthesizing',
      'completed',
      'abandoned',
    ])
    .optional(),
  currentDomain: z
    .enum(['market', 'product', 'gtm', 'operations', 'financials'])
    .optional(),
  metadata: z.record(z.unknown()).optional(),
});

// PATCH /api/session/[id] - Update session
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json();

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionId)) {
      throw new ValidationError('Invalid session ID format');
    }

    const validation = updateSessionSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const updates: Record<string, unknown> = {};
    if (validation.data.status) {
      updates.status = validation.data.status;
    }
    if (validation.data.currentDomain) {
      updates.current_domain = validation.data.currentDomain;
    }
    if (validation.data.metadata) {
      updates.metadata = validation.data.metadata;
    }

    if (Object.keys(updates).length === 0) {
      throw new ValidationError('No valid fields to update');
    }

    // First check if session exists and is not expired
    const { data: existingSession } = await supabase
      .from('sessions')
      .select('expires_at')
      .eq('id', sessionId)
      .single();

    if (!existingSession) {
      throw new SessionNotFoundError(sessionId);
    }

    if (new Date(existingSession.expires_at) < new Date()) {
      throw new SessionExpiredError();
    }

    // Update session
    const { data: session, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update session');
    }

    return NextResponse.json({
      session: {
        id: session.id,
        email: session.email,
        status: session.status,
        currentDomain: session.current_domain,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        expiresAt: session.expires_at,
        metadata: session.metadata,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
