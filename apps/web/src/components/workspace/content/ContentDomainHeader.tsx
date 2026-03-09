'use client';

import { useState, useEffect } from 'react';
import type { DomainType } from '@atlas/types';
import { DOMAINS, DOMAIN_TOPICS, type DomainProgress } from '@/lib/progress';
import { ArrowRight, Sparkles, TrendingUp, AlertCircle, ChevronUp, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDomainInsight, type DomainInsight } from '@/lib/context/domain-insight-context';
import { useWorkspace } from '@/lib/context/workspace-context';

interface ContentDomainHeaderProps {
  domain: DomainType;
  count: { current: number; total: number };
  domainProgress: DomainProgress;
  onTopicSelect: (topicId: string) => void;
}

const DOMAIN_ORDER: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

const READINESS_CONFIG = {
  strong: { label: 'Strong', bg: '#F0FDF4', text: '#0F7B6C', border: '#A3E6CB' },
  developing: { label: 'Developing', bg: '#FFFBEB', text: '#9A6700', border: '#FDE68A' },
  early: { label: 'Early Stage', bg: '#F7F6F3', text: '#5C5A56', border: '#E8E6E1' },
};

export function ContentDomainHeader({
  domain,
  count,
  domainProgress,
  onTopicSelect,
}: ContentDomainHeaderProps) {
  const domainInfo = DOMAINS.find((d) => d.key === domain);
  const label = domainInfo?.label ?? domain;
  const topics = DOMAIN_TOPICS[domain];

  const {
    entries,
    generatingDomain,
    newlyReadyDomain,
    isStale,
    isNew,
    markViewed,
    refreshInsight,
    dismissNew,
  } = useDomainInsight();
  const { selectDomain, openChat, switchToReport } = useWorkspace();

  const [expanded, setExpanded] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);

  // Fire card-highlight animation when this domain's insight arrives
  useEffect(() => {
    if (newlyReadyDomain === domain) {
      setIsHighlighting(true);
      const timer = setTimeout(() => {
        setIsHighlighting(false);
        dismissNew();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [newlyReadyDomain, domain, dismissNew]);

  // Find suggested next topic (first uncovered)
  const suggestedTopic = topics.find(
    (t) => !domainProgress.coveredTopics.includes(t.id)
  );

  const assessment = generateDomainAssessment(count, domainProgress);

  const entry = entries[domain];
  const insight = entry?.insight;
  const stale = isStale(domain);
  const hasNewInsight = isNew(domain);

  // Next domain navigation helpers
  const domainIdx = DOMAIN_ORDER.indexOf(domain);
  const nextDomain = DOMAIN_ORDER[domainIdx + 1] ?? null;
  const isLastDomain = !nextDomain;

  const handleExpand = () => {
    setExpanded(true);
    markViewed(domain);
  };

  const handleContinue = () => {
    setExpanded(false);
    if (nextDomain) {
      selectDomain(nextDomain);
      openChat(nextDomain);
    } else {
      switchToReport();
    }
  };

  return (
    <div>
      {/* Title row */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <h2 className="text-[22px] font-semibold text-[#37352F]">
          {label} Insights
        </h2>
        <span className="text-[13px] tabular-nums text-[#9B9A97]">
          {count.current}/{count.total} topics
        </span>
      </div>

      {/* Domain Summary Card — three states */}
      {generatingDomain === domain ? (
        <LoadingCard count={count} />
      ) : entry && insight ? (
        <InsightBanner
          insight={insight}
          count={count}
          expanded={expanded}
          isHighlighting={isHighlighting}
          hasNewInsight={hasNewInsight}
          isStale={stale}
          onExpand={handleExpand}
          onCollapse={() => setExpanded(false)}
          onContinue={handleContinue}
          onRefresh={() => refreshInsight(domain)}
          nextDomainLabel={nextDomain ? DOMAIN_LABELS[nextDomain] : null}
          isLastDomain={isLastDomain}
        />
      ) : (
        /* Base assessment card */
        <div className="rounded-lg border border-[#E8E6E1] bg-[#FAF9F7] overflow-hidden">
          <div className="p-4">
            {/* Assessment sentence */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8E6E1]">
                <Sparkles className="h-4 w-4 text-[#5C5A56]" />
              </div>
              <p className="text-[14px] leading-relaxed text-[#37352F] pt-1">
                {assessment}
              </p>
            </div>

            {/* Action row */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E8E6E1]">
              <div className="flex items-center gap-2">
                {count.current > 0 && (
                  <span className="text-[12px] text-[#9B9A97]">
                    {domainProgress.highConfidence > 0 && (
                      <span className="text-[#0F7B6C]">{domainProgress.highConfidence} high</span>
                    )}
                    {domainProgress.mediumConfidence > 0 && (
                      <span className="text-[#9A6700]">
                        {domainProgress.highConfidence > 0 && ' · '}
                        {domainProgress.mediumConfidence} medium
                      </span>
                    )}
                    {domainProgress.lowConfidence > 0 && (
                      <span className="text-[#E03E3E]">
                        {(domainProgress.highConfidence > 0 || domainProgress.mediumConfidence > 0) && ' · '}
                        {domainProgress.lowConfidence} low
                      </span>
                    )}
                    <span className="text-[#9B9A97]"> confidence</span>
                  </span>
                )}
              </div>

              {count.current === count.total && !entry ? (
                <button
                  onClick={() => refreshInsight(domain)}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-[#2383E2] hover:text-[#1A6DC0] transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate summary
                </button>
              ) : suggestedTopic ? (
                <button
                  onClick={() => onTopicSelect(suggestedTopic.id)}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-[#2383E2] hover:text-[#1A6DC0] transition-colors"
                >
                  Continue: {suggestedTopic.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : count.current === count.total ? (
                <span className="text-[13px] font-medium text-[#0F7B6C]">
                  All topics covered
                </span>
              ) : null}
            </div>
          </div>

          {/* Progress bar — flush at bottom */}
          <ChapterProgressBar current={count.current} total={count.total} />
        </div>
      )}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ChapterProgressBar({
  current,
  total,
  paused = false,
}: {
  current: number;
  total: number;
  paused?: boolean;
}) {
  const isComplete = current >= total;
  const pct = Math.min((current / total) * 100, 100);

  return (
    <div className="h-2 bg-[#E8E6E1]">
      <div
        className={cn(
          'h-full transition-all duration-700 ease-out',
          isComplete ? 'animate-shimmer' : 'bg-[#2383E2]'
        )}
        style={
          isComplete
            ? {
                width: '100%',
                background: 'linear-gradient(90deg, #1A6DC0 0%, #2383E2 30%, #93C5FD 50%, #2383E2 70%, #1A6DC0 100%)',
                backgroundSize: '200% 100%',
                animationPlayState: paused ? 'paused' : 'running',
              }
            : { width: `${pct}%` }
        }
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingCard({ count }: { count: { current: number; total: number } }) {
  return (
    <div className="rounded-lg border border-[#BFDBFE] bg-[#F0F7FF] overflow-hidden animate-card-highlight">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#BFDBFE]">
            <Loader2 className="h-4 w-4 text-[#2383E2] animate-spin" />
          </div>
          <p className="text-[14px] text-[#2383E2] font-medium">
            Generating chapter summary…
          </p>
        </div>
        <div className="space-y-2 pl-11">
          <div className="h-3 rounded bg-[#BFDBFE]/60 w-3/4 animate-pulse" />
          <div className="h-3 rounded bg-[#BFDBFE]/60 w-1/2 animate-pulse" />
        </div>
      </div>
      <ChapterProgressBar current={count.current} total={count.total} />
    </div>
  );
}

interface InsightBannerProps {
  insight: DomainInsight;
  count: { current: number; total: number };
  expanded: boolean;
  isHighlighting: boolean;
  hasNewInsight: boolean;
  isStale: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onContinue: () => void;
  onRefresh: () => void;
  nextDomainLabel: string | null;
  isLastDomain: boolean;
}

function InsightBanner({
  insight,
  count,
  expanded,
  isHighlighting,
  hasNewInsight,
  isStale,
  onExpand,
  onCollapse,
  onContinue,
  onRefresh,
  nextDomainLabel,
  isLastDomain,
}: InsightBannerProps) {
  const readiness = READINESS_CONFIG[insight.readinessLevel];

  return (
    <div
      className={cn(
        'rounded-lg border overflow-hidden transition-colors duration-300',
        isHighlighting && 'animate-card-highlight',
        isStale
          ? 'border-[#FDE68A] bg-[#FFFBEB]/50'
          : 'border-[#93C5FD] bg-[#DBEAFE]'
      )}
    >
      {/* Compact row */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#BFDBFE]">
          <Sparkles className="h-4 w-4 text-[#2383E2]" />
        </div>

        {/* Label + readiness badge */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-[14px] font-medium text-[#37352F] truncate">
            Chapter Summary
          </span>
          <span className="text-[11px] text-[#5C5A56] shrink-0">Confidence level</span>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold border"
            style={{
              background: readiness.bg,
              color: readiness.text,
              borderColor: readiness.border,
            }}
          >
            {readiness.label}
          </span>
        </div>

        {/* Status indicator */}
        {isStale ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#D9730D] animate-pulse" />
            <span className="text-[12px] text-[#D9730D]">Updated since</span>
            <button
              onClick={onRefresh}
              className="flex items-center gap-1 text-[12px] font-medium text-[#D9730D] hover:text-[#B85E00] transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
        ) : hasNewInsight ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#2383E2] animate-pulse-subtle" />
            <span className="text-[12px] font-medium text-[#2383E2]">NEW</span>
          </div>
        ) : null}

        {/* View / Collapse toggle */}
        {!expanded ? (
          <button
            onClick={onExpand}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#2383E2] hover:text-[#1A6DC0] transition-colors shrink-0"
          >
            View summary
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={onCollapse}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#5C5A56] hover:text-[#37352F] transition-colors shrink-0"
          >
            <ChevronUp className="h-3.5 w-3.5" />
            Collapse
          </button>
        )}
      </div>

      {/* Progress bar — pauses shimmer when expanded */}
      <ChapterProgressBar current={count.current} total={count.total} paused={expanded} />

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 animate-expand-down">
          {/* Headline + narrative */}
          <div className="pt-4 mb-4">
            <p className="text-[17px] font-semibold text-[#37352F] leading-snug mb-2">
              {insight.headline}
            </p>
            <p className="text-[14px] text-[#5C5A56] leading-relaxed">
              {insight.narrative}
            </p>
          </div>

          {/* Strengths + Gaps columns */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-[#0F7B6C]" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0F7B6C]">
                  Strengths
                </span>
              </div>
              <ul className="space-y-1.5">
                {insight.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="text-[13px] text-[#37352F] leading-snug border-l-2 border-[#A3E6CB] pl-2"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="h-3.5 w-3.5 text-[#9A6700]" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#9A6700]">
                  To Watch
                </span>
              </div>
              <ul className="space-y-1.5">
                {insight.gaps.map((g, i) => (
                  <li
                    key={i}
                    className="text-[13px] text-[#37352F] leading-snug border-l-2 border-[#FDE68A] pl-2"
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended next step */}
          <div className="rounded-lg bg-white border border-[#BFDBFE] px-4 py-3 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#2383E2] block mb-1">
              Recommended next step
            </span>
            <p className="text-[13px] text-[#37352F] leading-snug">{insight.nextStep}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onContinue}
              className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[#2383E2] text-white font-medium text-[13px] hover:bg-[#1A6DC0] transition-colors"
            >
              {isLastDomain ? (
                'Continue to Report'
              ) : (
                <>
                  Continue to {nextDomainLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
            <button
              onClick={onCollapse}
              className="flex items-center gap-1.5 text-[13px] text-[#9B9A97] hover:text-[#5C5A56] transition-colors"
            >
              <ChevronUp className="h-3.5 w-3.5" />
              Collapse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Domain assessment fallback text ─────────────────────────────────────────

function generateDomainAssessment(
  count: { current: number; total: number },
  progress: DomainProgress
): string {
  const remaining = count.total - count.current;

  if (count.current === 0) {
    return 'Start exploring this domain to uncover insights about your readiness.';
  }

  const highRatio = count.current > 0 ? progress.highConfidence / count.current : 0;

  if (remaining === 0) {
    if (highRatio >= 0.6) {
      return 'Strong foundation across this domain. Your inputs show clear, data-backed thinking.';
    } else if (progress.lowConfidence > 0) {
      return `All topics covered, but ${progress.lowConfidence} area${progress.lowConfidence > 1 ? 's' : ''} could use more specifics.`;
    }
    return 'Good coverage of this domain. Consider strengthening medium-confidence areas.';
  }

  if (remaining === 1) {
    return `Almost there! ${remaining} topic remaining to complete this domain.`;
  }

  if (count.current >= 3) {
    if (highRatio >= 0.5) {
      return `Good progress with solid insights. ${remaining} topics remaining.`;
    }
    return `Making progress. ${remaining} topics to go - strengthen responses with specifics.`;
  }

  return `Early exploration phase. ${remaining} topics remaining in this domain.`;
}
