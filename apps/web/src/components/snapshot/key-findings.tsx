'use client';

import { cn } from '@/lib/utils';
import type { KeyFinding, ConfidenceLevel } from '@atlas/types';
import { Lightbulb } from 'lucide-react';

interface KeyFindingsProps {
  findings: KeyFinding[];
  className?: string;
}

const CONFIDENCE_STYLES: Record<ConfidenceLevel, { bg: string; text: string }> = {
  high: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  medium: { bg: 'bg-orange-100', text: 'text-orange-700' },
  low: { bg: 'bg-slate-100', text: 'text-slate-600' },
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
    <div className={cn('bg-white rounded-xl border border-slate-200 p-6', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-slate-900">Key Findings</h3>
      </div>

      <div className="space-y-3">
        {findings.map((finding, index) => {
          const styles = CONFIDENCE_STYLES[finding.confidence];

          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50"
            >
              <span
                className={cn(
                  'flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium',
                  styles.bg,
                  styles.text
                )}
              >
                {DOMAIN_LABELS[finding.domain]}
              </span>
              <p className="text-sm text-slate-700 flex-1">{finding.finding}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
