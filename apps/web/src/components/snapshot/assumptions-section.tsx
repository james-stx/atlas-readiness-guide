'use client';

import { cn } from '@/lib/utils';
import type { Assumption } from '@atlas/types';

interface AssumptionsSectionProps {
  assumptions: Assumption[];
  className?: string;
}

const DOMAIN_LABELS: Record<string, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

export function AssumptionsSection({ assumptions, className }: AssumptionsSectionProps) {
  // Guard against undefined array
  const safeAssumptions = assumptions || [];

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#D9730D] mb-1">
        Assumptions to Validate
      </h3>
      <p className="text-[12px] text-[#9B9A97] mb-4">Areas that need verification before major investment</p>

      {safeAssumptions.length === 0 ? (
        <p className="text-[13px] text-[#9B9A97] italic">No assumptions requiring validation.</p>
      ) : (
        <div className="space-y-4">
          {safeAssumptions.map((assumption, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-[#FAEBDD] border-l-[3px] border-[#D9730D]"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-[14px] font-medium text-[#37352F]">
                  {assumption.item}
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium flex-shrink-0 bg-white/60 text-[#D9730D]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D9730D]" />
                  {DOMAIN_LABELS[assumption.domain]}
                </span>
              </div>

              <div className="space-y-2 text-[13px]">
                <div>
                  <span className="text-[#9B9A97]">Risk: </span>
                  <span className="text-[#5C5A56]">{assumption.risk}</span>
                </div>
                <div>
                  <span className="text-[#9B9A97]">To validate: </span>
                  <span className="text-[#D9730D] font-medium">
                    {assumption.validation_suggestion}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
