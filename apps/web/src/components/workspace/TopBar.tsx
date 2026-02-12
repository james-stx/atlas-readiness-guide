'use client';

import { Compass, PanelRightOpen, PanelRightClose, MessageSquare } from 'lucide-react';
import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function TopBar() {
  const router = useRouter();
  const { progressState, toggleChat, isChatOpen } = useWorkspace();
  const { session } = useAssessment();
  const [showSnapshotCTA, setShowSnapshotCTA] = useState(false);

  const progress = progressState.overallProgress;

  // Show snapshot CTA when progress >= 40%
  useEffect(() => {
    if (progress >= 40 && !showSnapshotCTA) {
      setShowSnapshotCTA(true);
    }
  }, [progress, showSnapshotCTA]);

  return (
    <header className="flex h-12 items-center justify-between border-b border-[#E8E6E1] bg-white px-4 z-50">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#37352F]">
            <Compass className="h-4 w-4 text-white" />
          </div>
          <span className="text-[14px] font-semibold text-[#37352F]">Atlas</span>
        </div>
        <span className="hidden text-[#D4D1CB] sm:block">·</span>
        <span className="hidden max-w-[200px] truncate text-[13px] text-[#787671] sm:block">
          {session?.email ? 'My Assessment' : 'Readiness Assessment'}
        </span>
      </div>

      {/* Center: Progress */}
      <div className="hidden items-center gap-3 sm:flex">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-[120px] overflow-hidden rounded-full bg-[#E8E6E1]">
            <div
              className="h-full rounded-full bg-[#2383E2] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[12px] tabular-nums text-[#9B9A97]">
            {progress}%
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Snapshot CTA */}
        {showSnapshotCTA && (
          <button
            onClick={() => router.push('/snapshot')}
            className="rounded-lg border border-[#E8E6E1] bg-white px-3 py-1.5 text-[13px] font-medium text-[#37352F] transition-colors hover:bg-[#F7F6F3]"
          >
            Snapshot
          </button>
        )}

        {/* Chat toggle */}
        <button
          onClick={toggleChat}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors',
            isChatOpen
              ? 'text-[#9B9A97] hover:bg-[#F7F6F3] hover:text-[#5C5A56]'
              : 'bg-[#2383E2] text-white hover:bg-[#1A6DC0]'
          )}
          aria-label={isChatOpen ? 'Close chat panel' : 'Open chat panel'}
        >
          {isChatOpen ? (
            <>
              <PanelRightClose className="h-4 w-4" />
              <span className="hidden text-[13px] sm:inline">Close</span>
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4" />
              <span className="hidden text-[13px] font-medium sm:inline">Ask Atlas</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
