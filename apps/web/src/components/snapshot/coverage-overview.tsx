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
    <div className={cn('bg-white rounded-xl border border-slate-200 p-6', className)}>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Coverage Overview</h3>

      <div className="grid grid-cols-5 gap-4">
        {DOMAINS.map(({ key, label }) => {
          const domainCoverage = coverage[key];
          const total =
            domainCoverage.high_confidence +
            domainCoverage.medium_confidence +
            domainCoverage.low_confidence;

          return (
            <div key={key} className="text-center">
              <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>

              {/* Confidence dots */}
              <div className="flex justify-center gap-1 mb-2">
                {renderDots(domainCoverage)}
              </div>

              {/* Count */}
              <p className="text-xs text-slate-500">
                {domainCoverage.questions_answered} inputs
              </p>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className="text-xs text-slate-600">High Confidence</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-400" />
          <span className="text-xs text-slate-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-300" />
          <span className="text-xs text-slate-600">Low/Missing</span>
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
          className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300"
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
      <div key={`h${i}`} className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
    );
  }
  for (let i = 0; i < mediumDots; i++) {
    dots.push(
      <div key={`m${i}`} className="w-2.5 h-2.5 rounded-full bg-orange-400" />
    );
  }
  for (let i = 0; i < lowDots; i++) {
    dots.push(
      <div key={`l${i}`} className="w-2.5 h-2.5 rounded-full bg-slate-300" />
    );
  }

  return dots;
}
