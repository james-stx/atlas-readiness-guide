import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { supabase } from '@/lib/db/supabase';
import { getValidSession } from '@/lib/db/session';
import { SnapshotDocument } from '@/lib/pdf';
import { handleApiError, ValidationError } from '@/lib/errors';
import type { Snapshot, Session } from '@atlas/types';

// GET /api/export/pdf/[sessionId] - Generate and download PDF
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

    // Get session
    const session = await getValidSession(sessionId);

    // Get the snapshot
    const { data: snapshot, error } = await supabase
      .from('snapshots')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !snapshot) {
      throw new ValidationError('No snapshot found for this session. Please generate a snapshot first.');
    }

    // Generate the PDF
    const pdfBuffer = await renderToBuffer(
      SnapshotDocument({
        snapshot: snapshot as Snapshot,
        session: session as Session,
      })
    );

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="atlas-readiness-snapshot-${sessionId.slice(0, 8)}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'private, no-cache',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
