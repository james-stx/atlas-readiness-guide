'use client';

import { cn } from '@/lib/utils';
import { Check, AlertTriangle, Circle } from 'lucide-react';
import type {
  DomainType,
  DomainResult,
  TopicResult,
  RequirementStatus,
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

const STATUS_ICONS: Record<RequirementStatus, {
  icon: typeof Check;
  color: string;
  label: string;
}> = {
  addressed: {
    icon: Check,
    color: 'text-[#0F7B6C]',
    label: 'Addressed',
  },
  partial: {
    icon: AlertTriangle,
    color: 'text-[#D9730D]',
    label: 'Partial',
  },
  not_addressed: {
    icon: Circle,
    color: 'text-[#9B9A97]',
    label: 'Not addressed',
  },
};

export function DomainDetailSection({
  domain,
  domainResult,
  className,
}: DomainDetailSectionProps) {
  const confConfig = CONFIDENCE_CONFIG[domainResult.confidence_level];
  const { topics_covered, topics_total, topics, confidence_breakdown } = domainResult;

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      {/* Domain Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-1">
            {DOMAIN_LABELS[domain]} Readiness
          </h3>
          <p className="text-[13px] text-[#5C5A56]">
            {topics_covered}/{topics_total} topics covered
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceDots breakdown={confidence_breakdown} />
          <span className={cn(
            'px-2 py-0.5 rounded text-[11px] font-medium',
            confConfig.bgColor,
            confConfig.color
          )}>
            {confConfig.label}
          </span>
        </div>
      </div>

      {/* Topic Cards */}
      <div className="space-y-3">
        {topics.map((topic) => (
          <TopicCard key={topic.topic_id} topic={topic} />
        ))}
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: TopicResult }) {
  const isCovered = topic.status === 'covered';
  const confConfig = topic.confidence ? CONFIDENCE_CONFIG[topic.confidence] : null;

  if (!isCovered) {
    return (
      <div className="border border-dashed border-[#E8E6E1] rounded-lg p-4 bg-[#FAF9F7]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Circle className="w-4 h-4 text-[#9B9A97] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[14px] font-medium text-[#9B9A97]">
                {topic.topic_label}
              </p>
              {topic.requirements.length > 0 && (
                <p className="text-[13px] text-[#9B9A97] mt-1">
                  Not covered in assessment
                </p>
              )}
            </div>
          </div>
          <span className="text-[11px] text-[#9B9A97] flex-shrink-0">
            NOT COVERED
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#E8E6E1] rounded-lg p-4">
      {/* Topic Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-[#0F7B6C] mt-0.5 flex-shrink-0" />
          <p className="text-[14px] font-medium text-[#37352F]">
            {topic.topic_label}
          </p>
        </div>
        {confConfig && (
          <span className={cn(
            'px-2 py-0.5 rounded text-[11px] font-medium flex-shrink-0',
            confConfig.bgColor,
            confConfig.color
          )}>
            {confConfig.label}
          </span>
        )}
      </div>

      {/* Key Insight */}
      {topic.key_insight && (
        <div className="mb-3 pl-6">
          <p className="text-[13px] text-[#5C5A56] leading-relaxed">
            {topic.key_insight}
          </p>
        </div>
      )}

      {/* Requirements */}
      {topic.requirements.length > 0 && (
        <div className="pl-6">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-2">
            Requirements
          </p>
          <div className="space-y-1.5">
            {topic.requirements.map((req) => {
              const statusConfig = STATUS_ICONS[req.status];
              const Icon = statusConfig.icon;
              return (
                <div key={req.requirement_id} className="flex items-start gap-2">
                  <Icon className={cn('w-3.5 h-3.5 mt-0.5 flex-shrink-0', statusConfig.color)} />
                  <span className={cn(
                    'text-[13px]',
                    req.status === 'not_addressed' ? 'text-[#9B9A97]' : 'text-[#5C5A56]'
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

function ConfidenceDots({ breakdown }: { breakdown: { high: number; medium: number; low: number } }) {
  const total = breakdown.high + breakdown.medium + breakdown.low;
  const dots = [];

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
