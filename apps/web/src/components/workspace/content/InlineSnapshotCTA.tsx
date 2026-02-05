'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/context/assessment-context';

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
    <div className="mt-6 flex items-center justify-between rounded-xl border border-accent-600/15 bg-accent-50 px-5 py-4">
      <div>
        <p className="text-body font-medium text-[var(--text-primary)]">
          Ready for a snapshot?
        </p>
        <p className="mt-0.5 text-body-sm text-[var(--text-secondary)]">
          {covered} of {total} {domainLabel} topics covered.
        </p>
      </div>
      <Button
        variant="accent"
        size="default"
        onClick={handleSnapshot}
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Snapshot'}
      </Button>
    </div>
  );
}
