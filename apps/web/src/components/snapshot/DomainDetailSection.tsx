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

// Requirement status icons per design spec
const REQUIREMENT_STATUS_CONFIG: Record<'addressed' | 'partial' | 'not_addressed', {
  icon: string;
  color: string;
}> = {
  addressed: { icon: '✓', color: 'text-[#0F7B6C]' },
  partial: { icon: '△', color: 'text-[#D9730D]' },
  not_addressed: { icon: '○', color: 'text-[#9B9A97]' },
};

export function DomainDetailSection({
  domain,
  domainResult,
  className,
}: DomainDetailSectionProps) {
  // Guard against undefined domainResult
  if (!domainResult) {
    return (
      <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
        <p className="text-[13px] text-[#9B9A97]">Loading domain data...</p>
      </div>
    );
  }

  const confConfig = CONFIDENCE_CONFIG[domainResult.confidence_level] || CONFIDENCE_CONFIG.low;
  const { topics_covered, topics_total, topics } = domainResult;

  // Separate covered and uncovered topics
  const coveredTopics = topics.filter(t => t.status === 'covered');
  const uncoveredTopics = topics.filter(t => t.status !== 'covered');

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      {/* Domain Header - matches spec layout */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-[#37352F]">
            {DOMAIN_LABELS[domain]} Readiness
          </h3>
          <p className="text-[12px] text-[#9B9A97]">
            {topics_covered}/{topics_total} topics covered
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceDots level={domainResult.confidence_level} />
          <span className={cn(
            'px-2.5 py-1 rounded text-[11px] font-medium',
            confConfig.bgColor,
            confConfig.color
          )}>
            {confConfig.label}
          </span>
        </div>
      </div>

      {/* Covered Topics - Structured cards per spec */}
      {coveredTopics.length > 0 && (
        <div className="space-y-4">
          {coveredTopics.map((topic) => (
            <CoveredTopicCard key={topic.topic_id} topic={topic} />
          ))}
        </div>
      )}

      {/* Uncovered Topics - Dashed border cards per spec */}
      {uncoveredTopics.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#E8E6E1]">
          <div className="space-y-3">
            {uncoveredTopics.map((topic) => (
              <UncoveredTopicCard key={topic.topic_id} topic={topic} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Confidence dots: ●●●●○ for HIGH, ●●●○○ for MEDIUM, ●○○○○ for LOW
function ConfidenceDots({ level }: { level: ConfidenceLevel }) {
  const filledCount = level === 'high' ? 4 : level === 'medium' ? 2 : 1;
  const colors = {
    high: 'text-[#0F7B6C]',
    medium: 'text-[#D9730D]',
    low: 'text-[#E03E3E]',
  };

  return (
    <span className={cn('text-[11px] tracking-tight', colors[level])}>
      {'●'.repeat(filledCount)}
      <span className="text-[#D4D1CB]">{'○'.repeat(5 - filledCount)}</span>
    </span>
  );
}

function CoveredTopicCard({ topic }: { topic: TopicResult }) {
  const confConfig = topic.confidence ? CONFIDENCE_CONFIG[topic.confidence] : null;

  return (
    <div className="bg-[#FAF9F7] rounded-lg p-4 border border-[#E8E6E1]">
      {/* Topic Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-[#0F7B6C] flex-shrink-0" />
          <p className="text-[14px] font-medium text-[#37352F]">
            {topic.topic_label}
          </p>
        </div>
        {confConfig && (
          <span className={cn(
            'px-2 py-0.5 rounded text-[10px] font-medium flex-shrink-0',
            confConfig.bgColor,
            confConfig.color
          )}>
            {confConfig.label}
          </span>
        )}
      </div>

      {/* Separator line per spec */}
      <div className="border-t border-[#E8E6E1] my-2 ml-6" />

      {/* Key Insight - prominently displayed */}
      {topic.key_insight && (
        <div className="ml-6 mb-3">
          <p className="text-[13px] text-[#5C5A56] leading-relaxed">
            <span className="font-medium text-[#37352F]">Key insight: </span>
            {topic.key_insight}
          </p>
        </div>
      )}

      {/* Requirements addressed - per spec with ✓/△/○ icons */}
      {topic.requirements && topic.requirements.length > 0 && (
        <div className="ml-6">
          <p className="text-[11px] font-medium text-[#9B9A97] uppercase tracking-wide mb-2">
            Requirements addressed:
          </p>
          <div className="space-y-1">
            {topic.requirements.map((req) => {
              const statusConfig = REQUIREMENT_STATUS_CONFIG[req.status as keyof typeof REQUIREMENT_STATUS_CONFIG] || REQUIREMENT_STATUS_CONFIG.not_addressed;
              return (
                <div key={req.requirement_id} className="flex items-center gap-2">
                  <span className={cn('text-[13px]', statusConfig.color)}>
                    {statusConfig.icon}
                  </span>
                  <span className={cn(
                    'text-[13px]',
                    req.status === 'addressed' ? 'text-[#37352F]' : 'text-[#5C5A56]'
                  )}>
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function UncoveredTopicCard({ topic }: { topic: TopicResult }) {
  return (
    <div className="rounded-lg p-4 border border-dashed border-[#E8E6E1] bg-[#FAF9F7]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-[#9B9A97]">○</span>
          <p className="text-[14px] text-[#9B9A97]">
            {topic.topic_label}
          </p>
        </div>
        <span className="text-[10px] font-medium text-[#9B9A97] uppercase">
          Not Covered
        </span>
      </div>
    </div>
  );
}
