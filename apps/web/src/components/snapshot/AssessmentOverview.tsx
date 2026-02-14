'use client';

import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

  // Guard against undefined domains
  if (!domains) {
    return (
      <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-5', className)}>
        <div className="flex items-center gap-2">
          <span className="text-[16px] text-[#9B9A97]">○</span>
          <h3 className="text-[15px] font-semibold text-[#37352F]">
            Loading assessment data...
          </h3>
        </div>
      </div>
    );
  }

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
  const router = useRouter();

  // Get all covered topics across domains
  const coveredTopics = DOMAIN_ORDER.flatMap(domainKey =>
    domains[domainKey].topics
      .filter(t => t.status === 'covered')
      .map(t => ({ ...t, domain: domainKey }))
  );

  return (
    <div>
      {/* Status header - single line */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[16px] text-[#9B9A97]">○</span>
        <h3 className="text-[15px] font-semibold text-[#37352F]">
          Incomplete Assessment
        </h3>
        <span className="text-[13px] text-[#5C5A56]">
          — {topicsCovered}/{topicsTotal} topics ({coveragePercentage}%)
        </span>
      </div>

      {/* Compact domain grid - 2 columns with dots */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-4 text-[13px]">
        {DOMAIN_ORDER.map((domainKey) => {
          const domain = domains[domainKey];
          const needsWork = domain.topics_covered < 2;
          const isComplete = domain.topics_covered === domain.topics_total;

          return (
            <div key={domainKey} className="flex items-center gap-2">
              <span className={cn(
                'w-20 flex-shrink-0',
                needsWork ? 'text-[#9B9A97]' : 'text-[#37352F]'
              )}>
                {DOMAIN_LABELS[domainKey]}
              </span>
              {/* Dot indicators */}
              <span className="tracking-tight text-[11px]">
                {Array.from({ length: domain.topics_total }).map((_, i) => (
                  <span
                    key={i}
                    className={i < domain.topics_covered ? 'text-[#37352F]' : 'text-[#D4D1CB]'}
                  >
                    {i < domain.topics_covered ? '●' : '○'}
                  </span>
                ))}
              </span>
              {needsWork ? (
                <span className="text-[11px] text-[#D9730D] ml-1">Need 2+</span>
              ) : isComplete ? (
                <span className="text-[11px] text-[#0F7B6C] ml-1">✓</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Topics covered so far */}
      {coveredTopics.length > 0 && (
        <div className="mb-4 pt-3 border-t border-[#E8E6E1]">
          <p className="text-[11px] font-medium text-[#9B9A97] uppercase tracking-wide mb-2">
            Topics Covered
          </p>
          <div className="flex flex-wrap gap-1.5">
            {coveredTopics.map((topic) => (
              <span
                key={topic.topic_id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FAF9F7] border border-[#E8E6E1] rounded text-[12px] text-[#5C5A56]"
              >
                <span className="text-[10px] text-[#0F7B6C]">✓</span>
                {topic.topic_label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* What's needed */}
      <p className="text-[12px] text-[#5C5A56] mb-3">
        Complete at least 15 topics (60%) with coverage in all 5 domains for your full readiness report.
      </p>

      {/* CTA */}
      <button
        onClick={() => router.push('/workspace')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2383E2] text-white rounded-md text-[13px] font-medium hover:bg-[#1A6DC0] transition-colors cursor-pointer"
      >
        Continue Assessment
        <ArrowRight className="w-4 h-4" />
      </button>
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
  const config = READINESS_CONFIG[readinessLevel] || READINESS_CONFIG.not_ready;

  return (
    <div>
      {/* Verdict - compact */}
      <div className={cn('rounded-lg p-3 mb-3', config.bgColor)}>
        <div className="flex items-center gap-2">
          <span className={cn('text-[16px]', config.color)}>{config.icon}</span>
          <h3 className={cn('text-[15px] font-semibold', config.color)}>
            {config.label}
          </h3>
          <span className="text-[12px] text-[#5C5A56] ml-auto">
            {topicsCovered}/{topicsTotal} ({coveragePercentage}%)
          </span>
        </div>
        {verdictSummary && (
          <p className="text-[13px] text-[#5C5A56] mt-1.5 ml-6">
            {verdictSummary}
          </p>
        )}
      </div>

      {/* Compact domain breakdown - 2 columns with dots */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[13px]">
        {DOMAIN_ORDER.map((domainKey) => {
          const domain = domains[domainKey];
          const confConfig = CONFIDENCE_CONFIG[domain.confidence_level] || CONFIDENCE_CONFIG.low;

          return (
            <div key={domainKey} className="flex items-center gap-2">
              <span className="w-20 flex-shrink-0 text-[#37352F]">
                {DOMAIN_LABELS[domainKey]}
              </span>
              {/* Dot indicators */}
              <span className="tracking-tight text-[11px]">
                {Array.from({ length: domain.topics_total }).map((_, i) => (
                  <span
                    key={i}
                    className={i < domain.topics_covered ? 'text-[#37352F]' : 'text-[#D4D1CB]'}
                  >
                    {i < domain.topics_covered ? '●' : '○'}
                  </span>
                ))}
              </span>
              <span className={cn('text-[10px] font-medium', confConfig.color)}>
                {confConfig.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
