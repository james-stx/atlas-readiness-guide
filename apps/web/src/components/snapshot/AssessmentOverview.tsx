'use client';

import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type {
  DomainType,
  AssessmentStatus,
  ReadinessLevel,
  DomainResult,
  CriticalAction,
} from '@atlas/types';

interface AssessmentOverviewProps {
  assessmentStatus: AssessmentStatus;
  coveragePercentage: number;
  topicsCovered: number;
  topicsTotal: number;
  readinessLevel?: ReadinessLevel;
  verdictSummary?: string;
  domains: Record<DomainType, DomainResult>;
  criticalActions?: CriticalAction[];
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

const CONFIDENCE_LABELS: Record<'high' | 'medium' | 'low', {
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
  criticalActions = [],
  className,
}: AssessmentOverviewProps) {
  const isIncomplete = assessmentStatus === 'incomplete';

  // Generate executive summary bullets
  const summaryBullets = generateSummaryBullets(domains, criticalActions, isIncomplete);

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
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

      {/* Executive Summary */}
      {!isIncomplete && summaryBullets.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#E8E6E1]">
          <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-3">
            Summary
          </h4>
          <ul className="space-y-2">
            {summaryBullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#9B9A97] mt-0.5">•</span>
                <span className={cn(
                  'text-[13px]',
                  bullet.isBlocker ? 'text-[#E03E3E] font-medium' : 'text-[#5C5A56]'
                )}>
                  {bullet.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Domain Breakdown - Simplified stacked layout */}
      <div className="mt-6 pt-6 border-t border-[#E8E6E1]">
        <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-4">
          By Domain
        </h4>
        <div className="space-y-4">
          {DOMAIN_ORDER.map((domainKey) => {
            const domain = domains[domainKey];
            return (
              <DomainRow
                key={domainKey}
                label={DOMAIN_LABELS[domainKey]}
                topicsCovered={domain.topics_covered}
                topicsTotal={domain.topics_total}
                confidenceLevel={domain.confidence_level}
                gapCount={domain.topics_total - domain.topics_covered}
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

      {domainsNeedingWork.length > 0 && (
        <p className="text-[13px] text-[#5C5A56] mb-4 ml-8">
          <span className="font-medium">Needs more coverage: </span>
          {domainsNeedingWork.map((d) => DOMAIN_LABELS[d]).join(', ')}
        </p>
      )}

      <div className="ml-8">
        <Link
          href="/workspace"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-md text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors"
        >
          Continue Assessment
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
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
    <div className={cn('rounded-lg p-5', config.bgColor)}>
      <div className="flex items-start gap-3 mb-4">
        <span className={cn('text-[24px]', config.color)}>{config.icon}</span>
        <div>
          <h4 className={cn('text-[18px] font-semibold mb-1', config.color)}>
            {config.label}
          </h4>
          {verdictSummary && (
            <p className="text-[14px] text-[#5C5A56] leading-relaxed">
              {verdictSummary}
            </p>
          )}
        </div>
      </div>

      {/* Coverage bar */}
      <div className="ml-9">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-[#5C5A56]">
            Coverage: {topicsCovered}/{topicsTotal} topics
          </span>
          <span className="text-[12px] font-medium text-[#37352F]">
            {coveragePercentage}%
          </span>
        </div>
        <div className="h-2 bg-white/50 rounded-full overflow-hidden">
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
  gapCount,
  isIncomplete,
}: {
  label: string;
  topicsCovered: number;
  topicsTotal: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  gapCount: number;
  isIncomplete: boolean;
}) {
  const coveragePercent = (topicsCovered / topicsTotal) * 100;
  const needsWork = topicsCovered < 2;
  const confConfig = CONFIDENCE_LABELS[confidenceLevel];

  return (
    <div className="bg-[#FAF9F7] rounded-lg p-4">
      {/* Row 1: Domain name and topic count */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          'text-[14px] font-medium',
          needsWork && isIncomplete ? 'text-[#9B9A97]' : 'text-[#37352F]'
        )}>
          {label}
        </span>
        <span className="text-[13px] text-[#5C5A56]">
          {topicsCovered}/{topicsTotal} topics
        </span>
      </div>

      {/* Row 2: Progress bar */}
      <div className="h-1.5 bg-[#E8E6E1] rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-[#37352F] rounded-full transition-all duration-300"
          style={{ width: `${coveragePercent}%` }}
        />
      </div>

      {/* Row 3: Confidence and gap info */}
      <div className="flex items-center justify-between text-[12px]">
        {isIncomplete && needsWork ? (
          <span className="text-[#D9730D]">Need 2+ topics</span>
        ) : (
          <span className={confConfig.color}>
            {confConfig.label} confidence
          </span>
        )}
        {gapCount > 0 && !isIncomplete && (
          <span className="text-[#9B9A97]">
            {gapCount} gap{gapCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

// Helper to generate executive summary bullets
function generateSummaryBullets(
  domains: Record<DomainType, DomainResult>,
  criticalActions: CriticalAction[],
  isIncomplete: boolean
): { text: string; isBlocker: boolean }[] {
  if (isIncomplete) return [];

  const bullets: { text: string; isBlocker: boolean }[] = [];

  // Find the primary blocker domain (lowest confidence or most gaps)
  let blockerDomain: DomainType | null = null;
  let blockerReason = '';

  for (const domain of DOMAIN_ORDER) {
    const d = domains[domain];
    if (d.confidence_level === 'low' && d.topics_covered >= 2) {
      blockerDomain = domain;
      blockerReason = 'needs work';
      break;
    }
  }

  // Add domain summaries
  for (const domain of DOMAIN_ORDER) {
    const d = domains[domain];
    const label = DOMAIN_LABELS[domain];
    const conf = CONFIDENCE_LABELS[d.confidence_level];

    if (d.confidence_level === 'high') {
      bullets.push({
        text: `${label}: ${conf.label} confidence`,
        isBlocker: false,
      });
    } else if (d.confidence_level === 'low') {
      const gapCount = d.topics_total - d.topics_covered;
      bullets.push({
        text: `${label}: ${conf.label} confidence — needs attention${gapCount > 0 ? ` (${gapCount} gaps)` : ''}`,
        isBlocker: true,
      });
    } else {
      bullets.push({
        text: `${label}: ${conf.label} confidence — validation needed`,
        isBlocker: false,
      });
    }
  }

  // Add primary blocker from critical actions if available
  if (criticalActions.length > 0) {
    const primaryBlocker = criticalActions[0];
    bullets.unshift({
      text: `Primary blocker: ${primaryBlocker.title}`,
      isBlocker: true,
    });
  }

  return bullets.slice(0, 6); // Limit to 6 bullets max
}
