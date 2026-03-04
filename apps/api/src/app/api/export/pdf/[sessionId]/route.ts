import { NextRequest, NextResponse } from 'next/server';

// GET /api/export/pdf/[sessionId]
// PDF download has been removed. Use POST /api/export/send/[sessionId] to
// receive the report as a PDF email attachment instead.
export async function GET(
  _request: NextRequest,
  _context: { params: { sessionId: string } }
) {
  return NextResponse.json(
    { error: 'PDF download is no longer available. Use the Email Report option to receive your report as a PDF attachment.' },
    { status: 410 }
  );
}
