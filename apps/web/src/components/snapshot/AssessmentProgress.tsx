'use client';

import { cn } from '@/lib/utils';
import type { DomainType, DomainResult } from '@atlas/types';

interface AssessmentProgressProps {
  coveragePercentage: number;
  topicsCovered: number;
  topicsTotal: number;
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

// Threshold for full report
const COMPLETION_THRESHOLD = 60;
const MIN_TOPICS = 15;

export function AssessmentProgress({
  coveragePercentage,
  topicsCovered,
  topicsTotal,
  domains,
  className,
}: AssessmentProgressProps) {
  // Guard against undefined domains
  if (!domains) {
    return (
      <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-5', className)}>
        <div className="flex items-center gap-2">
          <span className="text-[16px] text-[#9B9A97]">○</span>
          <h3 className="text-[15px] font-semibold text-[#37352F]">
            Loading progress data...
          </h3>
        </div>
      </div>
    );
  }

  // Find domains that need work (priority order for guidance)
  const domainsNeedingWork = DOMAIN_ORDER.filter(
    (d) => domains[d].topics_covered < 2
  );

  // Calculate progress toward threshold
  const progressToThreshold = Math.min((coveragePercentage / COMPLETION_THRESHOLD) * 100, 100);
  const topicsNeeded = Math.max(MIN_TOPICS - topicsCovered, 0);

  // Full report requires BOTH 60% coverage AND 2+ topics per domain
  const meetsTopicThreshold = topicsNeeded === 0;
  const meetsDomainRequirement = domainsNeedingWork.length === 0;
  const fullyReady = meetsTopicThreshold && meetsDomainRequirement;

  // Progress message that accounts for both requirements
  const getProgressMessage = () => {
    if (fullyReady) {
      return 'Ready for full report!';
    }
    if (meetsTopicThreshold && !meetsDomainRequirement) {
      return `Need 2+ topics in ${domainsNeedingWork.length} domain${domainsNeedingWork.length > 1 ? 's' : ''}`;
    }
    return `${topicsNeeded} more topics needed`;
  };

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-5', className)}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[16px] text-[#9B9A97]">○</span>
          <h3 className="text-[15px] font-semibold text-[#37352F]">
            Assessment in Progress
          </h3>
        </div>
        <p className="text-[13px] text-[#5C5A56] ml-6">
          {topicsCovered} of {topicsTotal} topics covered ({coveragePercentage}%)
        </p>
      </div>

      {/* Progress toward threshold */}
      <div className="mb-5 ml-6">
        <div className="flex items-center justify-between text-[12px] mb-1.5">
          <span className="text-[#5C5A56]">Progress to full report</span>
          <span className={cn(
            meetsTopicThreshold && !meetsDomainRequirement ? 'text-[#D9730D]' : 'text-[#9B9A97]'
          )}>
            {getProgressMessage()}
          </span>
        </div>
        <div className="h-2 bg-[#E8E6E1] rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              fullyReady ? 'bg-[#0F7B6C]' :
              meetsTopicThreshold ? 'bg-[#D9730D]' : 'bg-[#37352F]'
            )}
            style={{ width: `${progressToThreshold}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-[#9B9A97] mt-1">
          <span>0%</span>
          <span className="font-medium">60% + all domains</span>
          <span>100%</span>
        </div>
      </div>

      {/* Domain coverage */}
      <div className="space-y-2">
        <p className="text-[11px] font-medium text-[#9B9A97] uppercase tracking-wide mb-2 ml-6">
          Domain Coverage
        </p>

        {DOMAIN_ORDER.map((domainKey, index) => {
          const domain = domains[domainKey];
          const isComplete = domain.topics_covered === domain.topics_total;
          const needsWork = domain.topics_covered < 2;
          const coveragePercent = (domain.topics_covered / domain.topics_total) * 100;

          // Determine guidance text
          let guidance: string | null = null;
          if (needsWork) {
            const uncoveredNeedingWork = domainsNeedingWork;
            const priorityIndex = uncoveredNeedingWork.indexOf(domainKey);
            if (priorityIndex === 0) {
              guidance = 'Start here';
            } else if (priorityIndex === 1) {
              guidance = 'Then here';
            } else if (priorityIndex > 1) {
              guidance = 'Need 2+';
            }
          }

          return (
            <div key={domainKey} className="flex items-center gap-3 ml-6">
              <span className={cn(
                'w-24 flex-shrink-0 text-[13px]',
                needsWork ? 'text-[#9B9A97]' : 'text-[#37352F]'
              )}>
                {DOMAIN_LABELS[domainKey]}
              </span>

              {/* Progress bar */}
              <div className="flex-1 max-w-[200px] h-1.5 bg-[#E8E6E1] rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    isComplete ? 'bg-[#0F7B6C]' : 'bg-[#37352F]'
                  )}
                  style={{ width: `${coveragePercent}%` }}
                />
              </div>

              {/* Count */}
              <span className="w-10 text-[13px] text-[#5C5A56]">
                {domain.topics_covered}/{domain.topics_total}
              </span>

              {/* Status/Guidance */}
              <span className={cn(
                'w-20 text-[11px] font-medium',
                isComplete ? 'text-[#0F7B6C]' :
                guidance === 'Start here' ? 'text-[#2383E2]' :
                guidance === 'Then here' ? 'text-[#5C5A56]' :
                'text-[#D9730D]'
              )}>
                {isComplete ? '✓ Complete' : guidance}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
