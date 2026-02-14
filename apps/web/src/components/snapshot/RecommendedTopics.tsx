'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { TopicRecommendation, DomainType } from '@atlas/types';

interface RecommendedTopicsProps {
  recommendations: TopicRecommendation[];
  className?: string;
}

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

export function RecommendedTopics({ recommendations, className }: RecommendedTopicsProps) {
  const router = useRouter();

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Take top 3 recommendations
  const topRecommendations = recommendations.slice(0, 3);
  const firstRecommendation = topRecommendations[0];

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-5', className)}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#2383E2]" />
          <h3 className="text-[15px] font-semibold text-[#37352F]">
            Recommended Next Topics
          </h3>
        </div>
        <p className="text-[13px] text-[#5C5A56]">
          Based on your coverage, these will unlock the most insight
        </p>
      </div>

      {/* Recommendations */}
      <div className="space-y-3 mb-4">
        {topRecommendations.map((rec, index) => (
          <div
            key={rec.topic_id}
            className={cn(
              'rounded-lg p-4 border',
              index === 0
                ? 'bg-[#DDEBF1]/30 border-[#2383E2]'
                : 'bg-[#FAF9F7] border-[#E8E6E1]'
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold',
                  index === 0
                    ? 'bg-[#2383E2] text-white'
                    : 'bg-[#E8E6E1] text-[#5C5A56]'
                )}>
                  {index + 1}
                </span>
                <div>
                  <p className="text-[13px] font-medium text-[#37352F]">
                    {DOMAIN_LABELS[rec.domain]} → {rec.topic_label}
                  </p>
                </div>
              </div>
              <span className={cn(
                'px-2 py-0.5 rounded text-[10px] font-medium flex-shrink-0',
                rec.impact === 'high'
                  ? 'bg-[#DDEBF1] text-[#2383E2]'
                  : 'bg-[#FAF9F7] text-[#5C5A56]'
              )}>
                {rec.impact === 'high' ? 'HIGH IMPACT' : 'MEDIUM IMPACT'}
              </span>
            </div>

            {/* Why */}
            <div className="mb-2">
              <p className="text-[12px] text-[#5C5A56] leading-relaxed">
                <span className="font-medium text-[#37352F]">Why: </span>
                {rec.why}
              </p>
            </div>

            {/* Unlocks */}
            {rec.unlocks && rec.unlocks.length > 0 && (
              <div className="text-[11px] text-[#9B9A97]">
                <span className="font-medium">This will unlock: </span>
                {rec.unlocks.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA to first recommended topic */}
      {firstRecommendation && (
        <button
          onClick={() => {
            // Navigate to workspace - ideally with deep link to specific topic
            // For now, just go to workspace with domain context
            router.push(`/workspace?domain=${firstRecommendation.domain}`);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#37352F] text-white rounded-lg text-[13px] font-medium hover:bg-[#2F2E2B] transition-colors"
        >
          Go to {DOMAIN_LABELS[firstRecommendation.domain]} → {firstRecommendation.topic_label}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
