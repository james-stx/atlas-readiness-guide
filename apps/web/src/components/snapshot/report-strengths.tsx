'use client';

import type { StrengthItem, DomainType } from '@atlas/types';

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

interface ReportStrengthsProps {
  strengths: StrengthItem[];
}

export function ReportStrengths({ strengths }: ReportStrengthsProps) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9B9A97] mb-3">
        Strengths
      </p>

      <div className="space-y-2">
        {strengths.map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#E8E6E1] overflow-hidden">
            {/* Source tag row */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#DBEDDB] text-[#0F7B6C]">
                {DOMAIN_LABELS[s.source_domain]}
              </span>
              <span className="text-[11px] text-[#9B9A97]">·</span>
              <span className="text-[11px] text-[#787671]">{s.source_topic}</span>
              <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#DBEDDB] text-[#0F7B6C]">
                ★ High
              </span>
            </div>

            <div className="px-4 pb-4">
              <p className="text-[13px] font-semibold text-[#37352F] mb-1">{s.title}</p>
              <p className="text-[13px] leading-relaxed text-[#5C5A56]">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
