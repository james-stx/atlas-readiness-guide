'use client';

import { useState, useEffect } from 'react';
import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { DOMAINS } from '@/lib/progress';
import { Compass, Loader2, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import { getSnapshot } from '@/lib/api-client';

import { ReportExecutiveSummary } from '@/components/snapshot/report-executive-summary';
import { ReportCoverage } from '@/components/snapshot/report-coverage';
import { ReportStrengths } from '@/components/snapshot/report-strengths';
import { ReportRisks } from '@/components/snapshot/report-risks';
import { ReportCritical } from '@/components/snapshot/report-critical';
import { ReportNeedsValidation } from '@/components/snapshot/report-needs-validation';
import { ReportRoadmap } from '@/components/snapshot/report-roadmap';
import { ExportSection } from '@/components/snapshot/export-section';
import { AssessmentProgress } from '@/components/snapshot/AssessmentProgress';
import { EarlySignals } from '@/components/snapshot/EarlySignals';
import { RecommendedTopics } from '@/components/snapshot/RecommendedTopics';
import { UnlockPreview } from '@/components/snapshot/UnlockPreview';

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

  const totalTopics = 25;
  const coveredTopics = Object.values(progressState.domainProgress).reduce(
    (sum, dp) => sum + dp.coveredTopics.length, 0
  );
  const progressPercent = Math.round((coveredTopics / totalTopics) * 100);

  const allDomainsHaveMinimum = DOMAINS.every(
    (d) => progressState.domainProgress[d.key].coveredTopics.length >= 2
  );
  const canGenerateReport = progressPercent >= 60 && allDomainsHaveMinimum;

  useEffect(() => {
    async function loadSnapshot() {
      if (!session) { setIsLoadingSnapshot(false); return; }
      if (contextSnapshot) { setSnapshot(contextSnapshot); setIsLoadingSnapshot(false); return; }
      try {
        const { snapshot: existing } = await getSnapshot(session.id);
        if (existing) setSnapshot(existing);
      } catch {
        // No snapshot yet
      } finally {
        setIsLoadingSnapshot(false);
      }
    }
    loadSnapshot();
  }, [session, contextSnapshot]);

  useEffect(() => {
    if (contextSnapshot) setSnapshot(contextSnapshot);
  }, [contextSnapshot]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await generateSnapshot();
      markReportGenerated(inputs.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoadingSnapshot || isGenerating || isLoading) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[720px] mx-auto px-8 py-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#37352F] mx-auto mb-4" />
          <h2 className="text-[18px] font-semibold text-[#37352F] mb-2">
            {isGenerating ? 'Generating Your Report…' : 'Loading…'}
          </h2>
          {isGenerating && (
            <p className="text-[14px] text-[#5C5A56]">
              Analysing your responses and building your personalised report
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[720px] mx-auto px-8 py-12">
          <div className="bg-[#FBE4E4] rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-[#E03E3E] mx-auto mb-3" />
            <h2 className="text-[16px] font-semibold text-[#E03E3E] mb-2">Generation Failed</h2>
            <p className="text-[14px] text-[#5C5A56] mb-4">{error}</p>
            <button onClick={handleGenerate} className="px-4 py-2 bg-[#2383E2] text-white rounded-md text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Not ready ──────────────────────────────────────────────────────────────
  if (!canGenerateReport && !snapshot) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[720px] mx-auto px-8 py-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#F7F6F3] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-[#37352F]" />
            </div>
            <h1 className="text-[22px] font-semibold text-[#37352F] mb-2">Readiness Report</h1>
            <p className="text-[14px] text-[#5C5A56]">Complete your assessment to generate your report</p>
          </div>
          <div className="bg-white rounded-lg border border-[#E8E6E1] p-6 mb-6">
            <p className="text-[13px] text-[#5C5A56] mb-4">
              Cover at least 60% of topics with 2+ topics in each domain to unlock your report.
            </p>
            <div className="mb-4">
              <div className="flex justify-between text-[12px] text-[#5C5A56] mb-1">
                <span>{coveredTopics}/{totalTopics} topics ({progressPercent}%)</span>
                <span>60% needed</span>
              </div>
              <div className="h-2 bg-[#E8E6E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#37352F] rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              {DOMAINS.map((domain) => {
                const dp = progressState.domainProgress[domain.key];
                const count = dp.coveredTopics.length;
                return (
                  <div key={domain.key} className="flex items-center gap-3 text-[13px]">
                    <span className={`w-28 ${count < 2 ? 'text-[#9B9A97]' : 'text-[#37352F]'}`}>{domain.label}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-[10px]" style={{ color: i < count ? '#37352F' : '#D4D1CB' }}>
                          {i < count ? '●' : '○'}
                        </span>
                      ))}
                    </div>
                    <span className="text-[12px] text-[#9B9A97]">{count}/5</span>
                    {count < 2 && <span className="text-[11px] text-[#D9730D]">Need 2+</span>}
                    {count >= 2 && <span className="text-[11px] text-[#0F7B6C]">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={switchToAssessment} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2383E2] text-white rounded-lg text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Continue Assessment
          </button>
        </div>
      </div>
    );
  }

  // ── Ready to generate (first time) ────────────────────────────────────────
  if (canGenerateReport && !snapshot) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[720px] mx-auto px-8 py-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#DDEDEA] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-[#0F7B6C]" />
            </div>
            <h1 className="text-[22px] font-semibold text-[#37352F] mb-2">Readiness Report</h1>
            <p className="text-[14px] text-[#5C5A56]">Your assessment is ready for analysis</p>
          </div>
          <div className="bg-[#DDEDEA] rounded-lg border border-[#0F7B6C]/20 p-6 mb-6">
            <p className="text-[13px] font-semibold text-[#0F7B6C] mb-3">
              {coveredTopics}/{totalTopics} topics covered ({progressPercent}%) across all domains
            </p>
            <ul className="space-y-2 text-[13px] text-[#5C5A56] mb-6">
              {['Your expansion positioning (5-tier scale)', 'Validated strengths and risks', 'Critical items to resolve', 'What needs validation', '90-day expansion roadmap'].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#0F7B6C] mt-0.5">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleGenerate} disabled={isGenerating} className="w-full px-4 py-3 bg-[#0F7B6C] text-white rounded-lg text-[14px] font-medium hover:bg-[#0A5C51] transition-colors disabled:opacity-50">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Report exists ──────────────────────────────────────────────────────────
  const v3 = snapshot?.v3 as SnapshotV3 | undefined;

  if (!v3) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[720px] mx-auto px-8 py-8">
          <div className="bg-white rounded-lg border border-[#E8E6E1] p-6 text-center">
            <p className="text-[14px] text-[#5C5A56] mb-4">
              Please regenerate your report to see the latest format.
            </p>
            <button onClick={handleGenerate} disabled={isGenerating} className="px-4 py-2 bg-[#2383E2] text-white rounded-md text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors disabled:opacity-50">
              Regenerate Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isIncomplete = v3.assessment_status === 'incomplete';
  const reportDate = snapshot?.created_at
    ? new Date(snapshot.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F6F3]">
      <div className="max-w-[720px] mx-auto px-8 py-8">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#37352F] rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[18px] font-semibold text-[#37352F]">Readiness Report</h1>
              {reportDate && (
                <p className="text-[12px] text-[#9B9A97]">Generated {reportDate}</p>
              )}
            </div>
          </div>
          {!isReportStale && (
            <button onClick={handleGenerate} disabled={isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#5C5A56] hover:bg-[#EBEBEA] transition-colors">
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>

        {/* ── Stale banner ── */}
        {isReportStale && (
          <div className="bg-[#FAEBDD] border border-[#D9730D]/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-[#D9730D] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#D9730D]">Your report is out of date</p>
                <p className="text-[12px] text-[#5C5A56] mt-1">
                  You've added new inputs since this report was generated. Update it to reflect your latest assessment.
                </p>
              </div>
            </div>
            <button onClick={handleGenerate} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D9730D] hover:bg-[#C0620B] text-white rounded-md text-[13px] font-semibold transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Update Report
            </button>
          </div>
        )}

        {/* ── Incomplete assessment layout ── */}
        {isIncomplete ? (
          <div className="space-y-6">
            <AssessmentProgress
              coveragePercentage={v3.coverage_percentage}
              topicsCovered={v3.topics_covered}
              topicsTotal={v3.topics_total}
              domains={v3.domains}
            />
            {v3.early_signals && v3.early_signals.length > 0 && <EarlySignals signals={v3.early_signals} />}
            {v3.recommended_topics && v3.recommended_topics.length > 0 && <RecommendedTopics recommendations={v3.recommended_topics} />}
            <UnlockPreview
              coveragePercentage={v3.coverage_percentage}
              domainsNeedingWork={
                v3.domains
                  ? (['market', 'product', 'gtm', 'operations', 'financials'] as const)
                      .filter(d => v3.domains[d]?.topics_covered < 2)
                  : undefined
              }
            />
            <ExportSection sessionId={session?.id || ''} email={session?.email || ''} keyStats={snapshot?.key_stats} readinessLevel={v3.readiness_level} />
          </div>
        ) : (
          // ── Full report layout ─────────────────────────────────────────────
          <div className="space-y-6">

            {/* 1. Executive Summary */}
            {v3.expansion_positioning && (
              <ReportExecutiveSummary
                positioning={v3.expansion_positioning}
                executiveSummary={v3.executive_summary}
              />
            )}

            {/* 2. Assessment Coverage */}
            <ReportCoverage v3={v3} onCompleteTopics={switchToAssessment} />

            {/* 3. Strengths */}
            {v3.strengths && v3.strengths.length > 0 && (
              <ReportStrengths strengths={v3.strengths} />
            )}

            {/* 4. Risks */}
            {v3.risks && v3.risks.length > 0 && (
              <ReportRisks risks={v3.risks} />
            )}

            {/* 5. Critical (conditional) */}
            {v3.critical_actions && v3.critical_actions.length > 0 && (
              <ReportCritical criticalActions={v3.critical_actions} />
            )}

            {/* 6. Needs Validation */}
            {v3.needs_validation && v3.needs_validation.length > 0 && (
              <ReportNeedsValidation items={v3.needs_validation} />
            )}

            {/* 7. 90-Day Roadmap */}
            {((v3.roadmap_phase1 && v3.roadmap_phase1.length > 0) || (v3.roadmap_phase2 && v3.roadmap_phase2.length > 0)) && v3.expansion_positioning && (
              <ReportRoadmap
                positioning={v3.expansion_positioning}
                phase1={v3.roadmap_phase1 || []}
                phase2={v3.roadmap_phase2 || []}
              />
            )}

            {/* 8. Export */}
            <ExportSection
              sessionId={session?.id || ''}
              email={session?.email || ''}
              keyStats={snapshot?.key_stats}
              readinessLevel={v3.readiness_level}
            />

            <footer className="pt-4 border-t border-[#E8E6E1] text-center">
              <p className="text-[11px] text-[#9B9A97]">
                Generated by Atlas Readiness Guide · Based on your self-reported information
              </p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
