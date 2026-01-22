import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import { getValidSession } from '@/lib/db/session';
import { resend, EMAIL_CONFIG, renderSnapshotEmail, getPlainTextVersion } from '@/lib/email';
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

    // Build the PDF download URL
    const baseUrl = process.env.API_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3001';
    const downloadUrl = `${baseUrl}/api/export/pdf/${sessionId}`;

    // Render email HTML
    const emailHtml = renderSnapshotEmail({
      snapshot: snapshot as Snapshot,
      email: session.email,
      downloadUrl,
    });

    // Get plain text version
    const emailText = getPlainTextVersion(snapshot as Snapshot, session.email);

    // Send the email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: session.email,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: 'Your Atlas Readiness Snapshot',
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
