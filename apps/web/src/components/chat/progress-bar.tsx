'use client';

import { cn } from '@/lib/utils';
import type { DomainType } from '@atlas/types';

const DOMAINS: { key: DomainType; label: string }[] = [
  { key: 'market', label: 'Market' },
  { key: 'product', label: 'Product' },
  { key: 'gtm', label: 'GTM' },
  { key: 'operations', label: 'Ops' },
  { key: 'financials', label: 'Finance' },
];

interface ProgressBarProps {
  currentDomain: DomainType;
  className?: string;
}

export function ProgressBar({ currentDomain, className }: ProgressBarProps) {
  const currentIndex = DOMAINS.findIndex((d) => d.key === currentDomain);
  const progressPercent = ((currentIndex + 1) / DOMAINS.length) * 100;

  return (
    <div className={cn('bg-white border-b border-neutral-100', className)}>
      {/* Progress bar */}
      <div className="h-1 bg-neutral-100">
        <div
          className="h-full bg-accent-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Domain indicators */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {DOMAINS.map((domain, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;

            return (
              <div
                key={domain.key}
                className="flex flex-col items-center gap-1.5"
              >
                {/* Dot indicator */}
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all duration-300',
                    isCompleted && 'bg-accent-500',
                    isCurrent && 'bg-accent-500 ring-4 ring-accent-500/20 scale-110',
                    isPending && 'bg-neutral-200'
                  )}
                />
                {/* Label */}
                <span
                  className={cn(
                    'text-xs font-medium transition-colors',
                    isCompleted && 'text-accent-600',
                    isCurrent && 'text-neutral-900 font-semibold',
                    isPending && 'text-neutral-400'
                  )}
                >
                  {domain.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
