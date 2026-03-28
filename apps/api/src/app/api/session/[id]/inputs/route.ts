import { NextRequest, NextResponse } from 'next/server';
import { getValidSession } from '@/lib/db/session';
import { getSessionInputs } from '@/lib/db/inputs';
import { handleApiError } from '@/lib/errors';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getValidSession(params.id);
    const inputs = await getSessionInputs(session.id);
    return NextResponse.json({ inputs });
  } catch (error) {
    return handleApiError(error);
  }
}
