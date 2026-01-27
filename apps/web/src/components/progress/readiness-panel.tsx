'use client';

import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, ArrowLeft, Sparkles } from 'lucide-react';
import type { DomainType, Input } from '@atlas/types';
import { ProgressRing } from './progress-ring';
import { DomainAccordion } from './domain-accordion';
import {
  DOMAINS,
  READINESS_CONFIG,
  getGapSuggestions,
  type ProgressState,
} from '@/lib/progress';

interface ReadinessPanelProps {
  isOpen: boolean;
  onClose: () => void;
  progressState: ProgressState;
  currentDomain: DomainType;
  inputs: Input[];
  onGenerateSnapshot: () => void;
  scrollToDomain?: DomainType | null;
  className?: string;
}

export function ReadinessPanel({
  isOpen,
  onClose,
  progressState,
  currentDomain,
  inputs,
  onGenerateSnapshot,
  scrollToDomain,
  className,
}: ReadinessPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const readinessConfig = READINESS_CONFIG[progressState.snapshotReadiness];
  const gapSuggestions = getGapSuggestions(progressState);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus close button when panel opens
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = panel.querySelectorAll(focusableSelector);
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Handle browser back button
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      onClose();
    };

    // Push a state so back button closes panel instead of navigating
    window.history.pushState({ panelOpen: true }, '');
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 transition-opacity duration-200',
          isOpen
            ? 'bg-slate-900/20 opacity-100'
            : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        id="readiness-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Assessment Progress"
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 bg-white border-l border-slate-200 shadow-[-4px_0_25px_-5px_rgba(0,0,0,0.1)]',
          'w-full sm:w-[400px]',
          'transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          className
        )}
      >
        {/* Fixed header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200">
          {/* Mobile back arrow / Desktop label */}
          <button
            onClick={onClose}
            className="sm:hidden w-11 h-11 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Close panel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-semibold text-slate-900">
            Assessment Progress
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label="Close assessment progress panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-[calc(100vh-56px)] px-4 py-6">
          {/* Overall Progress Card */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-6">
              <ProgressRing
                value={progressState.overallProgress}
                size="lg"
              />
              <div className="space-y-1.5">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {progressState.totalInputs}
                  </span>{' '}
                  input{progressState.totalInputs !== 1 ? 's' : ''} captured
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {progressState.domainsWithInputs}
                  </span>{' '}
                  of 5 domains covered
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {progressState.highConfidenceCount}
                  </span>{' '}
                  high confidence
                </p>
              </div>
            </div>
          </div>

          {/* Domain Accordions */}
          <div className="space-y-2 mb-6">
            {DOMAINS.map((domain) => (
              <DomainAccordion
                key={domain.key}
                domain={domain.key}
                label={domain.label}
                progress={progressState.domainProgress[domain.key]}
                inputs={inputs}
                defaultExpanded={domain.key === (scrollToDomain || currentDomain)}
              />
            ))}
          </div>

          {/* Snapshot Readiness */}
          <div className="border border-slate-200 rounded-xl p-5">
            {/* Status header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  readinessConfig.iconBgColor
                )}
              >
                {progressState.snapshotReadiness === 'excellent' ? (
                  <Sparkles className={cn('w-4 h-4', readinessConfig.color)} />
                ) : progressState.snapshotReadiness === 'good' ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className={readinessConfig.color}
                  >
                    <circle cx="8" cy="8" r="6" fill="currentColor" />
                  </svg>
                ) : progressState.snapshotReadiness === 'partial' ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className={readinessConfig.color}
                  >
                    <path d="M8 2A6 6 0 0 0 8 14V2Z" fill="currentColor" />
                    <circle
                      cx="8"
                      cy="8"
                      r="5.5"
                      stroke="currentColor"
                      strokeWidth="1"
                      fill="none"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className={readinessConfig.color}
                  >
                    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M8 2A6 6 0 0 0 2 8h6V2Z" fill="currentColor" />
                  </svg>
                )}
              </div>
              <h3
                className={cn(
                  'text-sm font-semibold uppercase tracking-wide',
                  readinessConfig.color
                )}
              >
                {readinessConfig.title}
              </h3>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              {readinessConfig.message}
            </p>

            {/* Gap suggestions */}
            {gapSuggestions.length > 0 &&
              progressState.snapshotReadiness !== 'excellent' && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-500 mb-2">
                    For even better insights:
                  </p>
                  <ul className="space-y-1">
                    {gapSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="text-xs text-slate-500 flex items-start gap-1.5"
                      >
                        <span className="text-slate-300 mt-0.5">•</span>
                        <span>
                          {suggestion.topic}{' '}
                          <span className="text-slate-400">
                            ({suggestion.domainLabel})
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Generate Snapshot button */}
            <button
              onClick={onGenerateSnapshot}
              className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
            >
              Generate Snapshot
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
