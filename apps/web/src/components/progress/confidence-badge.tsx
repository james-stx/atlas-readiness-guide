'use client';

import { cn } from '@/lib/utils';
import type { ConfidenceLevel } from '@atlas/types';

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
  variant?: 'default' | 'compact';
  className?: string;
}

const confidenceConfig = {
  high: {
    label: 'High confidence',
    shortLabel: 'High',
    bgColor: 'bg-accent-50',
    textColor: 'text-accent-700',
    borderColor: 'border-accent-200',
  },
  medium: {
    label: 'Medium confidence',
    shortLabel: 'Medium',
    bgColor: 'bg-warm-50',
    textColor: 'text-warm-700',
    borderColor: 'border-warm-200',
  },
  low: {
    label: 'Low confidence',
    shortLabel: 'Low',
    bgColor: 'bg-neutral-100',
    textColor: 'text-neutral-600',
    borderColor: 'border-neutral-200',
  },
};

function ConfidenceIcon({ confidence, className }: { confidence: ConfidenceLevel; className?: string }) {
  const iconColor = {
    high: 'text-accent-600',
    medium: 'text-warm-600',
    low: 'text-neutral-500',
  }[confidence];

  if (confidence === 'high') {
    // Filled circle
    return (
      <svg width="8" height="8" viewBox="0 0 8 8" className={cn(iconColor, className)}>
        <circle cx="4" cy="4" r="4" fill="currentColor" />
      </svg>
    );
  }

  if (confidence === 'medium') {
    // Half-filled circle
    return (
      <svg width="8" height="8" viewBox="0 0 8 8" className={cn(iconColor, className)}>
        <path d="M4 0A4 4 0 0 0 4 8V0Z" fill="currentColor" />
        <circle cx="4" cy="4" r="3.5" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    );
  }

  // Low - empty circle
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" className={cn(iconColor, className)}>
      <circle cx="4" cy="4" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function ConfidenceBadge({
  confidence,
  variant = 'default',
  className,
}: ConfidenceBadgeProps) {
  const config = confidenceConfig[confidence];

  if (variant === 'compact') {
    // Icon only variant
    return (
      <div
        className={cn(
          'w-4 h-4 flex items-center justify-center rounded',
          config.bgColor,
          className
        )}
        title={config.label}
      >
        <ConfidenceIcon confidence={confidence} />
      </div>
    );
  }

  // Default - full badge with icon and text
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <ConfidenceIcon confidence={confidence} />
      <span>{config.shortLabel}</span>
    </span>
  );
}

export { ConfidenceIcon };
