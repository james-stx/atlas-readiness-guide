import { supabase } from './supabase';
import type { SessionFile, FileTopicMapping, FileStatus, DocumentType, DomainType, ConfidenceLevel } from '@atlas/types';

// ──────────────────────────────────────────────
// session_files
// ──────────────────────────────────────────────

export async function createSessionFile(params: {
  sessionId: string;
  filename: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
}): Promise<SessionFile> {
  const { data, error } = await supabase
    .from('session_files')
    .insert({
      session_id: params.sessionId,
      filename: params.filename,
      storage_path: params.storagePath,
      mime_type: params.mimeType,
      size_bytes: params.sizeBytes,
      status: 'pending' as FileStatus,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create session file: ${error.message}`);
  return data as SessionFile;
}

export async function updateSessionFile(
  fileId: string,
  updates: {
    status?: FileStatus;
    detectedType?: DocumentType;
    topicsFound?: number;
    processedAt?: string;
  }
): Promise<SessionFile> {
  const payload: Record<string, unknown> = {};
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.detectedType !== undefined) payload.detected_type = updates.detectedType;
  if (updates.topicsFound !== undefined) payload.topics_found = updates.topicsFound;
  if (updates.processedAt !== undefined) payload.processed_at = updates.processedAt;

  const { data, error } = await supabase
    .from('session_files')
    .update(payload)
    .eq('id', fileId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update session file: ${error.message}`);
  return data as SessionFile;
}

export async function getSessionFile(fileId: string): Promise<SessionFile> {
  const { data, error } = await supabase
    .from('session_files')
    .select('*')
    .eq('id', fileId)
    .single();

  if (error) throw new Error(`Failed to get session file: ${error.message}`);
  return data as SessionFile;
}

export async function getSessionFiles(sessionId: string): Promise<SessionFile[]> {
  const { data, error } = await supabase
    .from('session_files')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to get session files: ${error.message}`);
  return (data || []) as SessionFile[];
}

export async function deleteSessionFile(fileId: string): Promise<void> {
  const { error } = await supabase
    .from('session_files')
    .delete()
    .eq('id', fileId);

  if (error) throw new Error(`Failed to delete session file: ${error.message}`);
}

export async function countSessionFiles(sessionId: string): Promise<number> {
  const { count, error } = await supabase
    .from('session_files')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .neq('status', 'failed');

  if (error) throw new Error(`Failed to count session files: ${error.message}`);
  return count ?? 0;
}

// ──────────────────────────────────────────────
// file_topic_mappings
// ──────────────────────────────────────────────

export async function createFileTopicMapping(params: {
  fileId: string;
  sessionId: string;
  domain: DomainType;
  questionId: string;
  extractedContent: string;
  confidenceLevel: ConfidenceLevel;
  confidenceRationale?: string;
  pageReference?: string;
}): Promise<FileTopicMapping> {
  const { data, error } = await supabase
    .from('file_topic_mappings')
    .insert({
      file_id: params.fileId,
      session_id: params.sessionId,
      domain: params.domain,
      question_id: params.questionId,
      extracted_content: params.extractedContent,
      confidence_level: params.confidenceLevel,
      confidence_rationale: params.confidenceRationale ?? null,
      page_reference: params.pageReference ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create file topic mapping: ${error.message}`);
  return data as FileTopicMapping;
}

export async function getFileMappingsForSession(sessionId: string): Promise<FileTopicMapping[]> {
  const { data, error } = await supabase
    .from('file_topic_mappings')
    .select('*, session_files(filename)')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to get file mappings: ${error.message}`);
  return (data || []) as FileTopicMapping[];
}

export async function getFileMappingsForFile(fileId: string): Promise<FileTopicMapping[]> {
  const { data, error } = await supabase
    .from('file_topic_mappings')
    .select('*')
    .eq('file_id', fileId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to get file mappings: ${error.message}`);
  return (data || []) as FileTopicMapping[];
}
