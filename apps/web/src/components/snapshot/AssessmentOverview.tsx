'use client';

import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type {
  DomainType,
  AssessmentStatus,
  ReadinessLevel,
  DomainResult,
} from '@atlas/types';

interface AssessmentOverviewProps {
  assessmentStatus: AssessmentStatus;
  coveragePercentage: number;
  topicsCovered: number;
  topicsTotal: number;
  readinessLevel?: ReadinessLevel;
  verdictSummary?: string;
  domains: Record<DomainType, DomainResult>;
  className?: string;
}

const DOMAIN_ORDER: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

const READINESS_CONFIG: Record<ReadinessLevel, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  ready: {
    label: 'Ready to Execute',
    color: 'text-[#0F7B6C]',
    bgColor: 'bg-[#DDEDEA]',
    icon: '●',
  },
  ready_with_caveats: {
    label: 'Ready with Caveats',
    color: 'text-[#D9730D]',
    bgColor: 'bg-[#FAEBDD]',
    icon: '◐',
  },
  not_ready: {
    label: 'Not Yet Ready',
    color: 'text-[#E03E3E]',
    bgColor: 'bg-[#FBE4E4]',
    icon: '○',
  },
};

const CONFIDENCE_CONFIG: Record<'high' | 'medium' | 'low', {
  label: string;
  color: string;
}> = {
  high: { label: 'HIGH', color: 'text-[#0F7B6C]' },
  medium: { label: 'MED', color: 'text-[#D9730D]' },
  low: { label: 'LOW', color: 'text-[#E03E3E]' },
};

export function AssessmentOverview({
  assessmentStatus,
  coveragePercentage,
  topicsCovered,
  topicsTotal,
  readinessLevel,
  verdictSummary,
  domains,
  className,
}: AssessmentOverviewProps) {
  const isIncomplete = assessmentStatus === 'incomplete';

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-5', className)}>
      {/* Assessment Status */}
      {isIncomplete ? (
        <IncompleteStatus
          coveragePercentage={coveragePercentage}
          topicsCovered={topicsCovered}
          topicsTotal={topicsTotal}
          domains={domains}
        />
      ) : (
        <ReadinessStatus
          readinessLevel={readinessLevel!}
          verdictSummary={verdictSummary}
          coveragePercentage={coveragePercentage}
          topicsCovered={topicsCovered}
          topicsTotal={topicsTotal}
          domains={domains}
        />
      )}
    </div>
  );
}

function IncompleteStatus({
  coveragePercentage,
  topicsCovered,
  topicsTotal,
  domains,
}: {
  coveragePercentage: number;
  topicsCovered: number;
  topicsTotal: number;
  domains: Record<DomainType, DomainResult>;
}) {
  return (
    <div>
      {/* Status header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-[18px] text-[#9B9A97]">○</span>
        <div className="flex-1">
          <h3 className="text-[16px] font-semibold text-[#37352F]">
            Incomplete Assessment
          </h3>
          <p className="text-[13px] text-[#5C5A56] mt-1">
            You've covered {topicsCovered} of {topicsTotal} topics ({coveragePercentage}%).
            Complete at least 15 topics (60%) with coverage in all domains.
          </p>
        </div>
      </div>

      {/* Compact domain progress */}
      <div className="space-y-2 mb-4">
        {DOMAIN_ORDER.map((domainKey) => {
          const domain = domains[domainKey];
          const needsWork = domain.topics_covered < 2;
          const coveragePercent = (domain.topics_covered / domain.topics_total) * 100;

          return (
            <div key={domainKey} className="flex items-center gap-3 text-[13px]">
              <span className={cn(
                'w-24 flex-shrink-0',
                needsWork ? 'text-[#9B9A97]' : 'text-[#37352F]'
              )}>
                {DOMAIN_LABELS[domainKey]}
              </span>
              <div className="flex-1 h-1.5 bg-[#E8E6E1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#37352F] rounded-full"
                  style={{ width: `${coveragePercent}%` }}
                />
              </div>
              <span className="w-12 text-right text-[#5C5A56]">
                {domain.topics_covered}/{domain.topics_total}
              </span>
              {needsWork ? (
                <span className="w-16 text-right text-[11px] text-[#D9730D]">Need 2+</span>
              ) : (
                <span className="w-16 text-right text-[11px] text-[#0F7B6C]">✓</span>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <Link
        href="/workspace"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-md text-[13px] font-medium hover:bg-[#1A6DC0] transition-colors"
      >
        Continue Assessment
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function ReadinessStatus({
  readinessLevel,
  verdictSummary,
  coveragePercentage,
  topicsCovered,
  topicsTotal,
  domains,
}: {
  readinessLevel: ReadinessLevel;
  verdictSummary?: string;
  coveragePercentage: number;
  topicsCovered: number;
  topicsTotal: number;
  domains: Record<DomainType, DomainResult>;
}) {
  const config = READINESS_CONFIG[readinessLevel];

  return (
    <div>
      {/* Verdict */}
      <div className={cn('rounded-lg p-4 mb-4', config.bgColor)}>
        <div className="flex items-start gap-3">
          <span className={cn('text-[20px]', config.color)}>{config.icon}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className={cn('text-[16px] font-semibold', config.color)}>
                {config.label}
              </h3>
              <span className="text-[12px] text-[#5C5A56]">
                {topicsCovered}/{topicsTotal} topics ({coveragePercentage}%)
              </span>
            </div>
            {verdictSummary && (
              <p className="text-[13px] text-[#5C5A56] mt-1">
                {verdictSummary}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Compact domain breakdown */}
      <div className="space-y-1.5">
        {DOMAIN_ORDER.map((domainKey) => {
          const domain = domains[domainKey];
          const coveragePercent = (domain.topics_covered / domain.topics_total) * 100;
          const confConfig = CONFIDENCE_CONFIG[domain.confidence_level];

          return (
            <div key={domainKey} className="flex items-center gap-3 text-[13px]">
              <span className="w-24 flex-shrink-0 text-[#37352F]">
                {DOMAIN_LABELS[domainKey]}
              </span>
              <div className="flex-1 h-1.5 bg-[#E8E6E1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#37352F] rounded-full"
                  style={{ width: `${coveragePercent}%` }}
                />
              </div>
              <span className="w-10 text-right text-[#5C5A56]">
                {domain.topics_covered}/{domain.topics_total}
              </span>
              <span className={cn('w-10 text-right text-[11px] font-medium', confConfig.color)}>
                {confConfig.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
