'use client';

import { useState, useEffect } from 'react';
import { Compass, MessageSquare, LayoutGrid, Clock, Cloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeModalProps {
  onChooseGuided: () => void;
  onChooseExplore: () => void;
  isReturningUser?: boolean;
  progress?: number;
}

const STORAGE_KEY = 'atlas-onboarding-complete';

export function WelcomeModal({
  onChooseGuided,
  onChooseExplore,
  isReturningUser = false,
  progress = 0,
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

        {/* Info badges */}
        <div className="px-6 py-4 border-b border-[#F1F0EC]">
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-1.5 text-[12px] text-[#787774]">
              <Clock className="h-3.5 w-3.5" />
              <span>20-30 min</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#787774]">
              <Cloud className="h-3.5 w-3.5" />
              <span>Auto-saved</span>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="p-6">
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
        </div>
      </div>
    </div>
  );
}
