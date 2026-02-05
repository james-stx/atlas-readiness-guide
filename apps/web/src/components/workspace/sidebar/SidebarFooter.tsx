'use client';

import { Button } from '@/components/ui/button';
import { ProgressBarMini } from '@/components/ui/progress-bar-mini';
import { useWorkspace } from '@/lib/context/workspace-context';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/context/assessment-context';

export function SidebarFooter() {
  const router = useRouter();
  const { progressState } = useWorkspace();
  const { generateSnapshot, isLoading } = useAssessment();

  const progress = progressState.overallProgress;
  const isDisabled = progress < 20;
  const buttonLabel = progress >= 40 ? 'Generate Snapshot' : 'Keep Going...';

  const handleSnapshot = async () => {
    if (isDisabled) return;
    try {
      await generateSnapshot();
      router.push('/snapshot');
    } catch {
      // Error handled by assessment context
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
      {/* Progress */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-caption text-[var(--text-secondary)]">
            Overall Progress
          </span>
          <span className="text-caption tabular-nums text-[var(--text-secondary)]">
            {progress}%
          </span>
        </div>
        <ProgressBarMini value={progress} width="100%" />
      </div>

      {/* Snapshot button */}
      <Button
        variant="accent"
        size="default"
        className="w-full"
        disabled={isDisabled || isLoading}
        onClick={handleSnapshot}
      >
        {isLoading ? 'Generating...' : buttonLabel}
      </Button>
    </div>
  );
}
