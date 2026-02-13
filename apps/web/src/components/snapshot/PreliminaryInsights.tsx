'use client';

import { cn } from '@/lib/utils';
import type { DomainType, DomainResult, TopicResult } from '@atlas/types';

interface PreliminaryInsightsProps {
  domains: Record<DomainType, DomainResult>;
  className?: string;
}

const DOMAIN_ORDER: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

const CONFIDENCE_CONFIG: Record<'high' | 'medium' | 'low', {
  label: string;
  color: string;
  bgColor: string;
}> = {
  high: { label: 'HIGH', color: 'text-[#0F7B6C]', bgColor: 'bg-[#DDEDEA]' },
  medium: { label: 'MED', color: 'text-[#D9730D]', bgColor: 'bg-[#FAEBDD]' },
  low: { label: 'LOW', color: 'text-[#E03E3E]', bgColor: 'bg-[#FBE4E4]' },
};

export function PreliminaryInsights({ domains, className }: PreliminaryInsightsProps) {
  // Collect all covered topics with insights
  const topicsWithInsights: { topic: TopicResult; domain: DomainType }[] = [];

  DOMAIN_ORDER.forEach((domainKey) => {
    const domain = domains[domainKey];
    domain.topics
      .filter((t) => t.status === 'covered' && t.key_insight)
      .forEach((topic) => {
        topicsWithInsights.push({ topic, domain: domainKey });
      });
  });

  if (topicsWithInsights.length === 0) {
    return null;
  }

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-5', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-[#37352F]">
          Preliminary Insights
        </h3>
        <span className="text-[12px] text-[#9B9A97]">
          {topicsWithInsights.length} topic{topicsWithInsights.length !== 1 ? 's' : ''}
        </span>
      </div>

      <p className="text-[12px] text-[#5C5A56] mb-4">
        Key observations from topics covered so far. Complete your assessment for full analysis.
      </p>

      <div className="space-y-3">
        {topicsWithInsights.map(({ topic, domain }) => {
          const confConfig = topic.confidence ? CONFIDENCE_CONFIG[topic.confidence] : null;

          return (
            <div
              key={topic.topic_id}
              className="border-l-2 border-[#E8E6E1] pl-3 py-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] font-medium text-[#37352F]">
                  {topic.topic_label}
                </span>
                <span className="text-[11px] text-[#9B9A97]">
                  {DOMAIN_LABELS[domain]}
                </span>
                {confConfig && (
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[9px] font-medium',
                    confConfig.bgColor,
                    confConfig.color
                  )}>
                    {confConfig.label}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#5C5A56] leading-relaxed">
                {topic.key_insight}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
