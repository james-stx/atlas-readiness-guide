'use client';

import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type {
  DomainType,
  AssessmentStatus,
  ReadinessLevel,
  DomainResult
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

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

const DOMAIN_ORDER: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

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
  medium: { label: 'MEDIUM', color: 'text-[#D9730D]' },
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
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-4">
        Assessment Overview
      </h3>

      {/* Assessment Status Card */}
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
        />
      )}

      {/* Domain Breakdown */}
      <div className="mt-6">
        <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-3">
          Domain Breakdown
        </h4>
        <div className="space-y-2">
          {DOMAIN_ORDER.map((domainKey) => {
            const domain = domains[domainKey];
            return (
              <DomainRow
                key={domainKey}
                label={DOMAIN_LABELS[domainKey]}
                topicsCovered={domain.topics_covered}
                topicsTotal={domain.topics_total}
                confidenceLevel={domain.confidence_level}
                confidenceBreakdown={domain.confidence_breakdown}
                isIncomplete={isIncomplete}
              />
            );
          })}
        </div>
      </div>
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
  const domainsNeedingWork = DOMAIN_ORDER.filter(
    (d) => domains[d].topics_covered < 2
  );

  return (
    <div className="bg-[#FAF9F7] rounded-lg p-5 border border-[#E8E6E1]">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-[20px] text-[#9B9A97]">○</span>
        <div>
          <h4 className="text-[16px] font-semibold text-[#37352F] mb-1">
            Incomplete Assessment
          </h4>
          <p className="text-[14px] text-[#5C5A56]">
            You've covered {topicsCovered} of {topicsTotal} topics ({coveragePercentage}%).
            Complete at least 15 topics (60%) with coverage in all domains to receive
            a readiness assessment.
          </p>
        </div>
      </div>

      {/* What's needed */}
      {domainsNeedingWork.length > 0 && (
        <div className="text-[13px] text-[#5C5A56] mb-4">
          <span className="font-medium">Domains needing more coverage: </span>
          {domainsNeedingWork.map((d) => DOMAIN_LABELS[d]).join(', ')}
        </div>
      )}

      <Link
        href="/workspace"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-md text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors"
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
}: {
  readinessLevel: ReadinessLevel;
  verdictSummary?: string;
  coveragePercentage: number;
  topicsCovered: number;
  topicsTotal: number;
}) {
  const config = READINESS_CONFIG[readinessLevel];

  return (
    <div className={cn('rounded-lg p-5 border', config.bgColor, 'border-transparent')}>
      <div className="flex items-start gap-3 mb-4">
        <span className={cn('text-[20px]', config.color)}>{config.icon}</span>
        <div>
          <h4 className={cn('text-[16px] font-semibold mb-1', config.color)}>
            {config.label}
          </h4>
          {verdictSummary && (
            <p className="text-[14px] text-[#5C5A56]">{verdictSummary}</p>
          )}
        </div>
      </div>

      {/* Coverage bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97]">
            Coverage
          </span>
          <span className="text-[13px] text-[#5C5A56]">
            {topicsCovered}/{topicsTotal} topics ({coveragePercentage}%)
          </span>
        </div>
        <div className="h-2 bg-[#E8E6E1] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#37352F] rounded-full transition-all duration-300"
            style={{ width: `${coveragePercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function DomainRow({
  label,
  topicsCovered,
  topicsTotal,
  confidenceLevel,
  confidenceBreakdown,
  isIncomplete,
}: {
  label: string;
  topicsCovered: number;
  topicsTotal: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  confidenceBreakdown: { high: number; medium: number; low: number };
  isIncomplete: boolean;
}) {
  const coveragePercent = (topicsCovered / topicsTotal) * 100;
  const needsWork = topicsCovered < 2;
  const confConfig = CONFIDENCE_CONFIG[confidenceLevel];

  return (
    <div className="flex items-center gap-4 py-2 border-b border-[#F1F0EC] last:border-0">
      {/* Domain name */}
      <div className="w-[100px] flex-shrink-0">
        <span className={cn(
          'text-[14px] font-medium',
          needsWork && isIncomplete ? 'text-[#9B9A97]' : 'text-[#37352F]'
        )}>
          {label}
        </span>
      </div>

      {/* Coverage bar */}
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[#E8E6E1] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#37352F] rounded-full transition-all duration-300"
            style={{ width: `${coveragePercent}%` }}
          />
        </div>
        <span className="text-[12px] text-[#9B9A97] w-[50px]">
          {topicsCovered}/{topicsTotal}
        </span>
      </div>

      {/* Confidence dots OR warning */}
      <div className="w-[120px] flex-shrink-0 flex items-center justify-end gap-2">
        {isIncomplete && needsWork ? (
          <span className="text-[11px] text-[#D9730D]">Need 2+</span>
        ) : (
          <>
            <ConfidenceDots breakdown={confidenceBreakdown} />
            <span className={cn('text-[11px] font-medium', confConfig.color)}>
              {confConfig.label}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function ConfidenceDots({ breakdown }: { breakdown: { high: number; medium: number; low: number } }) {
  const total = breakdown.high + breakdown.medium + breakdown.low;
  const dots = [];

  // Create dots representing up to 5 topics
  for (let i = 0; i < 5; i++) {
    let type: 'high' | 'medium' | 'low' | 'empty' = 'empty';

    if (i < breakdown.high) {
      type = 'high';
    } else if (i < breakdown.high + breakdown.medium) {
      type = 'medium';
    } else if (i < total) {
      type = 'low';
    }

    dots.push(
      <span
        key={i}
        className={cn(
          'w-2 h-2 rounded-full',
          type === 'high' && 'bg-[#0F7B6C]',
          type === 'medium' && 'bg-[#D9730D]',
          type === 'low' && 'bg-[#E03E3E]',
          type === 'empty' && 'bg-[#E8E6E1]'
        )}
      />
    );
  }

  return <div className="flex items-center gap-0.5">{dots}</div>;
}
