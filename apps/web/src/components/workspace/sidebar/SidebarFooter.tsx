'use client';

import { useWorkspace } from '@/lib/context/workspace-context';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/context/assessment-context';

export function SidebarFooter() {
  const router = useRouter();
  const { progressState } = useWorkspace();
  const { generateSnapshot, isLoading, error } = useAssessment();

  const progress = progressState.overallProgress;
  const isDisabled = progress < 20;

  const handleSnapshot = async () => {
    if (isDisabled) return;
    try {
      console.log('[Atlas] Starting snapshot generation...');
      await generateSnapshot();
      console.log('[Atlas] Snapshot generated, navigating...');
      router.push('/snapshot');
    } catch (err) {
      console.error('[Atlas] Snapshot generation failed:', err);
      // Error also handled by assessment context which will show it in UI
    }
  };

  return (
    <div
      className="px-3 py-3 border-t border-[#EBEBEA]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}
    >
      {/* Progress section */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-[#9B9B9B]">
            Overall Progress
          </span>
          <span className="text-[12px] text-[#9B9B9B] tabular-nums">
            {progress}%
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-[3px] w-full rounded-full bg-[#E8E7E4] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2383E2] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-2 p-2 rounded-[3px] bg-red-50 border border-red-200">
          <p className="text-[11px] text-red-600 leading-tight">{error}</p>
        </div>
      )}

      {/* Snapshot button - only show when there's enough progress */}
      {progress >= 20 && (
        <button
          onClick={handleSnapshot}
          disabled={isLoading}
          className="w-full h-[28px] rounded-[3px] bg-[#2383E2] text-[13px] font-medium text-white transition-colors hover:bg-[#1A6DC0] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Snapshot'}
        </button>
      )}
    </div>
  );
}
