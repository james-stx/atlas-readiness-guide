'use client';

import { cn } from '@/lib/utils';
import type { Gap, GapImportance } from '@atlas/types';

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

const IMPORTANCE_STYLES: Record<GapImportance, { bg: string; border: string; badge: string; badgeBg: string; dot: string }> = {
  critical: {
    bg: 'bg-[#FBE4E4]',
    border: 'border-[#E03E3E]',
    badge: 'text-[#E03E3E]',
    badgeBg: 'bg-white/60',
    dot: 'bg-[#E03E3E]',
  },
  important: {
    bg: 'bg-[#FAEBDD]',
    border: 'border-[#D9730D]',
    badge: 'text-[#D9730D]',
    badgeBg: 'bg-white/60',
    dot: 'bg-[#D9730D]',
  },
  'nice-to-have': {
    bg: 'bg-[#FAF9F7]',
    border: 'border-[#9B9A97]',
    badge: 'text-[#9B9A97]',
    badgeBg: 'bg-white/60',
    dot: 'bg-[#9B9A97]',
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
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#E03E3E] mb-1">
        Gaps to Address
      </h3>
      <p className="text-[12px] text-[#9B9A97] mb-4">Information you need but don&apos;t have yet</p>

      {sortedGaps.length === 0 ? (
        <p className="text-[13px] text-[#9B9A97] italic">No significant gaps identified.</p>
      ) : (
        <div className="space-y-3">
          {sortedGaps.map((gap, index) => {
            const styles = IMPORTANCE_STYLES[gap.importance];

            return (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-lg border-l-[3px]',
                  styles.bg,
                  styles.border
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase',
                        styles.badgeBg,
                        styles.badge
                      )}
                    >
                      <span className={cn('h-1.5 w-1.5 rounded-full', styles.dot)} />
                      {gap.importance}
                    </span>
                    <span className="text-[11px] text-[#9B9A97]">
                      {DOMAIN_LABELS[gap.domain]}
                    </span>
                  </div>
                </div>

                <p className="text-[14px] font-medium text-[#37352F] mb-1">
                  {gap.item}
                </p>
                <p className="text-[13px] text-[#5C5A56]">
                  <span className="text-[#9B9A97]">Recommendation: </span>
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
