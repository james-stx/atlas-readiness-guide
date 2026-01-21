import { generateObject } from 'ai';
import { z } from 'zod';
import { anthropic, models, modelConfig } from '../client';
import type { ConfidenceLevel } from '@atlas/types';

// Patterns for quick rule-based classification
const HIGH_CONFIDENCE_PATTERNS = [
  /\$[\d,]+[KMB]?/i,                           // Dollar amounts
  /\d+%/,                                       // Percentages
  /\d+\s*(customers?|users?|clients?|employees?)/i, // Specific counts
  /\d+\s*(months?|years?|weeks?)/i,            // Time periods
  /we have\s+\d+/i,                            // "We have X"
  /our\s+\w+\s+is\s+\d+/i,                     // "Our X is Y"
  /currently\s+(at|around|approximately)\s+\d+/i,
  /signed|contracted|closed|won/i,             // Deal language
  /documented|recorded|measured|tracked/i,     // Evidence language
];

const LOW_CONFIDENCE_PATTERNS = [
  /i\s+(think|guess|assume|believe|suppose)/i,
  /probably|maybe|perhaps|might|could be/i,
  /not\s+sure|don't\s+know|uncertain|unclear/i,
  /we\s+hope|hopefully|ideally/i,
  /should\s+be|ought\s+to/i,
  /estimated?|guesstimate|ballpark/i,
  /haven't\s+(validated|confirmed|tested)/i,
  /assumption|assuming/i,
  /we're\s+still\s+(figuring|working|planning)/i,
];

const MEDIUM_INDICATORS = [
  /based\s+on\s+(our|my)\s+experience/i,
  /similar\s+to|comparable/i,
  /early\s+(data|results|feedback)/i,
  /informal\s+(feedback|validation)/i,
  /we've\s+seen|we've\s+heard/i,
  /pilot|beta|trial/i,
];

/**
 * Quick rule-based classification
 * Returns null if patterns don't clearly indicate confidence
 */
export function quickClassify(text: string): ConfidenceLevel | null {
  const normalizedText = text.toLowerCase();

  // Check for low confidence patterns first (they override)
  const hasLowPattern = LOW_CONFIDENCE_PATTERNS.some((p) => p.test(text));
  if (hasLowPattern) {
    return 'low';
  }

  // Check for high confidence patterns
  const hasHighPattern = HIGH_CONFIDENCE_PATTERNS.some((p) => p.test(text));
  if (hasHighPattern) {
    return 'high';
  }

  // Check for medium indicators
  const hasMediumIndicator = MEDIUM_INDICATORS.some((p) => p.test(text));
  if (hasMediumIndicator) {
    return 'medium';
  }

  // Can't determine from patterns alone
  return null;
}

/**
 * LLM-based classification for ambiguous cases
 */
export async function llmClassify(
  userResponse: string,
  questionContext: string
): Promise<{ level: ConfidenceLevel; rationale: string }> {
  const { object } = await generateObject({
    model: anthropic(models.classification),
    schema: z.object({
      confidence: z.enum(['high', 'medium', 'low']),
      rationale: z.string(),
    }),
    system: `You are a confidence classifier for business assessment responses.

Classify the user's response confidence level:
- HIGH: Specific data, metrics, validated facts, documented evidence, concrete numbers
- MEDIUM: Reasonable estimates, informal validation, educated guesses based on experience
- LOW: Assumptions, hopes, unvalidated beliefs, vague statements, "I don't know"

Consider:
1. Specificity of the information provided
2. Whether it's based on data or assumption
3. Language indicating certainty or uncertainty
4. Evidence or validation mentioned`,
    prompt: `Question asked: "${questionContext}"

User's response: "${userResponse}"

Classify the confidence level of this response and explain why.`,
    ...modelConfig.classification,
  });

  return {
    level: object.confidence,
    rationale: object.rationale,
  };
}

/**
 * Extract structured data from response
 */
export async function extractData(
  userResponse: string,
  questionId: string
): Promise<Record<string, unknown>> {
  try {
    const { object } = await generateObject({
      model: anthropic(models.classification),
      schema: z.object({
        extractedData: z.record(z.unknown()),
      }),
      system: `Extract structured data from the user's response. Return key-value pairs of the important information mentioned. Keep keys simple and descriptive.`,
      prompt: `Question: ${questionId.replace(/_/g, ' ')}

Response: "${userResponse}"

Extract the key data points as structured fields.`,
      ...modelConfig.classification,
    });

    return object.extractedData;
  } catch {
    // If extraction fails, return basic extracted data
    return { rawResponse: userResponse.slice(0, 200) };
  }
}

/**
 * Main classification function - hybrid approach
 */
export async function classifyConfidence(
  userResponse: string,
  questionContext: string
): Promise<{
  level: ConfidenceLevel;
  rationale: string;
  extractedData: Record<string, unknown>;
}> {
  // Try quick classification first
  const quickResult = quickClassify(userResponse);

  if (quickResult) {
    // Extract data even for quick classifications
    const extractedData = await extractData(userResponse, questionContext);
    return {
      level: quickResult,
      rationale: `Classified based on language patterns in response`,
      extractedData,
    };
  }

  // Fall back to LLM classification
  const [llmResult, extractedData] = await Promise.all([
    llmClassify(userResponse, questionContext),
    extractData(userResponse, questionContext),
  ]);

  return {
    level: llmResult.level,
    rationale: llmResult.rationale,
    extractedData,
  };
}
