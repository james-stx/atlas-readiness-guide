import { generateText } from 'ai';
import { anthropic, models, modelConfig } from '../ai/client';
import { DOMAIN_CONFIGS } from '../ai/prompts/domains';
import type { DocumentType, DomainType, ConfidenceLevel } from '@atlas/types';

export interface TopicExtractionResult {
  domain: DomainType;
  question_id: string;
  extracted_content: string;
  confidence_level: ConfidenceLevel;
  confidence_rationale: string;
  page_reference?: string;
  strengths?: string[];
  considerations?: string[];
}

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  pitch_deck: 'Pitch Deck',
  business_plan: 'Business Plan',
  gtm_strategy: 'GTM Strategy',
  financial_model: 'Financial Model',
  market_research: 'Market Research',
  competitive_analysis: 'Competitive Analysis',
  other: 'Document',
};

export function getDocumentTypeLabel(type: DocumentType): string {
  return DOCUMENT_TYPE_LABELS[type];
}

/**
 * Classify the type of document using Claude Haiku (fast, cheap).
 */
export async function classifyDocument(text: string): Promise<DocumentType> {
  const preview = text.slice(0, 3000);
  const valid: DocumentType[] = [
    'pitch_deck', 'business_plan', 'gtm_strategy', 'financial_model',
    'market_research', 'competitive_analysis', 'other',
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { text: result } = await generateText({
    model: anthropic(models.classification) as any,
    maxTokens: 32,
    temperature: 0,
    abortSignal: AbortSignal.timeout(15_000),
    prompt: `Classify this document as exactly one of: ${valid.join(', ')}

Respond with only the type identifier, nothing else.

Document preview:
${preview}`,
  });

  const raw = result.trim().toLowerCase();
  return valid.includes(raw as DocumentType) ? (raw as DocumentType) : 'other';
}

/**
 * Build the full topic list for injection into the extraction prompt.
 */
function buildTopicList(skipQuestionIds: string[]): string {
  const lines: string[] = [];
  for (const [domain, config] of Object.entries(DOMAIN_CONFIGS)) {
    for (const q of config.keyQuestions) {
      if (skipQuestionIds.includes(q.id)) continue;
      lines.push(`- domain: "${domain}" | question_id: "${q.id}" | question: "${q.question}"`);
    }
  }
  return lines.join('\n');
}

/**
 * Extract topic mappings from document text using Claude Sonnet.
 * Skips question IDs already answered by the user.
 */
export async function extractTopicMappings(
  text: string,
  documentType: DocumentType,
  existingQuestionIds: string[]
): Promise<TopicExtractionResult[]> {
  const topicList = buildTopicList(existingQuestionIds);

  if (!topicList.trim()) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { text: result } = await generateText({
    model: anthropic(models.conversation) as any,
    maxTokens: 16000,
    temperature: 0.1,
    abortSignal: AbortSignal.timeout(110_000),
    prompt: `You are analysing a ${getDocumentTypeLabel(documentType)} to extract information relevant to a U.S. expansion readiness assessment.

TOPICS TO IDENTIFY (only extract topics genuinely addressed in the document):
${topicList}

INSTRUCTIONS:
1. Return ONLY topics that have real, relevant content in the document. Do not fabricate or infer beyond what is written.
2. For each topic, extract the most relevant excerpt or a faithful paraphrase (1-3 sentences max).
3. Assign confidence:
   - "high": specific data, metrics, named customers, documented evidence
   - "medium": reasonable statements, general plans, informal validation
   - "low": vague aspirations, "we plan to", unvalidated assumptions
4. Include page_reference (e.g. "Slide 4" or "Page 2") only if clearly identifiable.
5. For each topic, generate:
   - "strengths": 1-2 specific positive observations about the quality or specificity of this information (one clear sentence each)
   - "considerations": 1-2 gaps, assumptions, or areas that need validation or more detail (one clear sentence each)
6. If no topics are found, return [].

DOCUMENT TEXT:
${text}

Return ONLY a valid JSON array:
[
  {
    "domain": "market",
    "question_id": "target_segment",
    "extracted_content": "Primary target is mid-market SaaS companies with 50-200 employees",
    "confidence_level": "high",
    "confidence_rationale": "Specific company size range defined with named segment",
    "page_reference": "Slide 4",
    "strengths": ["Clear ICP criteria with specific company size range"],
    "considerations": ["No mention of how this segment was validated with customers"]
  }
]`,
  });

  const raw = result.trim();

  console.log(`[Atlas Files] Extraction raw response length: ${raw.length} chars`);

  try {
    const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) {
      console.error('[Atlas Files] Extraction returned non-array:', typeof parsed);
      return [];
    }

    const validDomains = Object.keys(DOMAIN_CONFIGS) as DomainType[];
    const allQuestionIds = validDomains.flatMap(d =>
      DOMAIN_CONFIGS[d].keyQuestions.map(q => q.id)
    );

    const filtered = parsed.filter((item: TopicExtractionResult) =>
      item.domain &&
      item.question_id &&
      item.extracted_content &&
      item.confidence_level &&
      validDomains.includes(item.domain as DomainType) &&
      allQuestionIds.includes(item.question_id) &&
      !existingQuestionIds.includes(item.question_id) &&
      ['high', 'medium', 'low'].includes(item.confidence_level)
    );
    console.log(`[Atlas Files] Parsed ${parsed.length} items, ${filtered.length} passed validation`);
    if (parsed.length > 0 && filtered.length === 0) {
      console.log('[Atlas Files] First rejected item:', JSON.stringify(parsed[0]).slice(0, 200));
    }
    return filtered;
  } catch (err) {
    console.error('[Atlas Files] Failed to parse topic extraction JSON:', (err as Error).message);
    console.error('[Atlas Files] Raw response start:', raw.slice(0, 300));
    console.error('[Atlas Files] Raw response end:', raw.slice(-200));
    return [];
  }
}
