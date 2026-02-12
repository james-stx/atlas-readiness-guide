'use client';

import { useState, useEffect } from 'react';
import { Compass, MessageSquare, LayoutGrid, Clock, Cloud, X, Check, Circle, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DomainType } from '@atlas/types';
import type { DomainProgress } from '@/lib/progress';

interface DomainSummary {
  key: DomainType;
  label: string;
  status: 'not_started' | 'in_progress' | 'adequate';
  covered: number;
  total: number;
}

interface WelcomeModalProps {
  onChooseGuided: () => void;
  onChooseExplore: () => void;
  onContinue?: () => void;
  isReturningUser?: boolean;
  progress?: number;
  domainSummaries?: DomainSummary[];
  lastDomain?: string;
}

const STORAGE_KEY = 'atlas-onboarding-complete';

export function WelcomeModal({
  onChooseGuided,
  onChooseExplore,
  onContinue,
  isReturningUser = false,
  progress = 0,
  domainSummaries = [],
  lastDomain,
}: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding before
    const hasCompletedOnboarding = localStorage.getItem(STORAGE_KEY);
    if (!hasCompletedOnboarding || isReturningUser) {
      setIsVisible(true);
    }
  }, [isReturningUser]);

  const handleGuided = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    onChooseGuided();
  };

  const handleExplore = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    onChooseExplore();
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    onChooseExplore(); // Default to explore mode on dismiss
  };

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    if (onContinue) {
      onContinue();
    } else {
      onChooseExplore();
    }
  };

  // Calculate remaining time estimate (roughly 4 min per topic, 25 topics total)
  const remainingTopics = 25 - Math.round((progress / 100) * 25);
  const remainingMinutes = remainingTopics * 4;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl animate-slide-up"
        role="dialog"
        aria-labelledby="welcome-title"
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 text-[#9B9A97] hover:text-[#37352F] transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-4 text-center border-b border-[#F1F0EC]">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#37352F]">
              <Compass className="h-6 w-6 text-white" />
            </div>
          </div>

          <h2 id="welcome-title" className="text-xl font-semibold text-[#37352F] mb-2">
            {isReturningUser ? 'Welcome back!' : 'Welcome to Atlas'}
          </h2>

          <p className="text-[14px] text-[#5C5A56] leading-relaxed">
            {isReturningUser
              ? `You're ${progress}% through your assessment. Let's continue where you left off.`
              : "We'll help you assess your U.S. expansion readiness across 5 key areas."}
          </p>
        </div>

        {/* Assessment overview (for new users) */}
        {!isReturningUser && (
          <div className="px-6 py-4 border-b border-[#F1F0EC]">
            <div className="grid grid-cols-3 gap-2 text-center">
              {['Market', 'Product', 'GTM'].map((domain) => (
                <div
                  key={domain}
                  className="py-2 px-3 rounded-lg bg-[#F7F6F3] text-[12px] font-medium text-[#5C5A56]"
                >
                  {domain}
                </div>
              ))}
              {['Operations', 'Financials'].map((domain) => (
                <div
                  key={domain}
                  className="py-2 px-3 rounded-lg bg-[#F7F6F3] text-[12px] font-medium text-[#5C5A56]"
                >
                  {domain}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress overview (for returning users) */}
        {isReturningUser && domainSummaries.length > 0 && (
          <div className="px-6 py-4 border-b border-[#F1F0EC]">
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-[#5C5A56]">Overall Progress</span>
                <span className="text-[12px] font-medium text-[#37352F]">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8E6E1]">
                <div
                  className="h-full rounded-full bg-[#2383E2] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Domain status list */}
            <div className="space-y-2">
              {domainSummaries.map((domain) => {
                // Determine status based on actual completion, not "adequate" threshold
                const isComplete = domain.covered === domain.total && domain.total > 0;
                const isInProgress = domain.covered > 0 && domain.covered < domain.total;
                const isNotStarted = domain.covered === 0;

                return (
                  <div
                    key={domain.key}
                    className="flex items-center justify-between py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      {/* Status indicator - matches TopicCard styling */}
                      <span className={cn(
                        'inline-flex items-center justify-center h-5 w-5 rounded border',
                        isComplete && 'border-[#0F7B6C] bg-transparent',
                        isInProgress && 'border-[#E9B949] bg-transparent',
                        isNotStarted && 'border-[#D4D1CB] bg-transparent'
                      )}>
                        {isComplete ? (
                          <Check className="h-3 w-3 text-[#0F7B6C]" />
                        ) : isInProgress ? (
                          <Loader2 className="h-3 w-3 text-[#9A6700] animate-spin" />
                        ) : (
                          <Circle className="h-3 w-3 text-[#9B9A97]" />
                        )}
                      </span>
                      <span className={cn(
                        'text-[13px]',
                        isComplete ? 'text-[#37352F] font-medium' : 'text-[#5C5A56]'
                      )}>
                        {domain.label}
                      </span>
                    </div>
                    <span className={cn(
                      'text-[12px]',
                      isComplete ? 'text-[#0F7B6C] font-medium' : 'text-[#9B9A97]'
                    )}>
                      {domain.covered}/{domain.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info badges */}
        <div className="px-6 py-4 border-b border-[#F1F0EC]">
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-1.5 text-[12px] text-[#787774]">
              <Clock className="h-3.5 w-3.5" />
              <span>{isReturningUser ? `~${remainingMinutes} min left` : '20-30 min'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#787774]">
              <Cloud className="h-3.5 w-3.5" />
              <span>Auto-saved</span>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="p-6">
          {isReturningUser ? (
            <>
              {/* Continue button for returning users */}
              <button
                onClick={handleContinue}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg',
                  'bg-[#2383E2] text-white font-medium hover:bg-[#1A6DC0] transition-colors'
                )}
              >
                <Play className="h-4 w-4" />
                Continue{lastDomain ? ` with ${lastDomain}` : ''}
              </button>

              <p className="text-[12px] text-[#9B9A97] text-center mt-3">
                or{' '}
                <button
                  onClick={handleExplore}
                  className="text-[#2383E2] hover:underline"
                >
                  browse all topics
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="text-[13px] text-[#9B9A97] text-center mb-4">
                How would you like to proceed?
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* Guide me option */}
                <button
                  onClick={handleGuided}
                  className={cn(
                    'flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all',
                    'border-[#2383E2] bg-[#F7FBFF] hover:bg-[#EBF5FF]'
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2383E2]">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="block text-[14px] font-medium text-[#37352F]">
                      Guide me
                    </span>
                    <span className="block text-[11px] text-[#5C5A56] mt-0.5">
                      Recommended
                    </span>
                  </div>
                </button>

                {/* Explore option */}
                <button
                  onClick={handleExplore}
                  className={cn(
                    'flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all',
                    'border-[#E8E6E1] hover:border-[#D4D1CB] hover:bg-[#FAF9F7]'
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F6F3]">
                    <LayoutGrid className="h-5 w-5 text-[#5C5A56]" />
                  </div>
                  <div className="text-center">
                    <span className="block text-[14px] font-medium text-[#37352F]">
                      Let me explore
                    </span>
                    <span className="block text-[11px] text-[#9B9A97] mt-0.5">
                      Self-guided
                    </span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
