'use client';

import { cn } from '@/lib/utils';
import type { KeyFinding, ConfidenceLevel } from '@atlas/types';

interface KeyFindingsProps {
  findings: KeyFinding[];
  className?: string;
}

const CONFIDENCE_STYLES: Record<ConfidenceLevel, { bg: string; text: string; dot: string }> = {
  high: { bg: 'bg-[#DDEDEA]', text: 'text-[#0F7B6C]', dot: 'bg-[#0F7B6C]' },
  medium: { bg: 'bg-[#FAEBDD]', text: 'text-[#D9730D]', dot: 'bg-[#D9730D]' },
  low: { bg: 'bg-[#FAF9F7]', text: 'text-[#9B9A97]', dot: 'bg-[#9B9A97]' },
};

const DOMAIN_LABELS: Record<string, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

export function KeyFindings({ findings, className }: KeyFindingsProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-4">
        Key Findings
      </h3>

      <div className="space-y-3">
        {findings.map((finding, index) => {
          const styles = CONFIDENCE_STYLES[finding.confidence];

          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-[#FAF9F7]"
            >
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium flex-shrink-0',
                  styles.bg,
                  styles.text
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', styles.dot)} />
                {DOMAIN_LABELS[finding.domain]}
              </span>
              <p className="text-[14px] text-[#37352F] flex-1">{finding.finding}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
