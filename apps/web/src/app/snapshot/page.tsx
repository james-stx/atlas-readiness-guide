'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/context/assessment-context';
import { getSnapshot } from '@/lib/api-client';
// V4 Components for incomplete assessments
import { AssessmentProgress } from '@/components/snapshot/AssessmentProgress';
import { EarlySignals } from '@/components/snapshot/EarlySignals';
import { RecommendedTopics } from '@/components/snapshot/RecommendedTopics';
import { UnlockPreview } from '@/components/snapshot/UnlockPreview';
// Components for complete assessments
import { AssessmentOverview } from '@/components/snapshot/AssessmentOverview';
import { ActionPlanUnified } from '@/components/snapshot/ActionPlanUnified';
import { ExportSection } from '@/components/snapshot/export-section';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2, Compass, RefreshCw } from 'lucide-react';
import type { Snapshot, SnapshotV3 } from '@atlas/types';

export default function SnapshotPage() {
  const router = useRouter();
  const { session, snapshot: contextSnapshot, generateSnapshot, isLoading, recoverSession, hasStoredSession } = useAssessment();

  // ALL useState hooks must be at the top, before any conditional returns
  const [snapshot, setSnapshot] = useState<Snapshot | null>(contextSnapshot);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // Navigation handler
  const handleBackToWorkspace = () => {
    window.location.href = '/workspace';
  };

  // Try to recover session if we don't have one but there's one in storage
  useEffect(() => {
    if (!session && hasStoredSession && !isRecovering) {
      setIsRecovering(true);
      recoverSession().then((recovered) => {
        if (!recovered) {
          router.push('/start');
        }
        setIsRecovering(false);
      });
    } else if (!session && !hasStoredSession) {
      router.push('/start');
    }
  }, [session, hasStoredSession, recoverSession, router, isRecovering]);

  // Load existing snapshot (don't auto-generate)
  useEffect(() => {
    async function loadSnapshot() {
      if (!session) return;

      // If we already have a snapshot in context, use it
      if (contextSnapshot) {
        setSnapshot(contextSnapshot);
        return;
      }

      // Try to fetch existing snapshot (but don't auto-generate)
      try {
        const { snapshot: existingSnapshot } = await getSnapshot(session.id);

        if (existingSnapshot) {
          setSnapshot(existingSnapshot);
        }
        // If no snapshot exists, we'll show the "no snapshot" state
        // User must explicitly click "Generate Report" to create one
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load snapshot');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate handler
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setError(null);
    try {
      await generateSnapshot();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate report');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Loading state (including session recovery)
  if (!session || isGenerating || isLoading || isRecovering) {
    return (
      <div className="min-h-screen bg-[#FAF9F7]">
        <div className="max-w-[720px] mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#37352F] mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-[#37352F] mb-2">
              {isGenerating ? 'Generating Your Report...' : 'Loading...'}
            </h1>
            {isGenerating && (
              <p className="text-[14px] text-[#5C5A56]">
                Analyzing your responses and creating actionable insights
              </p>
            )}
          </div>

          {/* Skeleton loading state */}
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E03E3E] mb-4">{error}</p>
          <a
            href="/workspace"
            className="text-[#2383E2] hover:underline"
          >
            Return to workspace
          </a>
        </div>
      </div>
    );
  }

  // No snapshot yet - show generate option
  if (!snapshot) {
    return (
      <div className="min-h-screen bg-[#FAF9F7]">
        <header className="flex h-12 items-center justify-between border-b border-[#E8E6E1] bg-white px-4 sticky top-0 z-50">
          <a
            href="/workspace"
            className="flex items-center gap-2 text-[#5C5A56] hover:text-[#37352F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[13px]">Back to Workspace</span>
          </a>
          <div className="text-[13px] text-[#9B9A97]">{session.email}</div>
        </header>

        <main className="max-w-[720px] mx-auto px-6 py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#37352F] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-[24px] font-semibold text-[#37352F] mb-2">
              Your Readiness Report
            </h1>
            <p className="text-[14px] text-[#5C5A56] mb-6">
              Generate a comprehensive analysis of your U.S. expansion readiness based on your assessment progress.
            </p>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-3 bg-[#2383E2] text-white rounded-lg text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Report
            </button>

            <p className="text-[12px] text-[#9B9A97] mt-4">
              Or{' '}
              <a
                href="/workspace"
                className="text-[#2383E2] hover:underline"
              >
                continue your assessment
              </a>
              {' '}to improve your report.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Check if V3 data is available
  const v3 = snapshot.v3 as SnapshotV3 | undefined;

  // If no V3 data, show fallback
  if (!v3) {
    return (
      <div className="min-h-screen bg-[#FAF9F7]">
        <header className="flex h-12 items-center justify-between border-b border-[#E8E6E1] bg-white px-4 sticky top-0 z-50">
          <a
            href="/workspace"
            className="flex items-center gap-2 text-[#5C5A56] hover:text-[#37352F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[13px]">Back to Workspace</span>
          </a>
          <div className="text-[13px] text-[#9B9A97]">{session.email}</div>
        </header>

        <main className="max-w-[720px] mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#37352F] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-[24px] font-semibold text-[#37352F] mb-2">
              Your Readiness Report
            </h1>
            <p className="text-[14px] text-[#5C5A56]">
              Generating enhanced report format...
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#E8E6E1] p-6 text-center">
            <p className="text-[14px] text-[#5C5A56]">
              Please regenerate your report to see the enhanced format with detailed analysis.
            </p>
            <button
              onClick={handleRegenerate}
              className="mt-4 px-4 py-2 bg-[#2383E2] text-white rounded-md text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors"
            >
              Regenerate Report
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isIncomplete = v3.assessment_status === 'incomplete';

  // Format the report date
  const reportDate = snapshot.created_at
    ? new Date(snapshot.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Header */}
      <header className="flex h-12 items-center justify-between border-b border-[#E8E6E1] bg-white px-4 sticky top-0 z-50 print:hidden">
        <a
          href="/workspace"
          className="flex items-center gap-2 text-[#5C5A56] hover:text-[#37352F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[13px]">Back to Workspace</span>
        </a>
        <div className="flex items-center gap-3">
          {reportDate && (
            <span className="text-[11px] text-[#9B9A97]">
              Generated {reportDate}
            </span>
          )}
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-[12px] text-[#5C5A56] hover:bg-[#F7F6F3] hover:text-[#37352F] transition-colors disabled:opacity-50"
            title="Regenerate report with latest assessment data"
          >
            <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Refresh'}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[720px] mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-[#37352F] rounded-lg flex items-center justify-center mx-auto mb-3">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-[22px] font-semibold text-[#37352F]">
            Your Readiness Report
          </h1>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {isIncomplete ? (
            <>
              {/* V4 Incomplete Assessment Layout */}

              {/* Section 1: Assessment Progress */}
              <AssessmentProgress
                coveragePercentage={v3.coverage_percentage}
                topicsCovered={v3.topics_covered}
                topicsTotal={v3.topics_total}
                domains={v3.domains}
              />

              {/* Section 2: Early Signals (cross-domain synthesis) */}
              {v3.early_signals && v3.early_signals.length > 0 && (
                <EarlySignals signals={v3.early_signals} />
              )}

              {/* Section 3: Recommended Next Topics */}
              {v3.recommended_topics && v3.recommended_topics.length > 0 && (
                <RecommendedTopics recommendations={v3.recommended_topics} />
              )}

              {/* Section 4: What You'll Unlock + CTA */}
              <UnlockPreview
                coveragePercentage={v3.coverage_percentage}
                domainsNeedingWork={
                  v3.domains
                    ? (['market', 'product', 'gtm', 'operations', 'financials'] as const)
                        .filter(d => v3.domains[d]?.topics_covered < 2)
                    : undefined
                }
              />

              {/* Section 5: Export (simplified for incomplete) */}
              <ExportSection
                sessionId={session.id}
                email={session.email}
                keyStats={snapshot.key_stats}
                readinessLevel={v3.readiness_level}
              />
            </>
          ) : (
            <>
              {/* Complete Assessment Layout */}

              {/* Section 1: Readiness Verdict */}
              <AssessmentOverview
                assessmentStatus={v3.assessment_status}
                coveragePercentage={v3.coverage_percentage}
                topicsCovered={v3.topics_covered}
                topicsTotal={v3.topics_total}
                readinessLevel={v3.readiness_level}
                verdictSummary={v3.verdict_summary}
                domains={v3.domains}
              />

              {/* Section 2: Action Plan (blockers, assumptions, 30-day plan) */}
              <ActionPlanUnified
                criticalActions={v3.critical_actions}
                assumptions={v3.assumptions}
                actionPlan={v3.action_plan}
              />

              {/* Section 3: Export */}
              <ExportSection
                sessionId={session.id}
                email={session.email}
                keyStats={snapshot.key_stats}
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
      </main>
    </div>
  );
}
