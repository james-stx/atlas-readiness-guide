import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getValidSession } from '@/lib/db/session';
import { createSessionFile, countSessionFiles } from '@/lib/db/files';
import { supabase } from '@/lib/db/supabase';
import { getSupportedMimeTypes } from '@/lib/files/extractor';
import { handleApiError, ValidationError, GuestAccessError } from '@/lib/errors';

const MAX_FILES_PER_SESSION = 5;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

// Accept JSON metadata only — file bytes are uploaded directly from the browser
// to Supabase Storage via a signed URL, bypassing Vercel's 4.5MB body limit.
interface FileMetadata {
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { sessionId: string; files: FileMetadata[] };
    const { sessionId, files: fileMetas } = body;

    if (!sessionId) throw new ValidationError('sessionId is required');
    if (!fileMetas?.length) throw new ValidationError('At least one file is required');

    const session = await getValidSession(sessionId);
    if (session.is_guest) throw new GuestAccessError('document upload');

    const existingCount = await countSessionFiles(sessionId);
    if (existingCount + fileMetas.length > MAX_FILES_PER_SESSION) {
      throw new ValidationError(
        `You can upload up to ${MAX_FILES_PER_SESSION} files per session. You already have ${existingCount}.`
      );
    }

    const supportedTypes = getSupportedMimeTypes();
    const results = [];

    for (const meta of fileMetas) {
      const mimeType = (meta.mimeType || 'application/octet-stream').split(';')[0].trim();

      if (!supportedTypes.includes(mimeType)) {
        throw new ValidationError(
          `"${meta.filename}" has unsupported type. Accepted: PDF, DOCX, PPTX, TXT, MD, CSV, HTML, JSON`
        );
      }
      if (meta.sizeBytes > MAX_FILE_SIZE_BYTES) {
        throw new ValidationError(`"${meta.filename}" exceeds 20MB limit`);
      }

      const fileId = randomUUID();
      const safeName = meta.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${sessionId}/${fileId}-${safeName}`;

      // Generate a signed URL so the browser can PUT the file directly to Supabase
      const { data: signedData, error: signedError } = await supabase.storage
        .from('session-documents')
        .createSignedUploadUrl(storagePath);

      if (signedError || !signedData) {
        throw new Error(`Failed to create upload URL for "${meta.filename}": ${signedError?.message}`);
      }

      // Create the DB record immediately (status = pending, file arrives shortly)
      const sessionFile = await createSessionFile({
        sessionId,
        filename: meta.filename,
        storagePath,
        mimeType,
        sizeBytes: meta.sizeBytes,
      });

      results.push({
        id: sessionFile.id,
        filename: sessionFile.filename,
        status: sessionFile.status,
        signedUrl: signedData.signedUrl,
      });
    }

    return NextResponse.json({ files: results }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
