'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAssessment } from '@/lib/context/assessment-context';
import { getSnapshot } from '@/lib/api-client';
import { ReadinessOverview } from '@/components/snapshot/ReadinessOverview';
import { ValidatedSection } from '@/components/snapshot/ValidatedSection';
import { AttentionSection } from '@/components/snapshot/AttentionSection';
import { ActionPlanSection } from '@/components/snapshot/ActionPlanSection';
import { ExportSection } from '@/components/snapshot/export-section';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2, Compass } from 'lucide-react';
import type { Snapshot } from '@atlas/types';

export default function SnapshotPage() {
  const router = useRouter();
  const { session, snapshot: contextSnapshot, generateSnapshot, isLoading } = useAssessment();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(contextSnapshot);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if no session
  useEffect(() => {
    if (!session) {
      router.push('/start');
    }
  }, [session, router]);

  // Load or generate snapshot
  useEffect(() => {
    async function loadSnapshot() {
      if (!session) return;

      // If we already have a snapshot in context, use it
      if (contextSnapshot) {
        setSnapshot(contextSnapshot);
        return;
      }

      // Try to fetch existing snapshot
      try {
        const { snapshot: existingSnapshot } = await getSnapshot(session.id);

        if (existingSnapshot) {
          setSnapshot(existingSnapshot);
          return;
        }

        // No snapshot exists, generate one
        setIsGenerating(true);
        await generateSnapshot();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load snapshot');
      } finally {
        setIsGenerating(false);
      }
    }

    loadSnapshot();
  }, [session, contextSnapshot, generateSnapshot]);

  // Update local snapshot when context changes
  useEffect(() => {
    if (contextSnapshot) {
      setSnapshot(contextSnapshot);
    }
  }, [contextSnapshot]);

  // Loading state
  if (!session || isGenerating || isLoading) {
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
          <Link href="/workspace" className="text-[#2383E2] hover:underline">
            Return to workspace
          </Link>
        </div>
      </div>
    );
  }

  // No snapshot yet
  if (!snapshot) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#5C5A56] mb-4">No report available yet.</p>
          <Link href="/workspace" className="text-[#2383E2] hover:underline">
            Complete your assessment in workspace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Header */}
      <header className="flex h-12 items-center justify-between border-b border-[#E8E6E1] bg-white px-4 sticky top-0 z-50">
        <Link
          href="/workspace"
          className="flex items-center gap-2 text-[#5C5A56] hover:text-[#37352F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[13px]">Back to Workspace</span>
        </Link>
        <div className="text-[13px] text-[#9B9A97]">
          {session.email}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[720px] mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#37352F] rounded-lg flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[24px] font-semibold text-[#37352F] mb-2">
            Your Readiness Report
          </h1>
          <p className="text-[14px] text-[#5C5A56]">
            Where you stand today and what to do next
          </p>
        </div>

        {/* Report sections */}
        <div className="space-y-6">
          {/* Section 1: Readiness Overview */}
          <ReadinessOverview
            readinessLevel={snapshot.readiness_level}
            verdictSummary={snapshot.verdict_summary}
            coverage={snapshot.coverage_summary}
            keyStats={snapshot.key_stats}
          />

          {/* Section 2: What You've Validated */}
          <ValidatedSection strengths={snapshot.strengths} />

          {/* Section 3: What Needs Attention */}
          <AttentionSection
            gaps={snapshot.gaps}
            assumptions={snapshot.assumptions}
          />

          {/* Section 4: 30-Day Action Plan */}
          <ActionPlanSection steps={snapshot.next_steps} />

          {/* Section 5: Share & Export */}
          <ExportSection
            sessionId={session.id}
            email={session.email}
            keyStats={snapshot.key_stats}
            readinessLevel={snapshot.readiness_level}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-[#E8E6E1] text-center">
          <p className="text-[11px] text-[#9B9A97]">
            Generated by Atlas Readiness Guide | Based on your self-reported information.
            <br />
            This report is a planning tool, not a recommendation to expand.
          </p>
        </footer>
      </main>
    </div>
  );
}
