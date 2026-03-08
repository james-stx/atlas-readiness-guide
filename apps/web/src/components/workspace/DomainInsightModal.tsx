'use client';

import { X, TrendingUp, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DomainType } from '@atlas/types';

export interface DomainInsight {
  domain: DomainType;
  readinessLevel: 'strong' | 'developing' | 'early';
  headline: string;
  narrative: string;
  strengths: string[];
  gaps: string[];
  nextStep: string;
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
  strong: {
    label: 'Strong',
    bg: '#F0FDF4',
    text: '#0F7B6C',
    border: '#A3E6CB',
  },
  developing: {
    label: 'Developing',
    bg: '#FFFBEB',
    text: '#9A6700',
    border: '#FDE68A',
  },
  early: {
    label: 'Early Stage',
    bg: '#F7F6F3',
    text: '#5C5A56',
    border: '#E8E6E1',
  },
};

interface DomainInsightModalProps {
  domain: DomainType;
  insight: DomainInsight | null;
  isLoading: boolean;
  onContinue: () => void;
  onDismiss: () => void;
}

function SkeletonLine({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
  return (
    <div className={cn('rounded bg-[#E8E6E1] animate-pulse', width, height)} />
  );
}

export function DomainInsightModal({
  domain,
  insight,
  isLoading,
  onContinue,
  onDismiss,
}: DomainInsightModalProps) {
  const chapterNumber = DOMAIN_ORDER.indexOf(domain) + 1;
  const domainLabel = DOMAIN_LABELS[domain];
  const nextDomain = DOMAIN_ORDER[chapterNumber]; // undefined if last
  const isLastDomain = !nextDomain;
  const nextDomainLabel = nextDomain ? DOMAIN_LABELS[nextDomain] : null;
  const readiness = insight ? READINESS_CONFIG[insight.readinessLevel] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl animate-slide-up overflow-hidden"
        role="dialog"
        aria-labelledby="domain-insight-title"
      >
        {/* Header band */}
        <div className="bg-[#2383E2] px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 opacity-80" />
                <span className="text-[12px] font-medium opacity-80 uppercase tracking-wide">
                  Chapter {chapterNumber} of 5 complete
                </span>
              </div>
              <h2 id="domain-insight-title" className="text-[20px] font-semibold leading-tight">
                {domainLabel} Readiness
              </h2>
            </div>

            {/* Readiness badge */}
            {readiness && (
              <span
                className="shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold border"
                style={{ background: readiness.bg, color: readiness.text, borderColor: readiness.border }}
              >
                {readiness.label}
              </span>
            )}
            {isLoading && (
              <div className="shrink-0 rounded-full px-3 py-1 bg-white/20 w-20 h-7 animate-pulse" />
            )}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Headline + narrative */}
          <div>
            {isLoading ? (
              <div className="space-y-2">
                <SkeletonLine width="w-3/4" height="h-5" />
                <SkeletonLine />
                <SkeletonLine width="w-5/6" />
              </div>
            ) : insight ? (
              <>
                <p className="text-[17px] font-semibold text-[#37352F] leading-snug mb-2">
                  {insight.headline}
                </p>
                <p className="text-[14px] text-[#5C5A56] leading-relaxed">
                  {insight.narrative}
                </p>
              </>
            ) : null}
          </div>

          {/* Strengths + Gaps columns */}
          <div className="grid grid-cols-2 gap-3">
            {/* Strengths */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-[#0F7B6C]" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0F7B6C]">
                  Strengths
                </span>
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  <SkeletonLine height="h-3" />
                  <SkeletonLine width="w-4/5" height="h-3" />
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {insight?.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="text-[13px] text-[#37352F] leading-snug border-l-2 border-[#A3E6CB] pl-2"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Gaps */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="h-3.5 w-3.5 text-[#9A6700]" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#9A6700]">
                  To Watch
                </span>
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  <SkeletonLine height="h-3" />
                  <SkeletonLine width="w-4/5" height="h-3" />
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {insight?.gaps.map((g, i) => (
                    <li
                      key={i}
                      className="text-[13px] text-[#37352F] leading-snug border-l-2 border-[#FDE68A] pl-2"
                    >
                      {g}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Next Step */}
          <div className="rounded-lg bg-[#F0F7FF] border border-[#BFDBFE] px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#2383E2] block mb-1">
              Recommended next step
            </span>
            {isLoading ? (
              <SkeletonLine width="w-5/6" height="h-3" />
            ) : (
              <p className="text-[13px] text-[#37352F] leading-snug">{insight?.nextStep}</p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={onContinue}
            disabled={isLoading}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg',
              'bg-[#2383E2] text-white font-medium text-[14px]',
              'hover:bg-[#1A6DC0] transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLastDomain ? (
              <>Generate my Report</>
            ) : (
              <>
                Continue to {nextDomainLabel}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-center">
            <button
              onClick={onDismiss}
              className="text-[12px] text-[#9B9A97] hover:text-[#5C5A56] transition-colors"
            >
              I&apos;ll keep going
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
