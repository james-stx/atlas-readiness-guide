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
import type { DomainType, ConfidenceLevel, ExpansionPositioning } from '@atlas/types';

// Increase timeout for this route (Vercel Pro: up to 300s, Hobby: 10s max)
export const maxDuration = 120;

// V3 Snapshot schema for structured generation
const snapshotV3Schema = z.object({
  // Overall readiness (only if assessable)
  readinessLevel: z.enum(['ready', 'ready_with_caveats', 'not_ready']).optional(),
  verdictSummary: z.string().optional(),

  // Topic-level results (for covered topics only - simpler for Haiku)
  topicResults: z.array(
    z.object({
      topicId: z.string(),
      topicLabel: z.string(),
      domain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      status: z.enum(['covered', 'not_covered']),
      confidence: z.enum(['high', 'medium', 'low']).optional(),
      keyInsight: z.string().optional(),
    })
  ).default([]),

  // V4: Cross-domain signals for incomplete assessments
  earlySignals: z.array(
    z.object({
      type: z.enum(['strength', 'pattern', 'risk', 'unknown']),
      title: z.string(),
      description: z.string(),
      derivedFrom: z.array(z.string()),
      blockedBy: z.array(z.enum(['market', 'product', 'gtm', 'operations', 'financials'])).optional(),
      implication: z.string(),
    })
  ).default([]),

  // V4: Recommended next topics for incomplete assessments
  recommendedTopics: z.array(
    z.object({
      domain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      topicId: z.string(),
      topicLabel: z.string(),
      impact: z.enum(['high', 'medium']),
      why: z.string(),
      unlocks: z.array(z.string()),
    })
  ).default([]),

  // V5: Executive summary narrative
  executiveSummary: z.string().optional(),

  // V5: Strengths (high-confidence advantages)
  strengths: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      sourceDomain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      sourceTopic: z.string(),
      confidence: z.enum(['high', 'medium', 'low']).default('high'),
    })
  ).default([]),

  // V5: Risks (medium-confidence concerns)
  risks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      sourceDomain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      sourceTopic: z.string(),
    })
  ).default([]),

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

  // V5: Needs validation (renamed from assumptions, with validation step)
  needsValidation: z.array(
    z.object({
      title: z.string(),
      sourceDomain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      sourceTopic: z.string(),
      description: z.string(),
      validationStep: z.string(),
    })
  ).default([]),

  // Legacy assumptions (kept for backwards compatibility)
  assumptions: z.array(
    z.object({
      title: z.string(),
      sourceDomain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      sourceTopic: z.string(),
      description: z.string(),
      validation: z.string(),
    })
  ).default([]),

  // V5: 90-day roadmap phases
  roadmapPhase1: z.array(
    z.object({
      action: z.string(),
      rationale: z.string(),
      sourceDomain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      sourceTopic: z.string(),
    })
  ).default([]),

  roadmapPhase2: z.array(
    z.object({
      action: z.string(),
      rationale: z.string(),
      sourceDomain: z.enum(['market', 'product', 'gtm', 'operations', 'financials']),
      sourceTopic: z.string(),
    })
  ).default([]),

  // Legacy 30-day action plan
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
    const criticalGapsCount = (generatedV3Snapshot.criticalActions || []).length;

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
    const topicResults = generatedV3Snapshot.topicResults || [];
    const criticalActions = generatedV3Snapshot.criticalActions || [];
    const assumptions = generatedV3Snapshot.assumptions || [];
    const actionPlan = generatedV3Snapshot.actionPlan || [];

    // Key findings: derive from V3 topic results that have key insights
    const dbKeyFindings = topicResults
      .filter((t: { keyInsight?: string }) => t.keyInsight)
      .slice(0, 5)
      .map((t: { domain: DomainType; keyInsight?: string; confidence?: ConfidenceLevel }) => ({
        domain: t.domain,
        finding: t.keyInsight || '',
        confidence: t.confidence || 'medium',
      }));

    // Strengths: derive from high-confidence covered topics
    const dbStrengths = topicResults
      .filter((t: { status: string; confidence?: ConfidenceLevel }) => t.status === 'covered' && t.confidence === 'high')
      .slice(0, 5)
      .map((t: { domain: DomainType; topicLabel: string; keyInsight?: string }) => ({
        domain: t.domain,
        item: t.topicLabel,
        evidence: t.keyInsight || '',
        user_quote: null,
      }));

    // Assumptions: derive from V3 assumptions
    const dbAssumptions = assumptions.map((a: { sourceDomain: DomainType; title: string; description: string; validation: string }) => ({
      domain: a.sourceDomain,
      item: a.title,
      risk: a.description,
      validation_suggestion: a.validation,
    }));

    // Gaps: derive from V3 critical actions
    const dbGaps = criticalActions.map((ca: { sourceDomain: DomainType; title: string; description: string; action: string }) => ({
      domain: ca.sourceDomain,
      item: ca.title,
      importance: 'critical' as const,
      recommendation: ca.description,
      research_action: null,
      execution_action: ca.action,
    }));

    // Next steps: derive from V3 action plan
    const dbNextSteps = actionPlan.map((ap: { week: number; action: string; sourceDomain: DomainType; unblocks: string }, index: number) => ({
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

    // Calculate expansion positioning (5-tier scale)
    const calculateExpansionPositioning = (): ExpansionPositioning => {
      const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];
      let highDomains = 0;
      let lowDomains = 0;
      for (const domain of domains) {
        const dr = domainResults[domain];
        if (dr.confidence_level === 'high') highDomains++;
        if (dr.confidence_level === 'low') lowDomains++;
      }
      const criticalCount = (generatedV3Snapshot.criticalActions || []).length;
      const validationCount = (generatedV3Snapshot.needsValidation || []).length;

      if (highDomains >= 4 && criticalCount === 0 && validationCount <= 1) return 'expansion_ready';
      if (highDomains >= 3 && criticalCount <= 1 && validationCount <= 3) return 'well_positioned';
      if (highDomains >= 2 && criticalCount <= 2) return 'conditionally_positioned';
      if (lowDomains >= 2 || criticalCount >= 3) return 'foundation_building';
      return 'early_exploration';
    };

    // Calculate readiness level based on actual data (override AI if needed)
    const calculateReadinessLevel = (): 'ready' | 'ready_with_caveats' | 'not_ready' => {
      const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

      // Count domains by confidence level
      let highConfidenceDomains = 0;
      let lowConfidenceDomains = 0;
      let domainsWithNoHighTopics = 0;

      for (const domain of domains) {
        const dr = domainResults[domain];
        if (dr.confidence_level === 'high') highConfidenceDomains++;
        if (dr.confidence_level === 'low') lowConfidenceDomains++;
        if (dr.confidence_breakdown.high === 0 && dr.topics_covered > 0) domainsWithNoHighTopics++;
      }

      const assumptionsCount = (generatedV3Snapshot.assumptions || []).length;

      console.log('[Snapshot] Readiness calc:', {
        highConfidenceDomains,
        lowConfidenceDomains,
        domainsWithNoHighTopics,
        criticalGapsCount,
        assumptionsCount,
        aiReadinessLevel: generatedV3Snapshot.readinessLevel,
      });

      // Apply rules:
      // not_ready: >= 2 domains LOW, OR >= 3 critical gaps, OR any domain with 0 HIGH topics
      if (lowConfidenceDomains >= 2 || criticalGapsCount >= 3 || domainsWithNoHighTopics > 0) {
        return 'not_ready';
      }

      // ready: >= 4 domains HIGH, 0 critical gaps, <= 2 assumptions
      if (highConfidenceDomains >= 4 && criticalGapsCount === 0 && assumptionsCount <= 2) {
        return 'ready';
      }

      // ready_with_caveats: everything else that's assessable
      return 'ready_with_caveats';
    };

    const calculatedReadinessLevel = assessmentStatus.status === 'assessable'
      ? calculateReadinessLevel()
      : undefined;

    const calculatedPositioning = assessmentStatus.status === 'assessable'
      ? calculateExpansionPositioning()
      : undefined;

    console.log('[Snapshot] Final readiness level:', calculatedReadinessLevel);

    // Build V3 data structure
    const v3Data = {
      assessment_status: assessmentStatus.status,
      coverage_percentage: assessmentStatus.coverage_percentage,
      topics_covered: assessmentStatus.topics_covered,
      topics_total: assessmentStatus.topics_total,
      readiness_level: calculatedReadinessLevel,
      verdict_summary: assessmentStatus.status === 'assessable' ? generatedV3Snapshot.verdictSummary : undefined,
      expansion_positioning: calculatedPositioning,
      executive_summary: assessmentStatus.status === 'assessable' ? generatedV3Snapshot.executiveSummary : undefined,
      domains: Object.fromEntries(
        (['market', 'product', 'gtm', 'operations', 'financials'] as DomainType[]).map((domain) => {
          const dr = domainResults[domain];
          const topicDefs = TOPIC_DEFINITIONS[domain];
          const domainInputs = inputs.filter(i => i.domain === domain);

          const topics = topicDefs.map((td) => {
            // Check AI response first
            const topicResult = (generatedV3Snapshot.topicResults || []).find(
              (tr: { topicId: string }) => tr.topicId === td.id
            );
            // Fallback: check if we have an actual input for this topic
            const hasInput = domainInputs.some(i => i.question_id === td.id);
            const matchingInput = domainInputs.find(i => i.question_id === td.id);

            // Determine status: use AI result, or fallback to input presence
            const isCovered = topicResult?.status === 'covered' || hasInput;

            return {
              topic_id: td.id,
              topic_label: td.label,
              status: isCovered ? 'covered' : 'not_covered',
              confidence: topicResult?.confidence || (matchingInput?.confidence_level as ConfidenceLevel | undefined),
              key_insight: topicResult?.keyInsight || (matchingInput ? `User provided input on this topic.` : undefined),
              // Requirements derived from topic definitions
              requirements: td.requirements.map((req, idx) => ({
                requirement_id: `${td.id}_req_${idx}`,
                label: req,
                status: isCovered ? 'addressed' : 'not_addressed',
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
      strengths: (generatedV3Snapshot.strengths || []).map((s: { title: string; description: string; sourceDomain: DomainType; sourceTopic: string; confidence: ConfidenceLevel }) => ({
        title: s.title,
        description: s.description,
        source_domain: s.sourceDomain,
        source_topic: s.sourceTopic,
        confidence: s.confidence,
      })),
      risks: (generatedV3Snapshot.risks || []).map((r: { title: string; description: string; sourceDomain: DomainType; sourceTopic: string }) => ({
        title: r.title,
        description: r.description,
        source_domain: r.sourceDomain,
        source_topic: r.sourceTopic,
      })),
      critical_actions: (generatedV3Snapshot.criticalActions || []).map((ca: { priority: number; title: string; sourceDomain: DomainType; sourceTopic: string; sourceStatus: string; description: string; action: string }) => ({
        priority: ca.priority,
        title: ca.title,
        source_domain: ca.sourceDomain,
        source_topic: ca.sourceTopic,
        source_status: ca.sourceStatus,
        description: ca.description,
        action: ca.action,
      })),
      needs_validation: (generatedV3Snapshot.needsValidation || []).map((nv: { title: string; sourceDomain: DomainType; sourceTopic: string; description: string; validationStep: string }) => ({
        title: nv.title,
        source_domain: nv.sourceDomain,
        source_topic: nv.sourceTopic,
        description: nv.description,
        validation_step: nv.validationStep,
      })),
      assumptions: (generatedV3Snapshot.assumptions || []).map((a: { title: string; sourceDomain: DomainType; sourceTopic: string; description: string; validation: string }) => ({
        title: a.title,
        source_domain: a.sourceDomain,
        source_topic: a.sourceTopic,
        description: a.description,
        validation: a.validation,
      })),
      roadmap_phase1: (generatedV3Snapshot.roadmapPhase1 || []).map((r: { action: string; rationale: string; sourceDomain: DomainType; sourceTopic: string }) => ({
        action: r.action,
        rationale: r.rationale,
        source_domain: r.sourceDomain,
        source_topic: r.sourceTopic,
      })),
      roadmap_phase2: (generatedV3Snapshot.roadmapPhase2 || []).map((r: { action: string; rationale: string; sourceDomain: DomainType; sourceTopic: string }) => ({
        action: r.action,
        rationale: r.rationale,
        source_domain: r.sourceDomain,
        source_topic: r.sourceTopic,
      })),
      action_plan: (generatedV3Snapshot.actionPlan || []).map((ap: { week: number; action: string; sourceDomain: DomainType; sourceTopic: string; unblocks: string }) => ({
        week: ap.week,
        action: ap.action,
        source_domain: ap.sourceDomain,
        source_topic: ap.sourceTopic,
        unblocks: ap.unblocks,
      })),
      // V4 fields for incomplete assessments
      early_signals: (generatedV3Snapshot.earlySignals || []).map((es: { type: string; title: string; description: string; derivedFrom: string[]; blockedBy?: DomainType[]; implication: string }) => ({
        type: es.type,
        title: es.title,
        description: es.description,
        derived_from: es.derivedFrom,
        blocked_by: es.blockedBy,
        implication: es.implication,
      })),
      recommended_topics: (generatedV3Snapshot.recommendedTopics || []).map((rt: { domain: DomainType; topicId: string; topicLabel: string; impact: string; why: string; unlocks: string[] }) => ({
        domain: rt.domain,
        topic_id: rt.topicId,
        topic_label: rt.topicLabel,
        impact: rt.impact,
        why: rt.why,
        unlocks: rt.unlocks,
      })),
    };

    // Save snapshot to database
    // Note: V2 fields (readiness_level, verdict_summary, key_stats) are stored in raw_output
    // because the DB schema only has the original columns
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
        raw_output: JSON.stringify({
          v3: v3Data,  // Store the transformed v3Data with domains, not raw AI output
          key_stats: dbKeyStats,
          readiness_level: calculatedReadinessLevel || 'not_ready',
          verdict_summary: generatedV3Snapshot.verdictSummary || 'Assessment incomplete',
        }),
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

    // Add V3 data and extracted fields to response
    const responseSnapshot = {
      ...savedSnapshot,
      key_stats: dbKeyStats,
      readiness_level: calculatedReadinessLevel || 'not_ready',
      verdict_summary: generatedV3Snapshot.verdictSummary || 'Assessment incomplete',
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
