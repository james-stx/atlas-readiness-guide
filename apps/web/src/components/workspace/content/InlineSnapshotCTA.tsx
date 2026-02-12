'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/context/assessment-context';
import { Sparkles, AlertCircle } from 'lucide-react';

interface InlineSnapshotCTAProps {
  domainLabel: string;
  covered: number;
  total: number;
}

export function InlineSnapshotCTA({ domainLabel, covered, total }: InlineSnapshotCTAProps) {
  const router = useRouter();
  const { generateSnapshot, isLoading, error } = useAssessment();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSnapshot = async () => {
    setLocalError(null);
    setIsGenerating(true);
    console.log('[Atlas] Starting snapshot generation...');

    try {
      await generateSnapshot();
      console.log('[Atlas] Snapshot generated, navigating to /snapshot');
      router.push('/snapshot');
    } catch (err) {
      console.error('[Atlas] Snapshot generation failed:', err);
      setLocalError(err instanceof Error ? err.message : 'Failed to generate snapshot. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const displayError = localError || error;
  const buttonDisabled = isLoading || isGenerating;

  return (
    <div className="mt-6 space-y-3">
      {/* Error message */}
      {displayError && (
        <div className="flex items-start gap-2 rounded-[4px] border border-red-200 bg-red-50 p-3">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[13px] text-red-700">{displayError}</p>
        </div>
      )}

      <div className="flex items-center justify-between rounded-[4px] border border-[#E8E7E4] bg-[#FAFAFA] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#E8E7E4]">
            <Sparkles className="h-4 w-4 text-[#37352F]" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#37352F]">
              Ready for a snapshot?
            </p>
            <p className="mt-0.5 text-[13px] text-[#9B9B9B]">
              {covered} of {total} topics covered in {domainLabel}.
            </p>
          </div>
        </div>
        <button
          onClick={handleSnapshot}
          disabled={buttonDisabled}
          className="rounded-[4px] bg-[#37352F] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#2C2B28] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate Snapshot'}
        </button>
      </div>
    </div>
  );
}
