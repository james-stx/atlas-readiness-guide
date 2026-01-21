'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAssessment } from '@/lib/context/assessment-context';
import { getSnapshot } from '@/lib/api-client';
import { CoverageOverview } from '@/components/snapshot/coverage-overview';
import { KeyFindings } from '@/components/snapshot/key-findings';
import { StrengthsSection } from '@/components/snapshot/strengths-section';
import { AssumptionsSection } from '@/components/snapshot/assumptions-section';
import { GapsSection } from '@/components/snapshot/gaps-section';
import { NextStepsSection } from '@/components/snapshot/next-steps-section';
import { ExportSection } from '@/components/snapshot/export-section';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {isGenerating ? 'Generating Your Snapshot...' : 'Loading...'}
            </h1>
            {isGenerating && (
              <p className="text-slate-600">
                Analyzing your responses and synthesizing insights
              </p>
            )}
          </div>

          {/* Skeleton loading state */}
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/chat" className="text-primary hover:underline">
            Return to assessment
          </Link>
        </div>
      </div>
    );
  }

  // No snapshot yet
  if (!snapshot) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No snapshot available yet.</p>
          <Link href="/chat" className="text-primary hover:underline">
            Complete your assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/chat"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Chat</span>
          </Link>
          <div className="text-sm text-slate-500">
            {session.email}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Your Readiness Snapshot
          </h1>
          <p className="text-slate-600">
            A summary of what you know vs. what you&apos;re assuming about U.S. expansion
          </p>
        </div>

        {/* Snapshot sections */}
        <div className="space-y-6">
          {/* Coverage Overview */}
          <CoverageOverview coverage={snapshot.coverage_summary} />

          {/* Key Findings */}
          <KeyFindings findings={snapshot.key_findings} />

          {/* Two-column layout for Strengths and Assumptions */}
          <div className="grid md:grid-cols-2 gap-6">
            <StrengthsSection strengths={snapshot.strengths} />
            <AssumptionsSection assumptions={snapshot.assumptions} />
          </div>

          {/* Gaps */}
          <GapsSection gaps={snapshot.gaps} />

          {/* Next Steps */}
          <NextStepsSection steps={snapshot.next_steps} />

          {/* Export */}
          <ExportSection sessionId={session.id} email={session.email} />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">
            Generated by Atlas Readiness Guide | This snapshot reflects your self-reported information.
            <br />
            It is not a score or recommendation to expand.
          </p>
        </footer>
      </main>
    </div>
  );
}
