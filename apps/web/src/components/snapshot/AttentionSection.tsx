'use client';

import { cn } from '@/lib/utils';
import type { Gap, Assumption, GapImportance, DomainType } from '@atlas/types';

interface AttentionSectionProps {
  gaps: Gap[];
  assumptions: Assumption[];
  className?: string;
}

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

const IMPORTANCE_CONFIG: Record<GapImportance, {
  label: string;
  sublabel: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}> = {
  critical: {
    label: 'Critical Gaps',
    sublabel: 'Address before major investment',
    bgColor: 'bg-[#FBE4E4]',
    borderColor: 'border-[#E03E3E]',
    textColor: 'text-[#E03E3E]',
  },
  important: {
    label: 'Important',
    sublabel: 'Address within 60 days',
    bgColor: 'bg-[#FAEBDD]',
    borderColor: 'border-[#D9730D]',
    textColor: 'text-[#D9730D]',
  },
  'nice-to-have': {
    label: 'Nice to Have',
    sublabel: 'Address when possible',
    bgColor: 'bg-[#FAF9F7]',
    borderColor: 'border-[#9B9A97]',
    textColor: 'text-[#9B9A97]',
  },
};

export function AttentionSection({ gaps, assumptions, className }: AttentionSectionProps) {
  // Guard against undefined arrays
  const safeGaps = gaps || [];
  const safeAssumptions = assumptions || [];

  // Group gaps by importance
  const criticalGaps = safeGaps.filter(g => g.importance === 'critical');
  const importantGaps = safeGaps.filter(g => g.importance === 'important');
  const niceToHaveGaps = safeGaps.filter(g => g.importance === 'nice-to-have');

  const hasGaps = safeGaps.length > 0;
  const hasAssumptions = safeAssumptions.length > 0;

  if (!hasGaps && !hasAssumptions) {
    return (
      <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
        <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#E03E3E] mb-1">
          What Needs Attention
        </h3>
        <p className="text-[12px] text-[#9B9A97] mb-6">
          Gaps and assumptions that could impact your expansion
        </p>
        <div className="border border-dashed border-[#E8E6E1] rounded-lg p-8 text-center">
          <p className="text-[14px] text-[#0F7B6C]">
            No significant gaps or assumptions identified
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#E03E3E] mb-1">
        What Needs Attention
      </h3>
      <p className="text-[12px] text-[#9B9A97] mb-6">
        Gaps and assumptions that could impact your expansion
      </p>

      <div className="space-y-6">
        {/* Critical Gaps */}
        {criticalGaps.length > 0 && (
          <GapGroup gaps={criticalGaps} importance="critical" />
        )}

        {/* Important Gaps */}
        {importantGaps.length > 0 && (
          <GapGroup gaps={importantGaps} importance="important" />
        )}

        {/* Assumptions */}
        {hasAssumptions && (
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#D9730D] mb-1">
              Assumptions to Validate
            </h4>
            <p className="text-[12px] text-[#9B9A97] mb-3">
              Things you believe but haven&apos;t proven
            </p>
            <div className="space-y-3">
              {safeAssumptions.map((assumption, index) => (
                <div
                  key={index}
                  className="bg-white border border-[#E8E6E1] rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#D9730D]">◐</span>
                      <p className="text-[14px] font-medium text-[#37352F]">
                        {assumption.item}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#9B9A97] flex-shrink-0">
                      {DOMAIN_LABELS[assumption.domain]}
                    </span>
                  </div>

                  <div className="space-y-2 text-[13px] ml-6">
                    <p className="text-[#5C5A56]">
                      <span className="text-[#D9730D] font-medium">Risk: </span>
                      {assumption.risk}
                    </p>
                    <p className="text-[#5C5A56]">
                      <span className="text-[#9B9A97]">To validate: </span>
                      <span className="font-medium">{assumption.validation_suggestion}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nice-to-have Gaps (collapsed by default on small screens) */}
        {niceToHaveGaps.length > 0 && (
          <GapGroup gaps={niceToHaveGaps} importance="nice-to-have" />
        )}
      </div>
    </div>
  );
}

function GapGroup({ gaps, importance }: { gaps: Gap[]; importance: GapImportance }) {
  const config = IMPORTANCE_CONFIG[importance] || IMPORTANCE_CONFIG['nice-to-have'];

  return (
    <div>
      <h4 className={cn('text-[11px] font-medium uppercase tracking-wide mb-1', config.textColor)}>
        {config.label}
      </h4>
      <p className="text-[12px] text-[#9B9A97] mb-3">
        {config.sublabel}
      </p>
      <div className="space-y-3">
        {gaps.map((gap, index) => (
          <div
            key={index}
            className={cn(
              'rounded-lg p-4 border-l-[3px]',
              config.bgColor,
              config.borderColor
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-[14px] font-medium text-[#37352F]">
                {gap.item}
              </p>
              <span className="text-[11px] text-[#9B9A97] flex-shrink-0">
                {DOMAIN_LABELS[gap.domain]}
              </span>
            </div>

            <p className="text-[13px] text-[#5C5A56] mb-3">
              {gap.recommendation}
            </p>

            {(gap.research_action || gap.execution_action) && (
              <div className="border-t border-white/50 pt-3 space-y-2">
                {gap.research_action && (
                  <div className="text-[13px]">
                    <span className="text-[#9B9A97]">Research: </span>
                    <span className="text-[#5C5A56]">{gap.research_action}</span>
                  </div>
                )}
                {gap.execution_action && (
                  <div className="text-[13px]">
                    <span className="text-[#9B9A97]">Action: </span>
                    <span className={cn('font-medium', config.textColor)}>
                      {gap.execution_action}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
