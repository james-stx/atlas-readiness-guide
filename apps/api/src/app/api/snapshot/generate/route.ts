import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { anthropic, models, modelConfig } from '@/lib/ai/client';
import {
  SYNTHESIS_SYSTEM_PROMPT,
  buildSynthesisUserPrompt,
  calculateCoverageSummary,
} from '@/lib/ai/prompts/synthesis';
import { getValidSession, updateSessionStatus } from '@/lib/db/session';
import { getSessionInputs } from '@/lib/db/inputs';
import { supabase } from '@/lib/db/supabase';
import { handleApiError, ValidationError } from '@/lib/errors';

// Snapshot schema for structured generation
const snapshotSchema = z.object({
  keyFindings: z.array(
    z.object({
      domain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      finding: z.string(),
      confidence: z.enum(['high', 'medium', 'low']),
    })
  ).min(3).max(5),

  strengths: z.array(
    z.object({
      domain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      item: z.string(),
      evidence: z.string(),
    })
  ),

  assumptions: z.array(
    z.object({
      domain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      item: z.string(),
      risk: z.string(),
      validationSuggestion: z.string(),
    })
  ),

  gaps: z.array(
    z.object({
      domain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      item: z.string(),
      importance: z.enum(['critical', 'important', 'nice-to-have']),
      recommendation: z.string(),
    })
  ),

  nextSteps: z.array(
    z.object({
      priority: z.number().min(1).max(5),
      action: z.string(),
      domain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      rationale: z.string(),
    })
  ).length(5),
});

const requestSchema = z.object({
  sessionId: z.string().uuid(),
});

// POST /api/snapshot/generate - Generate readiness snapshot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { sessionId } = validation.data;

    // Validate session
    const session = await getValidSession(sessionId);

    // Get all inputs for the session
    const inputs = await getSessionInputs(sessionId);

    if (inputs.length === 0) {
      throw new ValidationError('No inputs captured for this session');
    }

    // Update session status to synthesizing
    await updateSessionStatus(sessionId, 'synthesizing');

    // Calculate coverage summary
    const coverageSummary = calculateCoverageSummary(inputs);

    // Build the prompt
    const userPrompt = buildSynthesisUserPrompt(inputs);

    // Generate structured snapshot using Claude
    const { object: generatedSnapshot } = await generateObject({
      model: anthropic(models.synthesis),
      schema: snapshotSchema,
      system: SYNTHESIS_SYSTEM_PROMPT,
      prompt: userPrompt,
      maxTokens: modelConfig.synthesis.maxTokens,
      temperature: modelConfig.synthesis.temperature,
    });

    // Transform coverage summary to match DB schema
    const dbCoverageSummary = {
      market: {
        questions_answered: coverageSummary.market.questionsAnswered,
        high_confidence: coverageSummary.market.highConfidence,
        medium_confidence: coverageSummary.market.mediumConfidence,
        low_confidence: coverageSummary.market.lowConfidence,
      },
      product: {
        questions_answered: coverageSummary.product.questionsAnswered,
        high_confidence: coverageSummary.product.highConfidence,
        medium_confidence: coverageSummary.product.mediumConfidence,
        low_confidence: coverageSummary.product.lowConfidence,
      },
      gtm: {
        questions_answered: coverageSummary.gtm.questionsAnswered,
        high_confidence: coverageSummary.gtm.highConfidence,
        medium_confidence: coverageSummary.gtm.mediumConfidence,
        low_confidence: coverageSummary.gtm.lowConfidence,
      },
      operations: {
        questions_answered: coverageSummary.operations.questionsAnswered,
        high_confidence: coverageSummary.operations.highConfidence,
        medium_confidence: coverageSummary.operations.mediumConfidence,
        low_confidence: coverageSummary.operations.lowConfidence,
      },
      financials: {
        questions_answered: coverageSummary.financials.questionsAnswered,
        high_confidence: coverageSummary.financials.highConfidence,
        medium_confidence: coverageSummary.financials.mediumConfidence,
        low_confidence: coverageSummary.financials.lowConfidence,
      },
    };

    // Transform generated data to match DB schema
    const dbKeyFindings = generatedSnapshot.keyFindings.map((f) => ({
      domain: f.domain,
      finding: f.finding,
      confidence: f.confidence,
    }));

    const dbStrengths = generatedSnapshot.strengths.map((s) => ({
      domain: s.domain,
      item: s.item,
      evidence: s.evidence,
    }));

    const dbAssumptions = generatedSnapshot.assumptions.map((a) => ({
      domain: a.domain,
      item: a.item,
      risk: a.risk,
      validation_suggestion: a.validationSuggestion,
    }));

    const dbGaps = generatedSnapshot.gaps.map((g) => ({
      domain: g.domain,
      item: g.item,
      importance: g.importance,
      recommendation: g.recommendation,
    }));

    const dbNextSteps = generatedSnapshot.nextSteps.map((n) => ({
      priority: n.priority,
      action: n.action,
      domain: n.domain,
      rationale: n.rationale,
    }));

    // Save snapshot to database
    const { data: savedSnapshot, error: saveError } = await supabase
      .from('snapshots')
      .insert({
        session_id: sessionId,
        coverage_summary: dbCoverageSummary,
        key_findings: dbKeyFindings,
        strengths: dbStrengths,
        assumptions: dbAssumptions,
        gaps: dbGaps,
        next_steps: dbNextSteps,
        raw_output: JSON.stringify(generatedSnapshot),
      })
      .select()
      .single();

    if (saveError) {
      throw new Error(`Failed to save snapshot: ${saveError.message}`);
    }

    // Update session status to completed
    await updateSessionStatus(sessionId, 'completed');

    return NextResponse.json({ snapshot: savedSnapshot });
  } catch (error) {
    return handleApiError(error);
  }
}
