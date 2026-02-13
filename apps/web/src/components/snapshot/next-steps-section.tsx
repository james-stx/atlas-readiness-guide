'use client';

import { cn } from '@/lib/utils';
import type { NextStep } from '@atlas/types';

interface NextStepsSectionProps {
  steps: NextStep[];
  className?: string;
}

const DOMAIN_LABELS: Record<string, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

export function NextStepsSection({ steps, className }: NextStepsSectionProps) {
  // Sort by priority
  const sortedSteps = [...steps].sort((a, b) => a.priority - b.priority);

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#2383E2] mb-1">
        Recommended Next Steps
      </h3>
      <p className="text-[12px] text-[#9B9A97] mb-4">Prioritized actions to improve your readiness</p>

      <div className="space-y-4">
        {sortedSteps.map((step) => (
          <div key={step.priority} className="flex gap-4">
            {/* Priority number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2383E2] text-white flex items-center justify-center font-semibold text-[13px]">
              {step.priority}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-[14px] font-medium text-[#37352F]">
                  {step.action}
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium flex-shrink-0 bg-[#E8F4FD] text-[#2383E2]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2383E2]" />
                  {DOMAIN_LABELS[step.domain]}
                </span>
              </div>
              <p className="text-[13px] text-[#9B9A97]">{step.rationale}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
