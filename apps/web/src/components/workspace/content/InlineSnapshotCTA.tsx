'use client';

import { useWorkspace } from '@/lib/context/workspace-context';
import { FileText } from 'lucide-react';

interface InlineSnapshotCTAProps {
  domainLabel: string;
  covered: number;
  total: number;
}

export function InlineSnapshotCTA({ domainLabel, covered, total }: InlineSnapshotCTAProps) {
  const { switchToReport } = useWorkspace();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between rounded-lg border border-[#E8E6E1] bg-[#FAF9F7] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8E6E1]">
            <FileText className="h-4 w-4 text-[#37352F]" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#37352F]">
              View your Readiness Report
            </p>
            <p className="mt-0.5 text-[13px] text-[#9B9A97]">
              {covered} of {total} topics covered in {domainLabel}.
            </p>
          </div>
        </div>
        <button
          onClick={switchToReport}
          className="rounded-md bg-[#37352F] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#2C2B28]"
        >
          View Report
        </button>
      </div>
    </div>
  );
}
