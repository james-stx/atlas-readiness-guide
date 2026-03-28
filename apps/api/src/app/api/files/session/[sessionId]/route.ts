import { NextRequest, NextResponse } from 'next/server';
import { getValidSession } from '@/lib/db/session';
import { getSessionFiles, getFileMappingsForSession } from '@/lib/db/files';
import { handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    await getValidSession(sessionId);

    const [files, mappings] = await Promise.all([
      getSessionFiles(sessionId),
      getFileMappingsForSession(sessionId),
    ]);

    return NextResponse.json({ files, mappings });
  } catch (error) {
    return handleApiError(error);
  }
}
