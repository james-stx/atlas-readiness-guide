'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';

// ─── Tour step definitions ────────────────────────────────────────────────────

type Position = 'top' | 'bottom' | 'left' | 'right';

interface TourStep {
  id: string;
  title: string;
  description: string;
  position: Position;
  padding?: number;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'tour-sidebar',
    title: 'Your 5 Assessment Domains',
    description:
      'Atlas covers 5 key areas of your U.S. expansion: Market, Product, Go-to-Market, Operations, and Financials. Select any domain to explore its topics.',
    position: 'right',
    padding: 10,
  },
  {
    id: 'tour-documents',
    title: 'Upload Your Documents',
    description:
      'Have a pitch deck, business plan, or GTM strategy? Upload it here and Atlas will automatically extract relevant insights — saving you time on topics already covered in your docs.',
    position: 'right',
    padding: 10,
  },
  {
    id: 'tour-domain-insight',
    title: 'Domain Overview & Insights',
    description:
      'Each domain shows your coverage progress and surfaces AI-generated insights as you complete topics. Use "Continue" to jump to your next unanswered topic.',
    position: 'bottom',
    padding: 8,
  },
  {
    id: 'tour-ask-atlas',
    title: 'Chat with Atlas',
    description:
      'Open the chat panel to talk with Atlas. It will ask you questions, capture your answers automatically, and give you real-time feedback on each topic.',
    position: 'bottom',
    padding: 8,
  },
  {
    id: 'tour-topic-cards',
    title: 'Topic Cards',
    description:
      'Each card is one topic within the domain. Discuss it with Atlas, write your own response, or skip it. Completed topics show a confidence score.',
    position: 'left',
    padding: 8,
  },
  {
    id: 'tour-report',
    title: 'Your Readiness Report',
    description:
      'Once you have covered enough topics, Atlas generates a personalised Readiness Report — your detailed U.S. expansion roadmap with strengths, gaps, and next steps.',
    position: 'top',
    padding: 8,
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const currentStep = TOUR_STEPS[step];
  const total = TOUR_STEPS.length;
  const isLast = step === total - 1;

  const measureStep = useCallback((stepIndex: number) => {
    const el = document.querySelector<HTMLElement>(
      `[data-tour-id="${TOUR_STEPS[stepIndex].id}"]`
    );
    if (!el) {
      // Element not present (e.g. documents section hidden for guests) — skip this step
      const next = stepIndex + 1;
      if (next < TOUR_STEPS.length) {
        setStep(next);
      } else {
        onComplete();
      }
      return;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Wait for scroll + re-layout before measuring
    setTimeout(() => {
      setRect(el.getBoundingClientRect());
    }, 350);
  }, [onComplete]);

  useEffect(() => {
    measureStep(step);
  }, [step, measureStep]);

  // Re-measure on window resize
  useEffect(() => {
    const onResize = () => measureStep(step);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [step, measureStep]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const padding = currentStep.padding ?? 8;

  return (
    <>
      {/* ── SVG overlay with spotlight cutout ── */}
      {rect && (
        <svg
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9998, width: '100vw', height: '100vh' }}
          aria-hidden="true"
        >
          <defs>
            <mask id="tour-spotlight-mask">
              {/* White = visible (dimmed); black = transparent (spotlight) */}
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={rect.left - padding}
                y={rect.top - padding}
                width={rect.width + padding * 2}
                height={rect.height + padding * 2}
                rx={10}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.62)"
            mask="url(#tour-spotlight-mask)"
          />
        </svg>
      )}

      {/* ── Tooltip card ── */}
      {rect && (
        <div
          style={{
            position: 'fixed',
            zIndex: 9999,
            width: 300,
            ...getTooltipStyle(rect, currentStep.position, padding),
          }}
          className="bg-white rounded-xl shadow-2xl p-5"
          role="dialog"
          aria-label={`Tour step ${step + 1} of ${total}: ${currentStep.title}`}
        >
          {/* Step counter */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9B9A97] mb-2">
            {step + 1} / {total}
          </p>

          {/* Progress dots */}
          <div className="flex gap-1.5 mb-3">
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === step
                    ? 'w-4 bg-[#2383E2]'
                    : i < step
                    ? 'w-1.5 bg-[#2383E2]/40'
                    : 'w-1.5 bg-[#E8E6E1]'
                }`}
              />
            ))}
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-semibold text-[#37352F] mb-1.5">
            {currentStep.title}
          </h3>

          {/* Description */}
          <p className="text-[13px] text-[#5C5A56] leading-relaxed mb-4">
            {currentStep.description}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              className="flex-1 py-2 px-4 rounded-lg bg-[#2383E2] text-white text-[13px] font-medium hover:bg-[#1A6DC0] transition-colors"
            >
              {isLast ? 'Done' : 'Next →'}
            </button>
            <button
              onClick={onComplete}
              className="py-2 px-4 rounded-lg bg-[#F7F6F3] text-[#5C5A56] text-[13px] font-medium hover:bg-[#E8E6E1] transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Tooltip positioning helper ───────────────────────────────────────────────

const TOOLTIP_WIDTH = 300;
const TOOLTIP_EST_HEIGHT = 220;
const GAP = 14;
const EDGE = 12;

function getTooltipStyle(
  rect: DOMRect,
  position: Position,
  padding: number
): CSSProperties {
  const clampLeft = (v: number) =>
    Math.max(EDGE, Math.min(v, window.innerWidth - TOOLTIP_WIDTH - EDGE));
  const clampTop = (v: number) =>
    Math.max(EDGE, Math.min(v, window.innerHeight - TOOLTIP_EST_HEIGHT - EDGE));

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  switch (position) {
    case 'right':
      return {
        left: rect.right + padding + GAP,
        top: clampTop(cy - TOOLTIP_EST_HEIGHT / 2),
      };
    case 'left':
      return {
        left: Math.max(EDGE, rect.left - padding - GAP - TOOLTIP_WIDTH),
        top: clampTop(cy - TOOLTIP_EST_HEIGHT / 2),
      };
    case 'bottom':
      return {
        top: rect.bottom + padding + GAP,
        left: clampLeft(cx - TOOLTIP_WIDTH / 2),
      };
    case 'top':
      return {
        top: Math.max(EDGE, rect.top - padding - GAP - TOOLTIP_EST_HEIGHT),
        left: clampLeft(cx - TOOLTIP_WIDTH / 2),
      };
  }
}
