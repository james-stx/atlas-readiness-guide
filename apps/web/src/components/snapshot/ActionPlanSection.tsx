'use client';

import { cn } from '@/lib/utils';
import type { NextStep, DomainType } from '@atlas/types';

interface ActionPlanSectionProps {
  steps: NextStep[];
  className?: string;
}

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

const WEEK_LABELS: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Week 1: Foundation', subtitle: 'Unblock critical dependencies' },
  2: { title: 'Week 2: Validation', subtitle: 'Test assumptions and fill gaps' },
  3: { title: 'Weeks 3-4: Execution Prep', subtitle: 'Prepare for launch' },
  4: { title: 'Weeks 3-4: Execution Prep', subtitle: 'Prepare for launch' },
};

export function ActionPlanSection({ steps, className }: ActionPlanSectionProps) {
  // Sort by priority
  const sortedSteps = [...steps].sort((a, b) => a.priority - b.priority);

  // Group by week (default to week based on priority if not specified)
  const stepsByWeek = sortedSteps.reduce((acc, step) => {
    // Determine week: use step.week if available, otherwise derive from priority
    let week = step.week;
    if (!week) {
      if (step.priority <= 2) week = 1;
      else if (step.priority <= 4) week = 2;
      else week = 3;
    }
    // Combine weeks 3 and 4 into one group
    const weekKey = week >= 3 ? 3 : week;

    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(step);
    return acc;
  }, {} as Record<number, NextStep[]>);

  const weeks = Object.keys(stepsByWeek).map(Number).sort();

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#2383E2] mb-1">
        Your 30-Day Action Plan
      </h3>
      <p className="text-[12px] text-[#9B9A97] mb-6">
        Prioritized actions to improve your readiness
      </p>

      <div className="space-y-6">
        {weeks.map((week) => {
          const weekConfig = WEEK_LABELS[week];
          const weekSteps = stepsByWeek[week];

          return (
            <div key={week}>
              <div className="mb-3">
                <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97]">
                  {weekConfig.title}
                </h4>
                <div className="border-t border-[#E8E6E1] mt-1" />
              </div>

              <div className="space-y-3">
                {weekSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-4"
                  >
                    {/* Checkbox */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-5 h-5 rounded border-2 border-[#E8E6E1] flex items-center justify-center">
                        {/* Empty checkbox - visual only */}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-[14px] font-medium text-[#37352F]">
                          {step.action}
                        </p>
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium flex-shrink-0 bg-[#DDEBF1] text-[#2383E2]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2383E2]" />
                          {DOMAIN_LABELS[step.domain]}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#9B9A97]">
                        {step.rationale}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
