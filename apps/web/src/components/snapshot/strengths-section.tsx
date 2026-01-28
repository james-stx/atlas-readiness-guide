'use client';

import { cn } from '@/lib/utils';
import type { Strength } from '@atlas/types';
import { CheckCircle } from 'lucide-react';

interface StrengthsSectionProps {
  strengths: Strength[];
  className?: string;
}

const DOMAIN_LABELS: Record<string, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

export function StrengthsSection({ strengths, className }: StrengthsSectionProps) {
  // Group by domain
  const groupedStrengths = strengths.reduce((acc, strength) => {
    if (!acc[strength.domain]) {
      acc[strength.domain] = [];
    }
    acc[strength.domain].push(strength);
    return acc;
  }, {} as Record<string, Strength[]>);

  return (
    <div className={cn('bg-white rounded-xl border border-neutral-200 p-6', className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-accent-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Strengths</h3>
          <p className="text-sm text-neutral-500">What you know with confidence</p>
        </div>
      </div>

      {Object.keys(groupedStrengths).length === 0 ? (
        <p className="text-sm text-neutral-500 italic">No high-confidence strengths identified.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedStrengths).map(([domain, domainStrengths]) => (
            <div key={domain}>
              <h4 className="text-sm font-medium text-accent-700 mb-2">
                {DOMAIN_LABELS[domain]}
              </h4>
              <ul className="space-y-2">
                {domainStrengths.map((strength, index) => (
                  <li
                    key={index}
                    className="pl-4 border-l-2 border-accent-300"
                  >
                    <p className="text-sm text-neutral-800 font-medium">
                      {strength.item}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {strength.evidence}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
