import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import { getValidSession } from '@/lib/db/session';
import { getResendClient, EMAIL_CONFIG, renderSnapshotEmail, getPlainTextVersion } from '@/lib/email';
import { handleApiError, ValidationError, AppError } from '@/lib/errors';
import type { Snapshot } from '@atlas/types';

// POST /api/export/send/[sessionId] - Send snapshot email
export async function POST(
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
    const { data: rawSnapshot, error } = await supabase
      .from('snapshots')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !rawSnapshot) {
      throw new ValidationError('No snapshot found for this session. Please generate a snapshot first.');
    }

    // Enrich snapshot with V3 data from raw_output (same pattern as GET /snapshot/[sessionId])
    let snapshot: Snapshot = { ...rawSnapshot } as Snapshot;
    if (rawSnapshot.raw_output) {
      try {
        const rawData = typeof rawSnapshot.raw_output === 'string'
          ? JSON.parse(rawSnapshot.raw_output)
          : rawSnapshot.raw_output;
        if (rawData.v3) (snapshot as any).v3 = rawData.v3;
        if (rawData.key_stats) (snapshot as any).key_stats = rawData.key_stats;
        if (rawData.readiness_level) (snapshot as any).readiness_level = rawData.readiness_level;
        if (rawData.verdict_summary) (snapshot as any).verdict_summary = rawData.verdict_summary;
      } catch {
        // Non-fatal — continue with un-enriched snapshot
      }
    }

    // Subject includes the email domain for personalisation
    const emailDomain = session.email.includes('@') ? session.email.split('@')[1] : session.email;
    const subject = `Your Atlas Readiness Report — ${emailDomain}`;

    // Render email HTML
    const emailHtml = renderSnapshotEmail({
      snapshot,
      email: session.email,
    });

    // Get plain text version
    const emailText = getPlainTextVersion(snapshot, session.email);

    // Send the email
    const { data: emailResult, error: emailError } = await getResendClient().emails.send({
      from: EMAIL_CONFIG.from,
      to: session.email,
      replyTo: EMAIL_CONFIG.replyTo,
      subject,
      html: emailHtml,
      text: emailText,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      throw new AppError('Failed to send email. Please try again later.', 500, 'EMAIL_SEND_FAILED');
    }

    return NextResponse.json({
      success: true,
      message: `Snapshot sent to ${session.email}`,
      emailId: emailResult?.id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
