import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getValidSession } from '@/lib/db/session';
import { getSessionInputs } from '@/lib/db/inputs';
import { handleApiError, ValidationError } from '@/lib/errors';
import type { DomainType, Input } from '@atlas/types';

const requestSchema = z.object({
  sessionId: z.string().uuid(),
  domain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
});

interface DomainSummary {
  domain: DomainType;
  topicsCovered: number;
  totalTopics: number;
  confidenceBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  keyThemes: string[];
  suggestedFocus: string | null;
  overallAssessment: string;
}

// Domain topic counts
const DOMAIN_TOPIC_COUNTS: Record<DomainType, number> = {
  market: 5,
  product: 5,
  gtm: 5,
  operations: 5,
  financials: 5,
};

// POST /api/domain/summary - Get domain summary for a session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { sessionId, domain } = validation.data;

    // Validate session
    await getValidSession(sessionId);

    // Get inputs for this domain
    const allInputs = await getSessionInputs(sessionId);
    const domainInputs = allInputs.filter((i) => i.domain === domain);

    // Calculate confidence breakdown
    const confidenceBreakdown = {
      high: domainInputs.filter((i) => i.confidence_level === 'high').length,
      medium: domainInputs.filter((i) => i.confidence_level === 'medium').length,
      low: domainInputs.filter((i) => i.confidence_level === 'low').length,
    };

    // Extract key themes from inputs
    const keyThemes = extractKeyThemes(domainInputs);

    // Generate suggested focus
    const suggestedFocus = generateSuggestedFocus(domainInputs, domain);

    // Generate overall assessment
    const overallAssessment = generateOverallAssessment(
      domainInputs,
      confidenceBreakdown,
      domain
    );

    const summary: DomainSummary = {
      domain,
      topicsCovered: domainInputs.length,
      totalTopics: DOMAIN_TOPIC_COUNTS[domain],
      confidenceBreakdown,
      keyThemes,
      suggestedFocus,
      overallAssessment,
    };

    return NextResponse.json({ summary });
  } catch (error) {
    return handleApiError(error);
  }
}

function extractKeyThemes(inputs: Input[]): string[] {
  const themes: string[] = [];

  // Extract themes from extracted_data
  for (const input of inputs) {
    const extracted = input.extracted_data as {
      keyInsight?: string;
      summary?: string;
    };

    if (extracted?.keyInsight) {
      themes.push(extracted.keyInsight);
    } else if (extracted?.summary) {
      themes.push(extracted.summary);
    }
  }

  // Return top 3 themes
  return themes.slice(0, 3);
}

function generateSuggestedFocus(inputs: Input[], domain: DomainType): string | null {
  // Find low confidence inputs that need attention
  const lowConfidenceInputs = inputs.filter((i) => i.confidence_level === 'low');

  if (lowConfidenceInputs.length > 0) {
    const firstLow = lowConfidenceInputs[0];
    return `Consider strengthening your response on "${formatQuestionId(firstLow.question_id)}"`;
  }

  // If all covered are high/medium, suggest exploring uncovered topics
  if (inputs.length < DOMAIN_TOPIC_COUNTS[domain]) {
    return 'Continue exploring remaining topics in this domain';
  }

  return null;
}

function generateOverallAssessment(
  inputs: Input[],
  confidence: { high: number; medium: number; low: number },
  domain: DomainType
): string {
  const total = inputs.length;
  const maxTopics = DOMAIN_TOPIC_COUNTS[domain];
  const coverage = total / maxTopics;

  if (total === 0) {
    return 'No inputs captured yet. Start by discussing key topics in this domain.';
  }

  if (coverage < 0.4) {
    return `Early stage exploration with ${total} of ${maxTopics} topics covered. Keep going!`;
  }

  if (coverage < 0.8) {
    const highPercent = Math.round((confidence.high / total) * 100);
    if (highPercent >= 50) {
      return `Good progress with strong confidence in ${confidence.high} areas. ${maxTopics - total} topics remaining.`;
    }
    return `Solid foundation with ${total} topics covered. Consider adding more detail to strengthen your assessment.`;
  }

  // Full or near-full coverage
  if (confidence.low > 0) {
    return `Comprehensive coverage achieved. Review ${confidence.low} lower-confidence areas for a stronger assessment.`;
  }

  return 'Excellent coverage with strong confidence across this domain.';
}

function formatQuestionId(questionId: string): string {
  return questionId
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
