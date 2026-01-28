'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, X, Menu } from 'lucide-react';
import Link from 'next/link';
import type { DomainType } from '@atlas/types';
import { DOMAINS, type ProgressState } from '@/lib/progress';

interface ProgressHeaderProps {
  progressState: ProgressState;
  currentDomain: DomainType;
  onViewDetails: () => void;
  onDomainClick?: (domain: DomainType) => void;
  className?: string;
}

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

export function ProgressHeader({
  progressState,
  currentDomain,
  onViewDetails,
  className,
}: ProgressHeaderProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const currentDomainLabel = DOMAIN_LABELS[currentDomain];
  const currentDomainIndex = DOMAINS.findIndex((d) => d.key === currentDomain) + 1;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 bg-white/80 backdrop-blur-sm border-b border-neutral-100 z-40',
          className
        )}
      >
        {/* Desktop layout */}
        <div className="hidden sm:flex items-center justify-between h-14 px-6 max-w-7xl mx-auto">
          {/* Left: Logo + Exit */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-xs">A</span>
              </div>
            </Link>
            <button
              onClick={() => setShowExitConfirm(true)}
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              Exit
            </button>
          </div>

          {/* Center: Current domain indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">
              {currentDomainIndex} of 5
            </span>
            <span className="text-sm font-semibold text-neutral-900">
              {currentDomainLabel}
            </span>
          </div>

          {/* Right: Progress + View Details */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-900">
                {progressState.totalInputs}
              </span>
              <span className="text-xs text-neutral-500">
                input{progressState.totalInputs !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={onViewDetails}
              className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:ring-offset-2 rounded px-2 py-1 transition-colors"
              aria-expanded={false}
              aria-controls="readiness-panel"
              aria-label="View assessment details"
            >
              View Progress
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex sm:hidden items-center justify-between h-12 px-4">
          {/* Left: Exit */}
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Exit
          </button>

          {/* Center: Current domain */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400">{currentDomainIndex}/5</span>
            <span className="text-sm font-semibold text-neutral-900">
              {currentDomainLabel}
            </span>
          </div>

          {/* Right: Menu icon */}
          <button
            onClick={onViewDetails}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent-500/30 transition-colors"
            aria-label="View assessment details"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            onClick={() => setShowExitConfirm(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-elevated p-6 max-w-sm w-full">
            <button
              onClick={() => setShowExitConfirm(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Exit assessment?
            </h3>
            <p className="text-sm text-neutral-600 mb-6">
              Your progress is saved. You can return anytime using the link sent to your email.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Continue
              </button>
              <Link
                href="/"
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors text-center"
              >
                Exit
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
