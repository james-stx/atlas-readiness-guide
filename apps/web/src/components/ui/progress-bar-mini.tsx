'use client';

import { cn } from '@/lib/utils';

interface ProgressBarMiniProps {
  value: number;
  max?: number;
  width?: string;
  className?: string;
  showLabel?: boolean;
  labelFormat?: 'percent' | 'fraction';
  fractionParts?: { current: number; total: number };
}

export function ProgressBarMini({
  value,
  max = 100,
  width = '100px',
  className,
  showLabel = false,
  labelFormat = 'percent',
  fractionParts,
}: ProgressBarMiniProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="h-1.5 rounded-full bg-warm-200"
        style={{ width }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-slow ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-ws-caption text-warm-500 tabular-nums">
          {labelFormat === 'fraction' && fractionParts
            ? `${fractionParts.current}/${fractionParts.total}`
            : `${percent}%`}
        </span>
      )}
    </div>
  );
}
