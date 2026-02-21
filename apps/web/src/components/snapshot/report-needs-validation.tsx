'use client';

import type { NeedsValidationItem, DomainType } from '@atlas/types';

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

interface ReportNeedsValidationProps {
  items: NeedsValidationItem[];
}

export function ReportNeedsValidation({ items }: ReportNeedsValidationProps) {
  if (!items || items.length === 0) return null;

  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9B9A97] mb-1">
        Needs Validation
      </p>
      <p className="text-[12px] text-[#9B9A97] mb-3">
        Assumptions you've made that need to be tested before they can be treated as fact in your plan.
      </p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#E8E6E1] overflow-hidden">
            {/* Source tag row */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#F7F6F3] text-[#5C5A56] border border-[#E8E6E1]">
                {DOMAIN_LABELS[item.source_domain]}
              </span>
              <span className="text-[11px] text-[#9B9A97]">·</span>
              <span className="text-[11px] text-[#787671]">{item.source_topic}</span>
            </div>

            <div className="px-4 pb-4">
              <p className="text-[13px] font-semibold text-[#37352F] mb-1">{item.title}</p>
              <p className="text-[13px] leading-relaxed text-[#5C5A56] mb-3">{item.description}</p>
              <div className="flex items-start gap-2 bg-[#F7F6F3] rounded-md px-3 py-2">
                <span className="text-[12px] font-medium text-[#787671] shrink-0">→</span>
                <p className="text-[12px] text-[#5C5A56]">{item.validation_step}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
