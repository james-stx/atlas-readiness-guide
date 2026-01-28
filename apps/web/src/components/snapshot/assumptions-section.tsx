'use client';

import { cn } from '@/lib/utils';
import type { Assumption } from '@atlas/types';
import { AlertTriangle } from 'lucide-react';

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
  return (
    <div className={cn('bg-white rounded-xl border border-neutral-200 p-6', className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-warm-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Assumptions to Validate</h3>
          <p className="text-sm text-neutral-500">Areas that need verification before major investment</p>
        </div>
      </div>

      {assumptions.length === 0 ? (
        <p className="text-sm text-neutral-500 italic">No assumptions requiring validation.</p>
      ) : (
        <div className="space-y-4">
          {assumptions.map((assumption, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-warm-50 border-l-4 border-warm-400"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-medium text-neutral-800">
                  {assumption.item}
                </p>
                <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-warm-100 text-warm-700">
                  {DOMAIN_LABELS[assumption.domain]}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-neutral-500">Risk: </span>
                  <span className="text-neutral-700">{assumption.risk}</span>
                </div>
                <div>
                  <span className="text-neutral-500">To validate: </span>
                  <span className="text-warm-700 font-medium">
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
