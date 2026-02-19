'use client';

import { useWorkspace } from '@/lib/context/workspace-context';

export function SidebarFooter() {
  const { progressState } = useWorkspace();
  const progress = progressState.overallProgress;

  return (
    <div
      className="px-3 py-3 border-t border-[#EBEBEA]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}
    >
      {/* Progress section */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-[#9B9A97]">
            Overall Progress
          </span>
          <span className="text-[12px] text-[#9B9A97] tabular-nums">
            {progress}%
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-[3px] w-full rounded-full bg-[#E8E6E1] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2383E2] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
