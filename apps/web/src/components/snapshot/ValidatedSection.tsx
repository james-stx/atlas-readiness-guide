'use client';

import { cn } from '@/lib/utils';
import type { Strength, DomainType } from '@atlas/types';

interface ValidatedSectionProps {
  strengths: Strength[];
  className?: string;
}

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

export function ValidatedSection({ strengths, className }: ValidatedSectionProps) {
  // Group by domain
  const groupedStrengths = strengths.reduce((acc, strength) => {
    if (!acc[strength.domain]) {
      acc[strength.domain] = [];
    }
    acc[strength.domain].push(strength);
    return acc;
  }, {} as Record<DomainType, Strength[]>);

  const domains = Object.keys(groupedStrengths) as DomainType[];

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#0F7B6C] mb-1">
        What You&apos;ve Validated
      </h3>
      <p className="text-[12px] text-[#9B9A97] mb-6">
        Areas where you have high-confidence data
      </p>

      {domains.length === 0 ? (
        <div className="border border-dashed border-[#E8E6E1] rounded-lg p-8 text-center">
          <p className="text-[14px] text-[#9B9A97] mb-2">
            No high-confidence inputs yet
          </p>
          <p className="text-[13px] text-[#9B9A97]">
            Continue your assessment to build validated insights
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {domains.map((domain) => (
            <div key={domain}>
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#0F7B6C] mb-3">
                {DOMAIN_LABELS[domain]}
              </h4>
              <div className="space-y-3">
                {groupedStrengths[domain].map((strength, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-[#0F7B6C] pl-4"
                  >
                    <p className="text-[14px] font-medium text-[#37352F] mb-1">
                      {strength.item}
                    </p>
                    <p className="text-[13px] text-[#5C5A56] mb-2">
                      {strength.evidence}
                    </p>
                    {strength.user_quote && (
                      <div className="bg-[#FAF9F7] rounded-lg p-3 mt-2">
                        <p className="text-[13px] text-[#787671] italic">
                          &ldquo;{strength.user_quote}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
