import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import { getValidSession } from '@/lib/db/session';
import { handleApiError } from '@/lib/errors';
import type { FileTopicMapping } from '@atlas/types';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { mappingId: string } }
) {
  const { mappingId } = params;

  try {
    // Fetch the mapping to validate ownership and retrieve details
    const { data: mappingRaw, error: mapError } = await supabase
      .from('file_topic_mappings')
      .select('*')
      .eq('id', mappingId)
      .single();

    if (mapError || !mappingRaw) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 });
    }

    const mapping = mappingRaw as FileTopicMapping;

    // Validate the session
    await getValidSession(mapping.session_id);

    // Delete the corresponding input only if it was sourced from this file
    await supabase
      .from('inputs')
      .delete()
      .eq('session_id', mapping.session_id)
      .eq('question_id', mapping.question_id)
      .eq('source_file_id', mapping.file_id);

    // Delete the mapping row
    const { error } = await supabase
      .from('file_topic_mappings')
      .delete()
      .eq('id', mappingId);

    if (error) throw new Error(error.message);

    // Decrement topics_found on the parent session file
    const { data: fileRow } = await supabase
      .from('session_files')
      .select('topics_found')
      .eq('id', mapping.file_id)
      .single();

    const currentCount = (fileRow as { topics_found: number } | null)?.topics_found ?? 0;
    if (currentCount > 0) {
      await supabase
        .from('session_files')
        .update({ topics_found: currentCount - 1 } as never)
        .eq('id', mapping.file_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
