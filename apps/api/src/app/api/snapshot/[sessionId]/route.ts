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

    if (!snapshot) {
      return NextResponse.json({ snapshot: null });
    }

    // Parse raw_output to extract V3 data and other fields
    let enrichedSnapshot = { ...snapshot };
    if (snapshot.raw_output) {
      try {
        const rawData = typeof snapshot.raw_output === 'string'
          ? JSON.parse(snapshot.raw_output)
          : snapshot.raw_output;

        // Extract V3 data and other fields from raw_output
        if (rawData.v3) {
          enrichedSnapshot.v3 = rawData.v3;
        }
        if (rawData.key_stats) {
          enrichedSnapshot.key_stats = rawData.key_stats;
        }
        if (rawData.readiness_level) {
          enrichedSnapshot.readiness_level = rawData.readiness_level;
        }
        if (rawData.verdict_summary) {
          enrichedSnapshot.verdict_summary = rawData.verdict_summary;
        }
      } catch (parseError) {
        console.error('Failed to parse raw_output:', parseError);
      }
    }

    return NextResponse.json({ snapshot: enrichedSnapshot });
  } catch (error) {
    return handleApiError(error);
  }
}
