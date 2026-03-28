import { NextRequest, NextResponse } from 'next/server';
import { getValidSession } from '@/lib/db/session';
import { getSessionFile, updateSessionFile, createFileTopicMapping } from '@/lib/db/files';
import { getSessionInputs, saveInput } from '@/lib/db/inputs';
import { supabase } from '@/lib/db/supabase';
import { extractText } from '@/lib/files/extractor';
import { classifyDocument, extractTopicMappings } from '@/lib/files/processor';
import { handleApiError, ValidationError } from '@/lib/errors';
import type { DomainType, Input } from '@atlas/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const { fileId } = params;

  try {
    // Get the file record
    const sessionFile = await getSessionFile(fileId);

    // Validate session ownership
    await getValidSession(sessionFile.session_id);

    if (sessionFile.status === 'complete') {
      return NextResponse.json({ message: 'Already processed', file: sessionFile });
    }

    // Mark as processing
    await updateSessionFile(fileId, { status: 'processing' });

    // Download from Supabase Storage
    const { data: storageData, error: downloadError } = await supabase.storage
      .from('session-documents')
      .download(sessionFile.storage_path);

    if (downloadError || !storageData) {
      await updateSessionFile(fileId, { status: 'failed' });
      throw new Error(`Failed to download file: ${downloadError?.message}`);
    }

    const buffer = Buffer.from(await storageData.arrayBuffer());

    // Extract text
    let text: string;
    try {
      text = await extractText(buffer, sessionFile.mime_type);
    } catch (err) {
      await updateSessionFile(fileId, { status: 'failed' });
      throw new ValidationError(err instanceof Error ? err.message : 'Failed to extract text from file');
    }

    console.log(`[Atlas Files] Extracted text: ${text.length} chars from ${sessionFile.filename}`);

    // Classify document type
    const detectedType = await classifyDocument(text);
    console.log(`[Atlas Files] Classified as: ${detectedType}`);

    // Get existing inputs to skip already-answered topics
    const existingInputs = await getSessionInputs(sessionFile.session_id);
    const existingQuestionIds = existingInputs.map(i => i.question_id);

    // Extract topic mappings
    const mappings = await extractTopicMappings(text, detectedType, existingQuestionIds);
    console.log(`[Atlas Files] Topic mappings found: ${mappings.length}`);

    // Save each mapping and create inputs for uncovered topics
    const savedMappings = [];
    const savedInputs: Input[] = [];
    for (const mapping of mappings) {
      // Save to file_topic_mappings
      const saved = await createFileTopicMapping({
        fileId,
        sessionId: sessionFile.session_id,
        domain: mapping.domain as DomainType,
        questionId: mapping.question_id,
        extractedContent: mapping.extracted_content,
        confidenceLevel: mapping.confidence_level,
        confidenceRationale: mapping.confidence_rationale,
        pageReference: mapping.page_reference,
      });
      savedMappings.push(saved);

      // Create input only for topics not yet answered manually
      if (!existingQuestionIds.includes(mapping.question_id)) {
        const input = await saveInput({
          sessionId: sessionFile.session_id,
          domain: mapping.domain as DomainType,
          questionId: mapping.question_id,
          userResponse: mapping.extracted_content,
          extractedData: {
            summary: mapping.extracted_content,
            keyInsight: mapping.extracted_content,
            strengths: mapping.strengths ?? [],
            considerations: mapping.considerations ?? [],
          },
          confidenceLevel: mapping.confidence_level,
          confidenceRationale: mapping.confidence_rationale || 'Extracted from uploaded document',
          sourceFileId: fileId,
        });
        savedInputs.push(input);
      }
    }

    // Update file record to complete
    const updatedFile = await updateSessionFile(fileId, {
      status: 'complete',
      detectedType,
      topicsFound: savedMappings.length,
      processedAt: new Date().toISOString(),
    });

    return NextResponse.json({ file: updatedFile, mappings: savedMappings, inputs: savedInputs });
  } catch (error) {
    // Mark failed if we have a fileId and something went wrong after processing started
    try {
      const current = await getSessionFile(fileId);
      if (current.status === 'processing') {
        await updateSessionFile(fileId, { status: 'failed' });
      }
    } catch {
      // ignore cleanup error
    }
    return handleApiError(error);
  }
}
