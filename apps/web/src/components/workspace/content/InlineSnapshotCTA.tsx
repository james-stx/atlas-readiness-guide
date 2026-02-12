'use client';

import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/context/assessment-context';
import { Sparkles } from 'lucide-react';

interface InlineSnapshotCTAProps {
  domainLabel: string;
  covered: number;
  total: number;
}

export function InlineSnapshotCTA({ domainLabel, covered, total }: InlineSnapshotCTAProps) {
  const router = useRouter();
  const { generateSnapshot, isLoading } = useAssessment();

  const handleSnapshot = async () => {
    try {
      await generateSnapshot();
      router.push('/snapshot');
    } catch {
      // Error handled by assessment context
    }
  };

  return (
    <div className="mt-6 flex items-center justify-between rounded-[4px] border border-[#E8E7E4] bg-[#FAFAFA] p-4">
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
        disabled={isLoading}
        className="rounded-[4px] bg-[#37352F] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#2C2B28] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Snapshot'}
      </button>
    </div>
  );
}
