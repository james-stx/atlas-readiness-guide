'use client';

import type { DomainType, SnapshotV3 } from '@atlas/types';

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

const CONFIDENCE_LABEL: Record<string, { label: string; color: string }> = {
  high:   { label: 'High',   color: '#0F7B6C' },
  medium: { label: 'Medium', color: '#9A6700' },
  low:    { label: 'Low',    color: '#E03E3E' },
};

interface ReportCoverageProps {
  v3: SnapshotV3;
  onCompleteTopics?: () => void;
}

export function ReportCoverage({ v3, onCompleteTopics }: ReportCoverageProps) {
  const domains: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];
  const reportConfidence = v3.coverage_percentage;
  const isComplete = reportConfidence >= 100;

  const confidenceColor =
    reportConfidence >= 90 ? '#0F7B6C' :
    reportConfidence >= 70 ? '#9A6700' :
    '#E03E3E';

  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9B9A97] mb-3">
        Assessment Coverage
      </p>

      <div className="bg-white rounded-lg border border-[#E8E6E1] overflow-hidden">
        {/* Domain table */}
        <div className="divide-y divide-[#F1F0EC]">
          {domains.map((domain) => {
            const dr = v3.domains[domain];
            const uncovered = dr.topics_total - dr.topics_covered;
            const cfgLabel = CONFIDENCE_LABEL[dr.confidence_level];

            return (
              <div key={domain} className="flex items-center gap-4 px-4 py-2.5">
                <span className="w-28 text-[13px] text-[#37352F] shrink-0">
                  {DOMAIN_LABELS[domain]}
                </span>

                {/* Dot indicators */}
                <div className="flex gap-0.5">
                  {Array.from({ length: dr.topics_total }).map((_, i) => (
                    <span
                      key={i}
                      className="text-[10px]"
                      style={{ color: i < dr.topics_covered ? cfgLabel.color : '#D4D1CB' }}
                    >
                      {i < dr.topics_covered ? '●' : '○'}
                    </span>
                  ))}
                </div>

                <span className="text-[12px] text-[#9B9A97] tabular-nums w-8">
                  {dr.topics_covered}/{dr.topics_total}
                </span>

                <span
                  className="text-[11px] font-medium w-14"
                  style={{ color: cfgLabel.color }}
                >
                  {cfgLabel.label}
                </span>

                {uncovered > 0 && (
                  <span className="text-[11px] text-[#9B9A97]">
                    · {uncovered} topic{uncovered > 1 ? 's' : ''} uncovered
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-[#E8E6E1] mx-4" />

        {/* Report Confidence */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#37352F]">
              Report Confidence
            </span>
            <span
              className="text-[13px] font-semibold tabular-nums"
              style={{ color: confidenceColor }}
            >
              {reportConfidence}%
            </span>
          </div>

          {/* Confidence bar */}
          <div className="h-1.5 bg-[#E8E6E1] rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${reportConfidence}%`, backgroundColor: confidenceColor }}
            />
          </div>

          <p className="text-[12px] text-[#787671] leading-relaxed">
            Report confidence measures how much of your assessment Atlas has to work with —
            not how ready you are. A higher score means more complete and specific inputs,
            making every section of this report more reliable.
          </p>

          {!isComplete && (
            <div className="mt-3 p-3 bg-[#F7F6F3] rounded-md">
              <p className="text-[12px] text-[#5C5A56] leading-relaxed mb-2">
                Covering the remaining {v3.topics_total - v3.topics_covered} topic
                {v3.topics_total - v3.topics_covered > 1 ? 's' : ''} would bring report
                confidence to 100% and may surface additional insights in Risks and
                Needs Validation.
              </p>
              {onCompleteTopics && (
                <button
                  onClick={onCompleteTopics}
                  className="text-[12px] font-medium text-[#2383E2] hover:text-[#1A6DC0] transition-colors"
                >
                  Complete remaining topics →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
