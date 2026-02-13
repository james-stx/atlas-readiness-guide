'use client';

import { cn } from '@/lib/utils';
import type { CoverageSummary, DomainType } from '@atlas/types';

interface CoverageOverviewProps {
  coverage: CoverageSummary;
  className?: string;
}

const DOMAINS: { key: DomainType; label: string }[] = [
  { key: 'market', label: 'Market' },
  { key: 'product', label: 'Product' },
  { key: 'gtm', label: 'GTM' },
  { key: 'operations', label: 'Operations' },
  { key: 'financials', label: 'Financials' },
];

export function CoverageOverview({ coverage, className }: CoverageOverviewProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-4">
        Coverage Overview
      </h3>

      <div className="grid grid-cols-5 gap-4">
        {DOMAINS.map(({ key, label }) => {
          const domainCoverage = coverage[key];

          return (
            <div key={key} className="text-center">
              <p className="text-[13px] font-medium text-[#37352F] mb-2">{label}</p>

              {/* Confidence dots */}
              <div className="flex justify-center gap-1 mb-2">
                {renderDots(domainCoverage)}
              </div>

              {/* Count */}
              <p className="text-[11px] text-[#9B9A97]">
                {domainCoverage.questions_answered} inputs
              </p>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-[#E8E6E1]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0F7B6C]" />
          <span className="text-[11px] text-[#5C5A56]">High Confidence</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D9730D]" />
          <span className="text-[11px] text-[#5C5A56]">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9B9A97]" />
          <span className="text-[11px] text-[#5C5A56]">Low/Missing</span>
        </div>
      </div>
    </div>
  );
}

function renderDots(coverage: {
  high_confidence: number;
  medium_confidence: number;
  low_confidence: number;
}) {
  const total = coverage.high_confidence + coverage.medium_confidence + coverage.low_confidence;
  const maxDots = 5;

  if (total === 0) {
    // No data - show empty dots
    return Array(maxDots)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-[#E8E6E1] border border-[#D4D1CB]"
        />
      ));
  }

  // Normalize to 5 dots
  const highDots = Math.round((coverage.high_confidence / total) * maxDots);
  const mediumDots = Math.round((coverage.medium_confidence / total) * maxDots);
  const lowDots = maxDots - highDots - mediumDots;

  const dots = [];

  for (let i = 0; i < highDots; i++) {
    dots.push(
      <div key={`h${i}`} className="w-2.5 h-2.5 rounded-full bg-[#0F7B6C]" />
    );
  }
  for (let i = 0; i < mediumDots; i++) {
    dots.push(
      <div key={`m${i}`} className="w-2.5 h-2.5 rounded-full bg-[#D9730D]" />
    );
  }
  for (let i = 0; i < lowDots; i++) {
    dots.push(
      <div key={`l${i}`} className="w-2.5 h-2.5 rounded-full bg-[#9B9A97]" />
    );
  }

  return dots;
}
