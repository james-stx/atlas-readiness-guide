import { NextRequest, NextResponse } from 'next/server';
import { getValidSession } from '@/lib/db/session';
import { getSessionFile } from '@/lib/db/files';
import { supabase } from '@/lib/db/supabase';
import { handleApiError } from '@/lib/errors';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const { fileId } = params;

  try {
    const sessionFile = await getSessionFile(fileId);
    await getValidSession(sessionFile.session_id);

    // Delete inputs sourced from this file
    await supabase
      .from('inputs')
      .delete()
      .eq('source_file_id', fileId);

    // Delete the file from storage
    await supabase.storage
      .from('session-documents')
      .remove([sessionFile.storage_path]);

    // Delete the DB record (cascades to file_topic_mappings)
    const { error } = await supabase
      .from('session_files')
      .delete()
      .eq('id', fileId);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
