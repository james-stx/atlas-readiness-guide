'use client';

import { Compass, Settings, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBarMini } from '@/components/ui/progress-bar-mini';
import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function TopBar() {
  const router = useRouter();
  const { progressState, toggleChat, isChatOpen } = useWorkspace();
  const { session } = useAssessment();
  const [showSnapshotCTA, setShowSnapshotCTA] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const progress = progressState.overallProgress;

  // Show snapshot CTA when progress >= 40%
  useEffect(() => {
    if (progress >= 40 && !showSnapshotCTA) {
      setShowSnapshotCTA(true);
    }
  }, [progress, showSnapshotCTA]);

  return (
    <header className="flex h-12 items-center justify-between border-b border-[var(--border-primary)] bg-white px-4 z-50">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-600">
            <Compass className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-body font-semibold text-[var(--text-primary)]">Atlas</span>
        </div>
        <span className="hidden text-body-sm text-[var(--text-tertiary)] sm:block">|</span>
        <span className="hidden max-w-[200px] truncate text-body-sm text-[var(--text-secondary)] sm:block">
          {session?.email ? 'My Readiness Assessment' : 'Readiness Assessment'}
        </span>
      </div>

      {/* Right: Progress + Actions */}
      <div className="flex items-center gap-3">
        {/* Progress */}
        <div className="hidden items-center gap-2 sm:flex">
          <ProgressBarMini
            value={progress}
            width="120px"
            showLabel
          />
        </div>

        {/* Snapshot CTA */}
        {showSnapshotCTA && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/snapshot')}
            className={!hasAnimated ? 'animate-pulse-once' : ''}
            onAnimationEnd={() => setHasAnimated(true)}
          >
            Snapshot
          </Button>
        )}

        {/* Chat toggle */}
        <button
          onClick={toggleChat}
          className="hidden items-center justify-center rounded-md p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)] lg:flex"
          aria-label={isChatOpen ? 'Close chat panel' : 'Open chat panel'}
        >
          {isChatOpen ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelRightOpen className="h-4 w-4" />
          )}
        </button>

        {/* Settings */}
        <button
          className="flex items-center justify-center rounded-md p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)]"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
