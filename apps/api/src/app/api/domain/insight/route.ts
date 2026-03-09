import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { anthropic, models } from '@/lib/ai/client';
import { getValidSession } from '@/lib/db/session';
import { getSessionInputs } from '@/lib/db/inputs';
import { handleApiError, ValidationError } from '@/lib/errors';
import type { DomainType, ConfidenceLevel } from '@atlas/types';

export const maxDuration = 30;

const requestSchema = z.object({
  sessionId: z.string().uuid(),
  domain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
});

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
  insufficient: 'LOW',
};

const insightSchema = z.object({
  readinessLevel: z.enum(['strong', 'developing', 'early']),
  headline: z.string(),
  narrative: z.string(),
  strengths: z.array(z.string()).min(1).max(3),
  gaps: z.array(z.string()).min(1).max(3),
  nextStep: z.string(),
});

function buildInsightPrompt(domain: DomainType, inputs: ReturnType<typeof Array.prototype.filter>): string {
  const label = DOMAIN_LABELS[domain];
  const lines = inputs.map((inp: { question_id: string; confidence_level: ConfidenceLevel; extracted_data: unknown; response_text?: string }) => {
    const extracted = inp.extracted_data as { keyInsight?: string; summary?: string } | null;
    const answer = extracted?.keyInsight || extracted?.summary || inp.response_text || '(no detail captured)';
    const conf = CONFIDENCE_LABELS[inp.confidence_level] || 'LOW';
    const topic = inp.question_id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    return `- ${topic} [${conf}]: ${answer.slice(0, 200)}`;
  });

  return `Domain: ${label}\n\nTopics assessed:\n${lines.join('\n')}`;
}

const SYSTEM_PROMPT = `You are an expert analyst assessing a startup's readiness to expand into the U.S. market.

A founder has just completed a chapter of their readiness assessment. Based on their answers to 5 key topics in a specific domain, generate a brief, direct insight card.

Readiness level criteria:
- "strong": Clear evidence, high confidence, specific facts — the founder knows this area well
- "developing": Some evidence but gaps remain; assumptions present; mixed confidence
- "early": Vague answers, low confidence, significant unknowns, or mostly assumptions

Rules:
- Be specific to their ACTUAL answers; never give generic startup advice
- headline: one punchy, specific sentence (max 12 words) that captures the standout finding
- narrative: 2–3 sentences in second person ("you", "your") synthesising what their answers reveal about this dimension of readiness
- strengths: exactly 2 specific strengths in second person, drawn directly from their answers (not generic)
- gaps: 1–2 specific gaps in second person, unknowns or assumptions that need addressing (not generic)
- nextStep: one concrete, actionable recommendation in second person given what they've shared
- Write all output text in the second person: address the founder as "you" and "your". Never use "the founder", "the company", "they", or "their"
- Never use em dashes (—) in any output; use commas, colons, or rewrite the sentence instead

Return valid JSON only. No markdown, no code blocks, no explanation.`;

// POST /api/domain/insight
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { sessionId, domain } = validation.data;

    await getValidSession(sessionId);

    const allInputs = await getSessionInputs(sessionId);
    const domainInputs = allInputs.filter((i) => i.domain === domain);

    if (domainInputs.length === 0) {
      return NextResponse.json({ insight: null });
    }

    const userPrompt = buildInsightPrompt(domain, domainInputs);

    const { object } = await generateObject({
      model: anthropic(models.classification), // Haiku — fast, sufficient
      schema: insightSchema,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
    });

    return NextResponse.json({
      insight: {
        domain,
        ...object,
      },
    });
  } catch (error) {
    // Non-fatal: return null insight so the frontend suppresses the modal gracefully
    console.error('[Atlas] domain/insight error (non-fatal):', error);
    return NextResponse.json({ insight: null });
  }
}
