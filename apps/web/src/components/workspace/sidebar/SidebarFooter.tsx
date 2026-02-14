'use client';

import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { FileText, RefreshCw } from 'lucide-react';

export function SidebarFooter() {
  const { progressState } = useWorkspace();
  const { generateSnapshot, isLoading, error } = useAssessment();

  const progress = progressState.overallProgress;

  const handleGenerateReport = async () => {
    try {
      console.log('[Atlas] Starting snapshot generation...');
      await generateSnapshot();
      console.log('[Atlas] Snapshot generated, navigating...');
      window.location.href = '/snapshot';
    } catch (err) {
      console.error('[Atlas] Snapshot generation failed:', err);
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

      {/* Report section */}
      <div className="space-y-2">
        {/* View Report - always visible, links to snapshot page which loads existing or shows generate option */}
        <a
          href="/snapshot"
          className="w-full h-[32px] rounded-[3px] bg-[#37352F] text-[13px] font-medium text-white transition-colors hover:bg-[#2F2E2B] flex items-center justify-center gap-2"
        >
          <FileText className="w-3.5 h-3.5" />
          View Report
        </a>

        {/* Regenerate button - only show if they have some progress */}
        {progress >= 20 && (
          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="w-full h-[28px] rounded-[3px] text-[12px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 border border-[#E8E6E1] bg-white text-[#5C5A56] hover:bg-[#F7F6F3] hover:border-[#D4D1CB]"
          >
            {isLoading ? (
              'Generating...'
            ) : (
              <>
                <RefreshCw className="w-3 h-3" />
                Update Report
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
