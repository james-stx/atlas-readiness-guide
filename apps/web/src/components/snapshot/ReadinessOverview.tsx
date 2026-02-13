'use client';

import { cn } from '@/lib/utils';
import type { ReadinessLevel, CoverageSummary, KeyStats, DomainType } from '@atlas/types';

interface ReadinessOverviewProps {
  readinessLevel?: ReadinessLevel;
  verdictSummary?: string;
  coverage: CoverageSummary;
  keyStats?: KeyStats;
  className?: string;
}

const READINESS_CONFIG: Record<ReadinessLevel, {
  label: string;
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = {
  ready: {
    label: 'Ready to Execute',
    icon: '●',
    bgColor: 'bg-[#DDEDEA]',
    textColor: 'text-[#0F7B6C]',
    borderColor: 'border-[#0F7B6C]',
  },
  ready_with_caveats: {
    label: 'Ready with Caveats',
    icon: '◐',
    bgColor: 'bg-[#FAEBDD]',
    textColor: 'text-[#D9730D]',
    borderColor: 'border-[#D9730D]',
  },
  not_ready: {
    label: 'Not Yet Ready',
    icon: '○',
    bgColor: 'bg-[#FBE4E4]',
    textColor: 'text-[#E03E3E]',
    borderColor: 'border-[#E03E3E]',
  },
};

const DOMAINS: { key: DomainType; label: string }[] = [
  { key: 'market', label: 'Market' },
  { key: 'product', label: 'Product' },
  { key: 'gtm', label: 'GTM' },
  { key: 'operations', label: 'Operations' },
  { key: 'financials', label: 'Financials' },
];

function getDomainConfidence(coverage: CoverageSummary, domain: DomainType): 'high' | 'medium' | 'low' {
  const domainCoverage = coverage[domain];
  const total = domainCoverage.high_confidence + domainCoverage.medium_confidence + domainCoverage.low_confidence;

  if (total === 0) return 'low';

  const highRatio = domainCoverage.high_confidence / total;
  const mediumRatio = domainCoverage.medium_confidence / total;

  if (highRatio >= 0.5) return 'high';
  if (mediumRatio >= 0.5 || highRatio + mediumRatio >= 0.6) return 'medium';
  return 'low';
}

const CONFIDENCE_STYLES: Record<'high' | 'medium' | 'low', { icon: string; color: string; label: string }> = {
  high: { icon: '●', color: 'text-[#0F7B6C]', label: 'High' },
  medium: { icon: '◐', color: 'text-[#D9730D]', label: 'Medium' },
  low: { icon: '○', color: 'text-[#E03E3E]', label: 'Low' },
};

export function ReadinessOverview({
  readinessLevel,
  verdictSummary,
  coverage,
  keyStats,
  className,
}: ReadinessOverviewProps) {
  // Default to ready_with_caveats if not provided (for backward compatibility)
  const level = readinessLevel || 'ready_with_caveats';
  const config = READINESS_CONFIG[level];

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-4">
        Your Readiness
      </h3>

      {/* Readiness Badge */}
      <div className={cn('rounded-lg p-4 mb-4', config.bgColor)}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className={cn('text-xl', config.textColor)}>{config.icon}</span>
          <span className={cn('text-[18px] font-semibold', config.textColor)}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Verdict Summary */}
      {verdictSummary && (
        <p className="text-[14px] text-[#37352F] text-center mb-6">
          {verdictSummary}
        </p>
      )}

      {/* Divider */}
      <div className="border-t border-[#E8E6E1] my-4" />

      {/* Domain Strip */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {DOMAINS.map(({ key, label }) => {
          const confidence = getDomainConfidence(coverage, key);
          const styles = CONFIDENCE_STYLES[confidence];

          return (
            <div key={key} className="text-center">
              <p className="text-[13px] font-medium text-[#37352F] mb-1">{label}</p>
              <p className={cn('text-lg', styles.color)}>{styles.icon}</p>
              <p className="text-[11px] text-[#9B9A97]">{styles.label}</p>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-[#E8E6E1] my-4" />

      {/* Key Stats */}
      {keyStats ? (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[18px] font-semibold text-[#37352F]">
              {keyStats.topics_covered}/{keyStats.total_topics}
            </p>
            <p className="text-[12px] text-[#9B9A97]">topics covered</p>
          </div>
          <div>
            <p className="text-[18px] font-semibold text-[#0F7B6C]">
              {keyStats.high_confidence_inputs}
            </p>
            <p className="text-[12px] text-[#9B9A97]">high confidence</p>
          </div>
          <div>
            <p className={cn(
              'text-[18px] font-semibold',
              keyStats.critical_gaps_count > 0 ? 'text-[#E03E3E]' : 'text-[#37352F]'
            )}>
              {keyStats.critical_gaps_count}
            </p>
            <p className="text-[12px] text-[#9B9A97]">critical gaps</p>
          </div>
        </div>
      ) : (
        // Fallback for old snapshots without key_stats
        <div className="text-center">
          <p className="text-[12px] text-[#9B9A97]">
            Coverage data available above
          </p>
        </div>
      )}
    </div>
  );
}
