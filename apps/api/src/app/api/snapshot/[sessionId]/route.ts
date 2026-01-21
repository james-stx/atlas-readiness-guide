import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import { getValidSession } from '@/lib/db/session';
import { handleApiError, ValidationError } from '@/lib/errors';

// GET /api/snapshot/[sessionId] - Get snapshot for a session
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionId)) {
      throw new ValidationError('Invalid session ID format');
    }

    // Validate session exists
    await getValidSession(sessionId);

    // Get the most recent snapshot for this session
    const { data: snapshot, error } = await supabase
      .from('snapshots')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      throw new Error(`Failed to get snapshot: ${error.message}`);
    }

    return NextResponse.json({ snapshot: snapshot || null });
  } catch (error) {
    return handleApiError(error);
  }
}
