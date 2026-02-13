import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { anthropic, models, modelConfig } from '@/lib/ai/client';
import {
  calculateCoverageSummary,
  calculateKeyStats,
} from '@/lib/ai/prompts/synthesis';
import {
  SYNTHESIS_V3_SYSTEM_PROMPT,
  buildSynthesisV3UserPrompt,
  calculateDomainResults,
  calculateAssessmentStatus,
  TOPIC_DEFINITIONS,
} from '@/lib/ai/prompts/synthesis-v3';
import { getValidSession, updateSessionStatus } from '@/lib/db/session';
import { getSessionInputs } from '@/lib/db/inputs';
import { supabase } from '@/lib/db/supabase';
import { handleApiError, ValidationError } from '@/lib/errors';
import type { DomainType, ConfidenceLevel } from '@atlas/types';

// Increase timeout for this route (Vercel Pro: up to 300s, Hobby: 10s max)
export const maxDuration = 60;

// V3 Snapshot schema for structured generation
const snapshotV3Schema = z.object({
  // Overall readiness (only if assessable)
  readinessLevel: z.enum(['ready', 'ready_with_caveats', 'not_ready']).optional(),
  verdictSummary: z.string().optional(),

  // Topic-level results (for all 25 topics)
  topicResults: z.array(
    z.object({
      topicId: z.string(),
      topicLabel: z.string(),
      domain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      status: z.enum(['covered', 'not_covered']),
      confidence: z.enum(['high', 'medium', 'low']).optional(),
      keyInsight: z.string().optional(),
      requirements: z.array(
        z.object({
          requirementId: z.string(),
          label: z.string(),
          status: z.enum(['addressed', 'partial', 'not_addressed']),
        })
      ),
    })
  ),

  // Critical actions with source traceability
  criticalActions: z.array(
    z.object({
      priority: z.number().min(1).max(5),
      title: z.string(),
      sourceDomain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      sourceTopic: z.string(),
      sourceStatus: z.string(),
      description: z.string(),
      action: z.string(),
    })
  ).default([]),

  // Assumptions with source traceability
  assumptions: z.array(
    z.object({
      title: z.string(),
      sourceDomain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      sourceTopic: z.string(),
      description: z.string(),
      validation: z.string(),
    })
  ).default([]),

  // 30-day action plan
  actionPlan: z.array(
    z.object({
      week: z.number().min(1).max(4),
      action: z.string(),
      sourceDomain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      sourceTopic: z.string(),
      unblocks: z.string(),
    })
  ).default([]),
});

const requestSchema = z.object({
  sessionId: z.string().uuid(),
});

// POST /api/snapshot/generate - Generate readiness snapshot
export async function POST(request: NextRequest) {
  try {
    console.log('[Snapshot] Starting generation...');

    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { sessionId } = validation.data;
    console.log('[Snapshot] Session ID:', sessionId);

    // Validate session
    const session = await getValidSession(sessionId);
    console.log('[Snapshot] Session validated');

    // Get all inputs for the session
    const inputs = await getSessionInputs(sessionId);
    console.log('[Snapshot] Inputs fetched:', inputs.length);

    if (inputs.length === 0) {
      throw new ValidationError('No inputs captured for this session');
    }

    // Update session status to synthesizing
    await updateSessionStatus(sessionId, 'synthesizing');
    console.log('[Snapshot] Status updated to synthesizing');

    // Calculate coverage summary
    const coverageSummary = calculateCoverageSummary(inputs);
    console.log('[Snapshot] Coverage calculated');

    // Calculate key stats
    const keyStats = calculateKeyStats(inputs);
    console.log('[Snapshot] Key stats calculated');

    // Calculate V3 assessment status
    const assessmentStatus = calculateAssessmentStatus(inputs);
    const domainResults = calculateDomainResults(inputs);
    console.log('[Snapshot] V3 Assessment status:', assessmentStatus.status);

    // Generate V3 structured snapshot (single API call to avoid timeout)
    const v3UserPrompt = buildSynthesisV3UserPrompt(inputs);
    console.log('[Snapshot] Calling Claude API with model:', models.synthesis);
    let generatedV3Snapshot;
    try {
      const v3Result = await generateObject({
        model: anthropic(models.synthesis),
        schema: snapshotV3Schema,
        system: SYNTHESIS_V3_SYSTEM_PROMPT,
        prompt: v3UserPrompt,
        maxTokens: modelConfig.synthesis.maxTokens,
        temperature: modelConfig.synthesis.temperature,
      });
      generatedV3Snapshot = v3Result.object;
      console.log('[Snapshot] V3 snapshot generated');
    } catch (aiError) {
      const msg = aiError instanceof Error ? aiError.message : String(aiError);
      console.error('[Snapshot] Claude API error:', msg);
      throw new Error(`AI generation failed: ${msg}`);
    }

    // Count critical actions for key stats (derived from V3)
    const criticalGapsCount = generatedV3Snapshot.criticalActions.length;

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

    // Transform V3 data to V2-compatible DB schema for backwards compatibility
    // Key findings: derive from V3 topic results that have key insights
    const dbKeyFindings = generatedV3Snapshot.topicResults
      .filter((t: { keyInsight?: string }) => t.keyInsight)
      .slice(0, 5)
      .map((t: { domain: DomainType; keyInsight?: string; confidence?: ConfidenceLevel }) => ({
        domain: t.domain,
        finding: t.keyInsight || '',
        confidence: t.confidence || 'medium',
      }));

    // Strengths: derive from high-confidence covered topics
    const dbStrengths = generatedV3Snapshot.topicResults
      .filter((t: { status: string; confidence?: ConfidenceLevel }) => t.status === 'covered' && t.confidence === 'high')
      .slice(0, 5)
      .map((t: { domain: DomainType; topicLabel: string; keyInsight?: string }) => ({
        domain: t.domain,
        item: t.topicLabel,
        evidence: t.keyInsight || '',
        user_quote: null,
      }));

    // Assumptions: derive from V3 assumptions
    const dbAssumptions = generatedV3Snapshot.assumptions.map((a: { sourceDomain: DomainType; title: string; description: string; validation: string }) => ({
      domain: a.sourceDomain,
      item: a.title,
      risk: a.description,
      validation_suggestion: a.validation,
    }));

    // Gaps: derive from V3 critical actions
    const dbGaps = generatedV3Snapshot.criticalActions.map((ca: { sourceDomain: DomainType; title: string; description: string; action: string }) => ({
      domain: ca.sourceDomain,
      item: ca.title,
      importance: 'critical' as const,
      recommendation: ca.description,
      research_action: null,
      execution_action: ca.action,
    }));

    // Next steps: derive from V3 action plan
    const dbNextSteps = generatedV3Snapshot.actionPlan.map((ap: { week: number; action: string; sourceDomain: DomainType; unblocks: string }, index: number) => ({
      priority: index + 1,
      action: ap.action,
      domain: ap.sourceDomain,
      rationale: ap.unblocks,
      week: ap.week,
    }));

    // Key stats with actual critical gaps count
    const dbKeyStats = {
      topics_covered: keyStats.topicsCovered,
      total_topics: keyStats.totalTopics,
      high_confidence_inputs: keyStats.highConfidenceInputs,
      critical_gaps_count: criticalGapsCount,
    };

    // Build V3 data structure
    const v3Data = {
      assessment_status: assessmentStatus.status,
      coverage_percentage: assessmentStatus.coverage_percentage,
      topics_covered: assessmentStatus.topics_covered,
      topics_total: assessmentStatus.topics_total,
      readiness_level: assessmentStatus.status === 'assessable' ? generatedV3Snapshot.readinessLevel : undefined,
      verdict_summary: assessmentStatus.status === 'assessable' ? generatedV3Snapshot.verdictSummary : undefined,
      domains: Object.fromEntries(
        (['market', 'product', 'gtm', 'operations', 'financials'] as DomainType[]).map((domain) => {
          const dr = domainResults[domain];
          const topicDefs = TOPIC_DEFINITIONS[domain];
          const topics = topicDefs.map((td) => {
            const topicResult = generatedV3Snapshot.topicResults.find(
              (tr: { topicId: string }) => tr.topicId === td.id
            );
            return {
              topic_id: td.id,
              topic_label: td.label,
              status: topicResult?.status || 'not_covered',
              confidence: topicResult?.confidence,
              key_insight: topicResult?.keyInsight,
              requirements: topicResult?.requirements.map((r: { requirementId: string; label: string; status: string }) => ({
                requirement_id: r.requirementId,
                label: r.label,
                status: r.status,
              })) || td.requirements.map((req, idx) => ({
                requirement_id: `${td.id}_req_${idx}`,
                label: req,
                status: 'not_addressed',
              })),
            };
          });

          return [domain, {
            topics_covered: dr.topics_covered,
            topics_total: dr.topics_total,
            confidence_level: dr.confidence_level,
            confidence_breakdown: dr.confidence_breakdown,
            topics,
          }];
        })
      ),
      critical_actions: generatedV3Snapshot.criticalActions.map((ca: { priority: number; title: string; sourceDomain: DomainType; sourceTopic: string; sourceStatus: string; description: string; action: string }) => ({
        priority: ca.priority,
        title: ca.title,
        source_domain: ca.sourceDomain,
        source_topic: ca.sourceTopic,
        source_status: ca.sourceStatus,
        description: ca.description,
        action: ca.action,
      })),
      assumptions: generatedV3Snapshot.assumptions.map((a: { title: string; sourceDomain: DomainType; sourceTopic: string; description: string; validation: string }) => ({
        title: a.title,
        source_domain: a.sourceDomain,
        source_topic: a.sourceTopic,
        description: a.description,
        validation: a.validation,
      })),
      action_plan: generatedV3Snapshot.actionPlan.map((ap: { week: number; action: string; sourceDomain: DomainType; sourceTopic: string; unblocks: string }) => ({
        week: ap.week,
        action: ap.action,
        source_domain: ap.sourceDomain,
        source_topic: ap.sourceTopic,
        unblocks: ap.unblocks,
      })),
    };

    // Save snapshot to database
    console.log('[Snapshot] Saving to database...');
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
        raw_output: JSON.stringify({ v3: generatedV3Snapshot }),
        // V2 fields (derived from V3)
        readiness_level: generatedV3Snapshot.readinessLevel || 'not_ready',
        verdict_summary: generatedV3Snapshot.verdictSummary || 'Assessment incomplete',
        key_stats: dbKeyStats,
      })
      .select()
      .single();

    if (saveError) {
      console.error('[Snapshot] Database save error:', saveError);
      throw new Error(`Failed to save snapshot: ${saveError.message}`);
    }

    // Update session status to completed
    await updateSessionStatus(sessionId, 'completed');
    console.log('[Snapshot] Complete! Snapshot ID:', savedSnapshot?.id);

    // Add V3 data to response
    const responseSnapshot = {
      ...savedSnapshot,
      v3: v3Data,
    };

    return NextResponse.json({ snapshot: responseSnapshot });
  } catch (error) {
    // Safely log error details (AI SDK errors can have non-serializable properties)
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'Unknown';
    console.error('[Snapshot] Error:', errorName, '-', errorMessage);

    // Check for common AI SDK errors
    if (errorMessage.includes('rate') || errorMessage.includes('limit')) {
      console.error('[Snapshot] Rate limit hit');
    }
    if (errorMessage.includes('invalid') || errorMessage.includes('api_key')) {
      console.error('[Snapshot] API key issue');
    }

    return handleApiError(error);
  }
}
