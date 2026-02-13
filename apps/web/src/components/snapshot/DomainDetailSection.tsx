'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type {
  DomainType,
  DomainResult,
  TopicResult,
  ConfidenceLevel
} from '@atlas/types';

interface DomainDetailSectionProps {
  domain: DomainType;
  domainResult: DomainResult;
  className?: string;
}

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

const CONFIDENCE_CONFIG: Record<ConfidenceLevel, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  high: {
    label: 'HIGH',
    color: 'text-[#0F7B6C]',
    bgColor: 'bg-[#DDEDEA]',
  },
  medium: {
    label: 'MEDIUM',
    color: 'text-[#D9730D]',
    bgColor: 'bg-[#FAEBDD]',
  },
  low: {
    label: 'LOW',
    color: 'text-[#E03E3E]',
    bgColor: 'bg-[#FBE4E4]',
  },
};

export function DomainDetailSection({
  domain,
  domainResult,
  className,
}: DomainDetailSectionProps) {
  const confConfig = CONFIDENCE_CONFIG[domainResult.confidence_level];
  const { topics_covered, topics_total, topics } = domainResult;

  // Separate covered and uncovered topics
  const coveredTopics = topics.filter(t => t.status === 'covered');
  const uncoveredTopics = topics.filter(t => t.status !== 'covered');

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      {/* Domain Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#37352F]">
            {DOMAIN_LABELS[domain]}
          </h3>
          <p className="text-[12px] text-[#9B9A97]">
            {topics_covered}/{topics_total} topics covered
          </p>
        </div>
        <span className={cn(
          'px-2.5 py-1 rounded text-[11px] font-medium',
          confConfig.bgColor,
          confConfig.color
        )}>
          {confConfig.label}
        </span>
      </div>

      {/* Covered Topics - Simplified cards with just insight */}
      {coveredTopics.length > 0 && (
        <div className="space-y-3">
          {coveredTopics.map((topic) => (
            <CoveredTopicCard key={topic.topic_id} topic={topic} />
          ))}
        </div>
      )}

      {/* Uncovered Topics - Single summary block */}
      {uncoveredTopics.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#E8E6E1]">
          <p className="text-[12px] text-[#9B9A97] mb-2">
            Not yet covered:
          </p>
          <p className="text-[13px] text-[#5C5A56]">
            {uncoveredTopics.map(t => t.topic_label).join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}

function CoveredTopicCard({ topic }: { topic: TopicResult }) {
  const confConfig = topic.confidence ? CONFIDENCE_CONFIG[topic.confidence] : null;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#F1F0EC] last:border-0 last:pb-0 first:pt-0">
      {/* Checkmark */}
      <Check className="w-4 h-4 text-[#0F7B6C] mt-0.5 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-[13px] font-medium text-[#37352F]">
            {topic.topic_label}
          </p>
          {confConfig && (
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0',
              confConfig.bgColor,
              confConfig.color
            )}>
              {confConfig.label}
            </span>
          )}
        </div>

        {/* Key Insight - the main value */}
        {topic.key_insight && (
          <p className="text-[13px] text-[#5C5A56] leading-relaxed">
            {topic.key_insight}
          </p>
        )}
      </div>
    </div>
  );
}
