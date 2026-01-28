'use client';

import { cn } from '@/lib/utils';
import type { Gap, GapImportance } from '@atlas/types';
import { CircleAlert } from 'lucide-react';

interface GapsSectionProps {
  gaps: Gap[];
  className?: string;
}

const DOMAIN_LABELS: Record<string, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

const IMPORTANCE_STYLES: Record<GapImportance, { bg: string; border: string; badge: string }> = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    badge: 'bg-red-100 text-red-700',
  },
  important: {
    bg: 'bg-warm-50',
    border: 'border-warm-400',
    badge: 'bg-warm-100 text-warm-700',
  },
  'nice-to-have': {
    bg: 'bg-neutral-50',
    border: 'border-neutral-300',
    badge: 'bg-neutral-100 text-neutral-600',
  },
};

export function GapsSection({ gaps, className }: GapsSectionProps) {
  // Sort by importance
  const sortedGaps = [...gaps].sort((a, b) => {
    const order: Record<GapImportance, number> = {
      critical: 0,
      important: 1,
      'nice-to-have': 2,
    };
    return order[a.importance] - order[b.importance];
  });

  return (
    <div className={cn('bg-white rounded-xl border border-neutral-200 p-6', className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
          <CircleAlert className="w-4 h-4 text-neutral-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Gaps to Address</h3>
          <p className="text-sm text-neutral-500">Information you need but don&apos;t have yet</p>
        </div>
      </div>

      {sortedGaps.length === 0 ? (
        <p className="text-sm text-neutral-500 italic">No significant gaps identified.</p>
      ) : (
        <div className="space-y-3">
          {sortedGaps.map((gap, index) => {
            const styles = IMPORTANCE_STYLES[gap.importance];

            return (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-lg border-l-4',
                  styles.bg,
                  styles.border
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium uppercase',
                        styles.badge
                      )}
                    >
                      {gap.importance}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {DOMAIN_LABELS[gap.domain]}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-neutral-800 mb-1">
                  {gap.item}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="text-neutral-500">Recommendation: </span>
                  {gap.recommendation}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
