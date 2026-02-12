'use client';

import type { DomainType } from '@atlas/types';
import { DOMAINS, DOMAIN_TOPICS, type DomainProgress } from '@/lib/progress';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ContentDomainHeaderProps {
  domain: DomainType;
  count: { current: number; total: number };
  domainProgress: DomainProgress;
  onTopicSelect: (topicId: string) => void;
}

export function ContentDomainHeader({
  domain,
  count,
  domainProgress,
  onTopicSelect,
}: ContentDomainHeaderProps) {
  const domainInfo = DOMAINS.find((d) => d.key === domain);
  const label = domainInfo?.label ?? domain;
  const topics = DOMAIN_TOPICS[domain];

  // Find suggested next topic (first uncovered)
  const suggestedTopic = topics.find(
    (t) => !domainProgress.coveredTopics.includes(t.id)
  );

  // Generate domain-level assessment
  const assessment = generateDomainAssessment(count, domainProgress);

  return (
    <div className="mb-6">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-[22px] font-semibold text-[#37352F]">
          {label} Insights
        </h2>
        <span className="text-[13px] tabular-nums text-[#9B9A97]">
          {count.current}/{count.total} topics
        </span>
      </div>

      {/* Domain Summary Card */}
      <div className="rounded-lg border border-[#E8E6E1] bg-[#FAF9F7] p-4">
        {/* Assessment sentence */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8E6E1]">
            <Sparkles className="h-4 w-4 text-[#5C5A56]" />
          </div>
          <p className="text-[14px] leading-relaxed text-[#37352F] pt-1">
            {assessment}
          </p>
        </div>

        {/* Confidence breakdown + Suggested next */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8E6E1]">
          {/* Confidence dots */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array(domainProgress.highConfidence)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={`high-${i}`}
                    className="h-2 w-2 rounded-full bg-[#37352F]"
                  />
                ))}
              {Array(domainProgress.mediumConfidence)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={`med-${i}`}
                    className="h-2 w-2 rounded-full bg-[#9B9A97]"
                  />
                ))}
              {Array(domainProgress.lowConfidence)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={`low-${i}`}
                    className="h-2 w-2 rounded-full bg-[#E03E3E]"
                  />
                ))}
              {Array(count.total - count.current)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={`empty-${i}`}
                    className="h-2 w-2 rounded-full border border-[#D4D1CB]"
                  />
                ))}
            </div>
            {count.current > 0 && (
              <span className="text-[11px] text-[#9B9A97]">
                {domainProgress.highConfidence > 0 && `${domainProgress.highConfidence} strong`}
                {domainProgress.lowConfidence > 0 && ` · ${domainProgress.lowConfidence} needs work`}
              </span>
            )}
          </div>

          {/* Suggested next action */}
          {suggestedTopic && (
            <button
              onClick={() => onTopicSelect(suggestedTopic.id)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#2383E2] hover:text-[#1A6DC0] transition-colors"
            >
              Continue: {suggestedTopic.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}

          {count.current === count.total && (
            <span className="text-[13px] font-medium text-[#0F7B6C]">
              Domain complete
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function generateDomainAssessment(
  count: { current: number; total: number },
  progress: DomainProgress
): string {
  if (count.current === 0) {
    return "Start exploring this domain to uncover insights about your readiness.";
  }

  const coverage = count.current / count.total;
  const highRatio = progress.highConfidence / count.current;

  if (coverage === 1) {
    if (highRatio >= 0.6) {
      return "Strong foundation across this domain. Your inputs show clear, data-backed thinking.";
    } else if (progress.lowConfidence > 0) {
      return `All topics explored, but ${progress.lowConfidence} area${progress.lowConfidence > 1 ? 's' : ''} could use more specifics.`;
    }
    return "Good coverage of this domain. Consider revisiting medium-confidence areas.";
  }

  if (coverage >= 0.6) {
    if (highRatio >= 0.5) {
      return `Solid progress with strong insights captured. ${count.total - count.current} topics remaining.`;
    }
    return `Making good progress. Strengthen your responses with specific data or examples.`;
  }

  return `Early exploration phase. Keep going to build a complete picture of this domain.`;
}
