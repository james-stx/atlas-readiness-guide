'use client';

import { cn } from '@/lib/utils';
import type { Strength } from '@atlas/types';

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
  // Guard against undefined array
  const safeStrengths = strengths || [];

  // Group by domain
  const groupedStrengths = safeStrengths.reduce((acc, strength) => {
    if (!acc[strength.domain]) {
      acc[strength.domain] = [];
    }
    acc[strength.domain].push(strength);
    return acc;
  }, {} as Record<string, Strength[]>);

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#0F7B6C] mb-1">
        Strengths
      </h3>
      <p className="text-[12px] text-[#9B9A97] mb-4">What you know with confidence</p>

      {Object.keys(groupedStrengths).length === 0 ? (
        <p className="text-[13px] text-[#9B9A97] italic">No high-confidence strengths identified.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedStrengths).map(([domain, domainStrengths]) => (
            <div key={domain}>
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#0F7B6C] mb-2">
                {DOMAIN_LABELS[domain]}
              </h4>
              <ul className="space-y-2">
                {domainStrengths.map((strength, index) => (
                  <li
                    key={index}
                    className="pl-4 border-l-2 border-[#0F7B6C]"
                  >
                    <p className="text-[14px] text-[#37352F] font-medium">
                      {strength.item}
                    </p>
                    <p className="text-[12px] text-[#9B9A97] mt-0.5">
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
