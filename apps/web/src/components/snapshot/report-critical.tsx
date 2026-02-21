'use client';

import type { CriticalAction, DomainType } from '@atlas/types';
import { XCircle } from 'lucide-react';

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

interface ReportCriticalProps {
  criticalActions: CriticalAction[];
}

export function ReportCritical({ criticalActions }: ReportCriticalProps) {
  if (!criticalActions || criticalActions.length === 0) return null;

  const sorted = [...criticalActions].sort((a, b) => a.priority - b.priority);

  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9B9A97] mb-1">
        Critical
      </p>
      <p className="text-[12px] text-[#9B9A97] mb-3">
        These must be resolved before committing capital.
      </p>

      <div className="space-y-2">
        {sorted.map((ca, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-[#F5C6C6] overflow-hidden"
          >
            {/* Source tag row */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFE2DD] text-[#E03E3E]">
                {DOMAIN_LABELS[ca.source_domain]}
              </span>
              <span className="text-[11px] text-[#9B9A97]">·</span>
              <span className="text-[11px] text-[#787671]">{ca.source_topic}</span>
              <span className="ml-auto text-[11px] font-medium text-[#9B9A97]">
                #{i + 1}
              </span>
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-start gap-2">
                <XCircle className="h-3.5 w-3.5 text-[#E03E3E] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-[#37352F] mb-1">{ca.title}</p>
                  <p className="text-[13px] leading-relaxed text-[#5C5A56] mb-2">{ca.description}</p>
                  {ca.action && (
                    <p className="text-[12px] text-[#E03E3E]">
                      → {ca.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
