'use client';

import { cn } from '@/lib/utils';
import type { NextStep } from '@atlas/types';
import { ArrowRight } from 'lucide-react';

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
    <div className={cn('bg-white rounded-xl border border-neutral-200 p-6', className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-neutral-900" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Recommended Next Steps</h3>
          <p className="text-sm text-neutral-500">Prioritized actions to improve your readiness</p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedSteps.map((step) => (
          <div key={step.priority} className="flex gap-4">
            {/* Priority number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold text-sm">
              {step.priority}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-medium text-neutral-800">
                  {step.action}
                </p>
                <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
                  {DOMAIN_LABELS[step.domain]}
                </span>
              </div>
              <p className="text-sm text-neutral-500">{step.rationale}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
