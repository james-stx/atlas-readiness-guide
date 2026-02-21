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

const domainEnum = z.enum(['market', 'product', 'gtm', 'operations', 'financials']);

// Schema for INCOMPLETE assessments (< 60% coverage)
const incompleteSnapshotSchema = z.object({
  topicResults: z.array(
    z.object({
      topicId: z.string(),
      topicLabel: z.string(),
      domain: domainEnum,
      status: z.enum(['covered', 'not_covered']),
      confidence: z.enum(['high', 'medium', 'low']).optional(),
      keyInsight: z.string().optional(),
    })
  ).default([]),
  earlySignals: z.array(
    z.object({
      type: z.enum(['strength', 'pattern', 'risk', 'unknown']),
      title: z.string(),
      description: z.string(),
      derivedFrom: z.array(z.string()),
      blockedBy: z.array(domainEnum).optional(),
      implication: z.string(),
    })
  ).default([]),
  recommendedTopics: z.array(
    z.object({
      domain: domainEnum,
      topicId: z.string(),
      topicLabel: z.string(),
      impact: z.enum(['high', 'medium']),
      why: z.string(),
      unlocks: z.array(z.string()),
    })
  ).default([]),
});

// Schema for ASSESSABLE reports (>= 60% coverage, full V5 report)
const assessableSnapshotSchema = z.object({
  readinessLevel: z.enum(['ready', 'ready_with_caveats', 'not_ready']).optional(),
  verdictSummary: z.string().optional(),
  executiveSummary: z.string().optional(),
  strengths: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      sourceDomain: domainEnum,
      sourceTopic: z.string(),
      confidence: z.enum(['high', 'medium', 'low']).default('high'),
    })
  ).default([]),
  risks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      sourceDomain: domainEnum,
      sourceTopic: z.string(),
    })
  ).default([]),
  criticalActions: z.array(
    z.object({
      priority: z.number().min(1).max(5),
      title: z.string(),
      sourceDomain: domainEnum,
      sourceTopic: z.string(),
      sourceStatus: z.string(),
      description: z.string(),
      action: z.string(),
    })
  ).default([]),
  needsValidation: z.array(
    z.object({
      title: z.string(),
      sourceDomain: domainEnum,
      sourceTopic: z.string(),
      description: z.string(),
      validationStep: z.string(),
    })
  ).default([]),
  assumptions: z.array(
    z.object({
      title: z.string(),
      sourceDomain: domainEnum,
      sourceTopic: z.string(),
      description: z.string(),
      validation: z.string(),
    })
  ).default([]),
  roadmapPhase1: z.array(
    z.object({
      action: z.string(),
      rationale: z.string(),
      sourceDomain: domainEnum,
      sourceTopic: z.string(),
    })
  ).default([]),
  roadmapPhase2: z.array(
    z.object({
      action: z.string(),
      rationale: z.string(),
      sourceDomain: domainEnum,
      sourceTopic: z.string(),
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

    // Generate V3 structured snapshot — use schema matched to assessment status
    const v3UserPrompt = buildSynthesisV3UserPrompt(inputs);
    const isAssessable = assessmentStatus.status === 'assessable';
    console.log('[Snapshot] Calling Claude API with model:', models.synthesis, '| assessable:', isAssessable);

    let generatedV3Snapshot: z.infer<typeof incompleteSnapshotSchema> | z.infer<typeof assessableSnapshotSchema>;
    try {
      if (isAssessable) {
        const v3Result = await generateObject({
          model: anthropic(models.synthesis),
          schema: assessableSnapshotSchema,
          system: SYNTHESIS_V3_SYSTEM_PROMPT,
          prompt: v3UserPrompt,
          maxTokens: modelConfig.synthesis.maxTokens,
          temperature: modelConfig.synthesis.temperature,
        });
        generatedV3Snapshot = v3Result.object;
      } else {
        const v3Result = await generateObject({
          model: anthropic(models.synthesis),
          schema: incompleteSnapshotSchema,
          system: SYNTHESIS_V3_SYSTEM_PROMPT,
          prompt: v3UserPrompt,
          maxTokens: modelConfig.synthesis.maxTokens,
          temperature: modelConfig.synthesis.temperature,
        });
        generatedV3Snapshot = v3Result.object;
      }
      console.log('[Snapshot] V3 snapshot generated');
    } catch (aiError) {
      const msg = aiError instanceof Error ? aiError.message : String(aiError);
      console.error('[Snapshot] Claude API error:', msg);
      throw new Error(`AI generation failed: ${msg}`);
    }

    // For incomplete assessments, cast to access topicResults/earlySignals/recommendedTopics
    const incompleteData = isAssessable ? null : generatedV3Snapshot as z.infer<typeof incompleteSnapshotSchema>;
    // For assessable reports, cast to access V5 fields
    const assessableData = isAssessable ? generatedV3Snapshot as z.infer<typeof assessableSnapshotSchema> : null;

    // Count critical actions for key stats (derived from V3)
    const criticalGapsCount = (assessableData?.criticalActions || []).length;

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
    const topicResults = incompleteData?.topicResults || [];
    const criticalActions = assessableData?.criticalActions || [];
    const assumptions = assessableData?.assumptions || [];

    // Key findings: derive from topic results (incomplete path only)
    const dbKeyFindings = topicResults
      .filter((t) => t.keyInsight)
      .slice(0, 5)
      .map((t) => ({
        domain: t.domain as DomainType,
        finding: t.keyInsight || '',
        confidence: (t.confidence || 'medium') as ConfidenceLevel,
      }));

    // Strengths: derive from high-confidence covered topics (incomplete path)
    const dbStrengths = topicResults
      .filter((t) => t.status === 'covered' && t.confidence === 'high')
      .slice(0, 5)
      .map((t) => ({
        domain: t.domain as DomainType,
        item: t.topicLabel,
        evidence: t.keyInsight || '',
        user_quote: null,
      }));

    // Assumptions: derive from V3 assumptions
    const dbAssumptions = assumptions.map((a) => ({
      domain: a.sourceDomain as DomainType,
      item: a.title,
      risk: a.description,
      validation_suggestion: a.validation,
    }));

    // Gaps: derive from V3 critical actions
    const dbGaps = criticalActions.map((ca) => ({
      domain: ca.sourceDomain as DomainType,
      item: ca.title,
      importance: 'critical' as const,
      recommendation: ca.description,
      research_action: null,
      execution_action: ca.action,
    }));

    // Next steps: empty for V5 (roadmap replaces action plan)
    const dbNextSteps: Array<{ priority: number; action: string; domain: DomainType; rationale: string; week: number }> = [];

    // Key stats with actual critical gaps count
    const dbKeyStats = {
      topics_covered: keyStats.topicsCovered,
      total_topics: keyStats.totalTopics,
      high_confidence_inputs: keyStats.highConfidenceInputs,
      critical_gaps_count: criticalGapsCount,
    };

    // Calculate expansion positioning (5-tier scale, assessable only)
    const calculateExpansionPositioning = (): ExpansionPositioning => {
      const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];
      let highDomains = 0;
      let lowDomains = 0;
      for (const domain of domains) {
        const dr = domainResults[domain];
        if (dr.confidence_level === 'high') highDomains++;
        if (dr.confidence_level === 'low') lowDomains++;
      }
      const criticalCount = criticalGapsCount;
      const validationCount = (assessableData?.needsValidation || []).length;

      if (highDomains >= 4 && criticalCount === 0 && validationCount <= 1) return 'expansion_ready';
      if (highDomains >= 3 && criticalCount <= 1 && validationCount <= 3) return 'well_positioned';
      if (highDomains >= 2 && criticalCount <= 2) return 'conditionally_positioned';
      if (lowDomains >= 2 || criticalCount >= 3) return 'foundation_building';
      return 'early_exploration';
    };

    // Calculate readiness level based on actual data (assessable only)
    const calculateReadinessLevel = (): 'ready' | 'ready_with_caveats' | 'not_ready' => {
      const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];
      let highConfidenceDomains = 0;
      let lowConfidenceDomains = 0;
      let domainsWithNoHighTopics = 0;

      for (const domain of domains) {
        const dr = domainResults[domain];
        if (dr.confidence_level === 'high') highConfidenceDomains++;
        if (dr.confidence_level === 'low') lowConfidenceDomains++;
        if (dr.confidence_breakdown.high === 0 && dr.topics_covered > 0) domainsWithNoHighTopics++;
      }

      const assumptionsCount = (assessableData?.assumptions || []).length;
      console.log('[Snapshot] Readiness calc:', { highConfidenceDomains, lowConfidenceDomains, domainsWithNoHighTopics, criticalGapsCount, assumptionsCount });

      if (lowConfidenceDomains >= 2 || criticalGapsCount >= 3 || domainsWithNoHighTopics > 0) return 'not_ready';
      if (highConfidenceDomains >= 4 && criticalGapsCount === 0 && assumptionsCount <= 2) return 'ready';
      return 'ready_with_caveats';
    };

    const calculatedReadinessLevel = isAssessable ? calculateReadinessLevel() : undefined;
    const calculatedPositioning = isAssessable ? calculateExpansionPositioning() : undefined;
    console.log('[Snapshot] Final readiness level:', calculatedReadinessLevel, '| positioning:', calculatedPositioning);

    // Build V3 data structure — topics derived purely server-side for assessable reports
    const v3Data = {
      assessment_status: assessmentStatus.status,
      coverage_percentage: assessmentStatus.coverage_percentage,
      topics_covered: assessmentStatus.topics_covered,
      topics_total: assessmentStatus.topics_total,
      readiness_level: calculatedReadinessLevel,
      verdict_summary: isAssessable ? assessableData?.verdictSummary : undefined,
      expansion_positioning: calculatedPositioning,
      executive_summary: isAssessable ? assessableData?.executiveSummary : undefined,
      domains: Object.fromEntries(
        (['market', 'product', 'gtm', 'operations', 'financials'] as DomainType[]).map((domain) => {
          const dr = domainResults[domain];
          const topicDefs = TOPIC_DEFINITIONS[domain];
          const domainInputs = inputs.filter(i => i.domain === domain);

          const topics = topicDefs.map((td) => {
            // For incomplete: use AI topicResults if available
            const topicResult = incompleteData?.topicResults?.find(tr => tr.topicId === td.id);
            const hasInput = domainInputs.some(i => i.question_id === td.id);
            const matchingInput = domainInputs.find(i => i.question_id === td.id);
            const isCovered = topicResult?.status === 'covered' || hasInput;

            return {
              topic_id: td.id,
              topic_label: td.label,
              status: isCovered ? 'covered' : 'not_covered',
              confidence: topicResult?.confidence || (matchingInput?.confidence_level as ConfidenceLevel | undefined),
              key_insight: topicResult?.keyInsight || undefined,
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
      strengths: (assessableData?.strengths || []).map(s => ({
        title: s.title,
        description: s.description,
        source_domain: s.sourceDomain as DomainType,
        source_topic: s.sourceTopic,
        confidence: s.confidence as ConfidenceLevel,
      })),
      risks: (assessableData?.risks || []).map(r => ({
        title: r.title,
        description: r.description,
        source_domain: r.sourceDomain as DomainType,
        source_topic: r.sourceTopic,
      })),
      critical_actions: (assessableData?.criticalActions || []).map(ca => ({
        priority: ca.priority,
        title: ca.title,
        source_domain: ca.sourceDomain as DomainType,
        source_topic: ca.sourceTopic,
        source_status: ca.sourceStatus,
        description: ca.description,
        action: ca.action,
      })),
      needs_validation: (assessableData?.needsValidation || []).map(nv => ({
        title: nv.title,
        source_domain: nv.sourceDomain as DomainType,
        source_topic: nv.sourceTopic,
        description: nv.description,
        validation_step: nv.validationStep,
      })),
      assumptions: (assessableData?.assumptions || []).map(a => ({
        title: a.title,
        source_domain: a.sourceDomain as DomainType,
        source_topic: a.sourceTopic,
        description: a.description,
        validation: a.validation,
      })),
      roadmap_phase1: (assessableData?.roadmapPhase1 || []).map(r => ({
        action: r.action,
        rationale: r.rationale,
        source_domain: r.sourceDomain as DomainType,
        source_topic: r.sourceTopic,
      })),
      roadmap_phase2: (assessableData?.roadmapPhase2 || []).map(r => ({
        action: r.action,
        rationale: r.rationale,
        source_domain: r.sourceDomain as DomainType,
        source_topic: r.sourceTopic,
      })),
      action_plan: [] as Array<{ week: number; action: string; source_domain: DomainType; source_topic: string; unblocks: string }>,
      early_signals: (incompleteData?.earlySignals || []).map(es => ({
        type: es.type,
        title: es.title,
        description: es.description,
        derived_from: es.derivedFrom,
        blocked_by: es.blockedBy,
        implication: es.implication,
      })),
      recommended_topics: (incompleteData?.recommendedTopics || []).map(rt => ({
        domain: rt.domain as DomainType,
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
          verdict_summary: assessableData?.verdictSummary || 'Assessment incomplete',
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
