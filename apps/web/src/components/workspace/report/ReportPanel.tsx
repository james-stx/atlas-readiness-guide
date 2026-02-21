'use client';

import { useState, useEffect } from 'react';
import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { DOMAINS } from '@/lib/progress';
import { Compass, Loader2, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import { getSnapshot } from '@/lib/api-client';

// Import existing snapshot components
import { AssessmentOverview } from '@/components/snapshot/AssessmentOverview';
import { ActionPlanUnified } from '@/components/snapshot/ActionPlanUnified';
import { AssessmentProgress } from '@/components/snapshot/AssessmentProgress';
import { EarlySignals } from '@/components/snapshot/EarlySignals';
import { RecommendedTopics } from '@/components/snapshot/RecommendedTopics';
import { UnlockPreview } from '@/components/snapshot/UnlockPreview';
import { ExportSection } from '@/components/snapshot/export-section';

import type { Snapshot, SnapshotV3 } from '@atlas/types';

export function ReportPanel() {
  const {
    progressState,
    reportState,
    isReportStale,
    markReportGenerated,
    switchToAssessment,
  } = useWorkspace();

  const {
    session,
    inputs,
    snapshot: contextSnapshot,
    generateSnapshot,
    isLoading,
  } = useAssessment();

  const [snapshot, setSnapshot] = useState<Snapshot | null>(contextSnapshot);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(true);

  // Calculate progress
  const totalTopics = 25;
  const coveredTopics = Object.values(progressState.domainProgress).reduce(
    (sum, dp) => sum + dp.coveredTopics.length,
    0
  );
  const progressPercent = Math.round((coveredTopics / totalTopics) * 100);

  // Check requirements for generation
  const allDomainsHaveMinimum = DOMAINS.every(
    (d) => progressState.domainProgress[d.key].coveredTopics.length >= 2
  );
  const hasMinimumCoverage = progressPercent >= 60;
  const canGenerateReport = hasMinimumCoverage && allDomainsHaveMinimum;

  // Load existing snapshot on mount
  useEffect(() => {
    async function loadSnapshot() {
      if (!session) {
        setIsLoadingSnapshot(false);
        return;
      }

      // If we already have a snapshot in context, use it
      if (contextSnapshot) {
        setSnapshot(contextSnapshot);
        setIsLoadingSnapshot(false);
        return;
      }

      // Try to fetch existing snapshot
      try {
        const { snapshot: existingSnapshot } = await getSnapshot(session.id);
        if (existingSnapshot) {
          setSnapshot(existingSnapshot);
        }
      } catch (err) {
        // No snapshot exists yet - that's fine
        console.log('[ReportPanel] No existing snapshot');
      } finally {
        setIsLoadingSnapshot(false);
      }
    }

    loadSnapshot();
  }, [session, contextSnapshot]);

  // Update local snapshot when context changes
  useEffect(() => {
    if (contextSnapshot) {
      setSnapshot(contextSnapshot);
    }
  }, [contextSnapshot]);

  // Generate handler
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await generateSnapshot();
      // Mark as generated with current input count
      markReportGenerated(inputs.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  // Loading state
  if (isLoadingSnapshot || isGenerating || isLoading) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[720px] mx-auto px-8 py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#37352F] mx-auto mb-4" />
            <h2 className="text-[18px] font-semibold text-[#37352F] mb-2">
              {isGenerating ? 'Generating Your Report...' : 'Loading...'}
            </h2>
            {isGenerating && (
              <p className="text-[14px] text-[#5C5A56]">
                Analyzing your responses and creating actionable insights
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[720px] mx-auto px-8 py-12">
          <div className="bg-[#FBE4E4] rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-[#E03E3E] mx-auto mb-3" />
            <h2 className="text-[16px] font-semibold text-[#E03E3E] mb-2">
              Generation Failed
            </h2>
            <p className="text-[14px] text-[#5C5A56] mb-4">{error}</p>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-[#2383E2] text-white rounded-md text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATE 1: Not ready to generate
  if (!canGenerateReport && !snapshot) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[720px] mx-auto px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#F7F6F3] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-[#37352F]" />
            </div>
            <h1 className="text-[22px] font-semibold text-[#37352F] mb-2">
              Readiness Report
            </h1>
            <p className="text-[14px] text-[#5C5A56]">
              Complete your assessment to generate your personalized report
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-lg border border-[#E8E6E1] p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[16px] text-[#9B9A97]">○</span>
              <h3 className="text-[15px] font-semibold text-[#37352F]">
                Not Ready to Generate
              </h3>
            </div>

            <p className="text-[13px] text-[#5C5A56] mb-4">
              Complete at least 60% of topics with coverage in all 5 domains to generate your readiness report.
            </p>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[12px] text-[#5C5A56] mb-1">
                <span>{coveredTopics} of {totalTopics} topics ({progressPercent}%)</span>
                <span>60% needed</span>
              </div>
              <div className="h-2 bg-[#E8E6E1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#37352F] rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Domain breakdown */}
            <div className="space-y-2">
              {DOMAINS.map((domain) => {
                const dp = progressState.domainProgress[domain.key];
                const count = dp.coveredTopics.length;
                const needsMore = count < 2;

                return (
                  <div key={domain.key} className="flex items-center gap-3 text-[13px]">
                    <span className={`w-24 ${needsMore ? 'text-[#9B9A97]' : 'text-[#37352F]'}`}>
                      {domain.label}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-[10px] ${i < count ? 'text-[#37352F]' : 'text-[#D4D1CB]'}`}
                        >
                          {i < count ? '●' : '○'}
                        </span>
                      ))}
                    </div>
                    <span className="text-[12px] text-[#9B9A97]">{count}/5</span>
                    {needsMore && (
                      <span className="text-[11px] text-[#D9730D]">Need 2+</span>
                    )}
                    {count >= 2 && (
                      <span className="text-[11px] text-[#0F7B6C]">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={switchToAssessment}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2383E2] text-white rounded-lg text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Assessment
          </button>
        </div>
      </div>
    );
  }

  // STATE 2: Ready to generate (first time)
  if (canGenerateReport && !snapshot) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[720px] mx-auto px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#DDEDEA] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-[#0F7B6C]" />
            </div>
            <h1 className="text-[22px] font-semibold text-[#37352F] mb-2">
              Readiness Report
            </h1>
            <p className="text-[14px] text-[#5C5A56]">
              Your assessment is ready for analysis
            </p>
          </div>

          {/* Ready Card */}
          <div className="bg-[#DDEDEA] rounded-lg border border-[#0F7B6C]/20 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[16px] text-[#0F7B6C]">●</span>
              <h3 className="text-[15px] font-semibold text-[#0F7B6C]">
                Ready to Generate
              </h3>
            </div>

            <p className="text-[13px] text-[#5C5A56] mb-4">
              You've covered {coveredTopics}/{totalTopics} topics ({progressPercent}%) with coverage across all domains.
              Generate your report to see:
            </p>

            <ul className="space-y-2 text-[13px] text-[#5C5A56] mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#0F7B6C] mt-0.5">→</span>
                <span>Your readiness verdict (Ready / Ready with Caveats / Not Yet Ready)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0F7B6C] mt-0.5">→</span>
                <span>Critical blockers to address before investing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0F7B6C] mt-0.5">→</span>
                <span>Assumptions that need validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0F7B6C] mt-0.5">→</span>
                <span>30-day action plan with prioritized next steps</span>
              </li>
            </ul>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-4 py-3 bg-[#0F7B6C] text-white rounded-lg text-[14px] font-medium hover:bg-[#0A5C51] transition-colors disabled:opacity-50"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATE 3 & 4: Report exists (viewing / needs refresh)
  const v3 = snapshot?.v3 as SnapshotV3 | undefined;

  // If no V3 data, show regenerate prompt
  if (!v3) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[720px] mx-auto px-8 py-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#37352F] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-[22px] font-semibold text-[#37352F] mb-2">
              Readiness Report
            </h1>
          </div>

          <div className="bg-white rounded-lg border border-[#E8E6E1] p-6 text-center">
            <p className="text-[14px] text-[#5C5A56] mb-4">
              Please regenerate your report to see the latest format with detailed analysis.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-[#2383E2] text-white rounded-md text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors disabled:opacity-50"
            >
              Regenerate Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isIncomplete = v3.assessment_status === 'incomplete';
  const reportDate = snapshot?.created_at
    ? new Date(snapshot.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  // Full report view
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-[720px] mx-auto px-8 py-8">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#37352F] rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[18px] font-semibold text-[#37352F]">
                Readiness Report
              </h1>
              {reportDate && (
                <p className="text-[12px] text-[#9B9A97]">
                  Generated {reportDate}
                </p>
              )}
            </div>
          </div>

          {!isReportStale && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#5C5A56] hover:bg-[#F7F6F3] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>

        {/* Stale warning banner */}
        {isReportStale && (
          <div className="bg-[#FAEBDD] border border-[#D9730D]/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-[#D9730D] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#D9730D]">
                  Your report is out of date
                </p>
                <p className="text-[12px] text-[#5C5A56] mt-1">
                  You've added new inputs since this report was generated. Update it now to reflect your latest assessment.
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D9730D] hover:bg-[#C0620B] text-white rounded-md text-[13px] font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Update Report
            </button>
          </div>
        )}

        {/* Report Content */}
        <div className="space-y-6">
          {isIncomplete ? (
            <>
              {/* Incomplete Assessment Layout */}
              <AssessmentProgress
                coveragePercentage={v3.coverage_percentage}
                topicsCovered={v3.topics_covered}
                topicsTotal={v3.topics_total}
                domains={v3.domains}
              />

              {v3.early_signals && v3.early_signals.length > 0 && (
                <EarlySignals signals={v3.early_signals} />
              )}

              {v3.recommended_topics && v3.recommended_topics.length > 0 && (
                <RecommendedTopics recommendations={v3.recommended_topics} />
              )}

              <UnlockPreview
                coveragePercentage={v3.coverage_percentage}
                domainsNeedingWork={
                  v3.domains
                    ? (['market', 'product', 'gtm', 'operations', 'financials'] as const)
                        .filter(d => v3.domains[d]?.topics_covered < 2)
                    : undefined
                }
              />

              <ExportSection
                sessionId={session?.id || ''}
                email={session?.email || ''}
                keyStats={snapshot?.key_stats}
                readinessLevel={v3.readiness_level}
              />
            </>
          ) : (
            <>
              {/* Complete Assessment Layout */}
              <AssessmentOverview
                assessmentStatus={v3.assessment_status}
                coveragePercentage={v3.coverage_percentage}
                topicsCovered={v3.topics_covered}
                topicsTotal={v3.topics_total}
                readinessLevel={v3.readiness_level}
                verdictSummary={v3.verdict_summary}
                domains={v3.domains}
              />

              <ActionPlanUnified
                criticalActions={v3.critical_actions}
                assumptions={v3.assumptions}
                actionPlan={v3.action_plan}
              />

              <ExportSection
                sessionId={session?.id || ''}
                email={session?.email || ''}
                keyStats={snapshot?.key_stats}
                readinessLevel={v3.readiness_level}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-[#E8E6E1] text-center">
          <p className="text-[11px] text-[#9B9A97]">
            Generated by Atlas Readiness Guide | Based on your self-reported information.
          </p>
        </footer>
      </div>
    </div>
  );
}
