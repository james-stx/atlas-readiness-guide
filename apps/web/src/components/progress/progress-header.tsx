'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Menu } from 'lucide-react';
import type { DomainType } from '@atlas/types';
import { ProgressRing } from './progress-ring';
import { DomainPill } from './domain-pill';
import { DOMAINS, type ProgressState } from '@/lib/progress';

interface ProgressHeaderProps {
  progressState: ProgressState;
  currentDomain: DomainType;
  onViewDetails: () => void;
  onDomainClick?: (domain: DomainType) => void;
  className?: string;
}

export function ProgressHeader({
  progressState,
  currentDomain,
  onViewDetails,
  onDomainClick,
  className,
}: ProgressHeaderProps) {
  return (
    <header
      className={cn(
        'bg-white border-b border-slate-200 z-40',
        className
      )}
    >
      {/* Desktop layout */}
      <div className="hidden sm:flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
        {/* Left: Progress ring */}
        <ProgressRing value={progressState.overallProgress} size="md" />

        {/* Center: Domain pills */}
        <div className="flex items-center gap-2">
          {DOMAINS.map((domain) => (
            <DomainPill
              key={domain.key}
              domain={domain.key}
              label={domain.shortLabel}
              status={progressState.domainProgress[domain.key].status}
              isCurrent={domain.key === currentDomain}
              inputCount={progressState.domainProgress[domain.key].inputCount}
              onClick={() => onDomainClick?.(domain.key)}
              size="md"
            />
          ))}
        </div>

        {/* Right: View Details + input count */}
        <div className="flex flex-col items-end">
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 rounded px-2 py-1"
            aria-expanded={false}
            aria-controls="readiness-panel"
            aria-label="View assessment details"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 mr-1">
            {progressState.totalInputs} input{progressState.totalInputs !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex sm:hidden items-center justify-between h-14 px-4">
        {/* Left: Progress text */}
        <span className="text-base font-bold text-slate-900">
          {progressState.overallProgress}%
        </span>

        {/* Center: Domain pills (smaller) */}
        <div className="flex items-center gap-1.5">
          {DOMAINS.map((domain) => (
            <DomainPill
              key={domain.key}
              domain={domain.key}
              label={domain.shortLabel}
              status={progressState.domainProgress[domain.key].status}
              isCurrent={domain.key === currentDomain}
              inputCount={progressState.domainProgress[domain.key].inputCount}
              onClick={() => onDomainClick?.(domain.key)}
              size="sm"
            />
          ))}
        </div>

        {/* Right: Menu icon */}
        <button
          onClick={onViewDetails}
          className="w-11 h-11 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
          aria-label="View assessment details"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
