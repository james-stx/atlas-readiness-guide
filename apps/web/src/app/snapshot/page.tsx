'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Redirect /snapshot to /workspace with report view
 * The readiness report is now integrated into the workspace
 */
export default function SnapshotPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to workspace - the report view will be shown via URL param or context
    router.replace('/workspace?view=report');
  }, [router]);

  return (
    <div className="flex h-dvh items-center justify-center bg-[#FAF9F7]">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#37352F]" />
        <p className="text-[14px] text-[#5C5A56]">
          Redirecting to workspace...
        </p>
      </div>
    </div>
  );
}
