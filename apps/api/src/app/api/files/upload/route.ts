import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getValidSession } from '@/lib/db/session';
import { createSessionFile, countSessionFiles } from '@/lib/db/files';
import { supabase } from '@/lib/db/supabase';
import { getSupportedMimeTypes } from '@/lib/files/extractor';
import { handleApiError, ValidationError, GuestAccessError } from '@/lib/errors';

const MAX_FILES_PER_SESSION = 5;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

function getCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin') || '';
  const allowed = [
    'https://atlas-readiness-guide-web.vercel.app',
    'http://localhost:3000',
  ];
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Explicit preflight handler — multipart/form-data triggers a CORS preflight
// that Vercel's edge can intercept before middleware runs.
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: getCorsHeaders(request) });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const sessionId = formData.get('sessionId');

    if (!sessionId || typeof sessionId !== 'string') {
      throw new ValidationError('sessionId is required');
    }

    // Validate session — guests cannot upload
    const session = await getValidSession(sessionId);
    if (session.is_guest) {
      throw new GuestAccessError('document upload');
    }

    // Collect uploaded files
    const fileEntries = formData.getAll('files') as File[];
    if (!fileEntries.length) {
      throw new ValidationError('At least one file is required');
    }

    // Check total file count across session
    const existingCount = await countSessionFiles(sessionId);
    if (existingCount + fileEntries.length > MAX_FILES_PER_SESSION) {
      throw new ValidationError(
        `You can upload up to ${MAX_FILES_PER_SESSION} files per session. You already have ${existingCount}.`
      );
    }

    const supportedTypes = getSupportedMimeTypes();
    const savedFiles = [];

    for (const file of fileEntries) {
      // Validate type
      const mimeType = file.type || 'application/octet-stream';
      if (!supportedTypes.includes(mimeType.split(';')[0].trim())) {
        throw new ValidationError(
          `File "${file.name}" has unsupported type. Accepted: PDF, DOCX, PPTX, TXT, MD, CSV, HTML, JSON`
        );
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new ValidationError(
          `File "${file.name}" exceeds 20MB limit`
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileId = randomUUID();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${sessionId}/${fileId}-${safeName}`;

      // Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('session-documents')
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (storageError) {
        throw new Error(`Failed to upload "${file.name}": ${storageError.message}`);
      }

      // Create DB record
      const sessionFile = await createSessionFile({
        sessionId,
        filename: file.name,
        storagePath,
        mimeType,
        sizeBytes: file.size,
      });

      savedFiles.push({ id: sessionFile.id, filename: sessionFile.filename, status: sessionFile.status });
    }

    return NextResponse.json({ files: savedFiles }, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    const errResponse = handleApiError(error);
    Object.entries(getCorsHeaders(request)).forEach(([k, v]) => errResponse.headers.set(k, v));
    return errResponse;
  }
}
