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
    bgColor: 'bg-confidence-high-bg',
    textColor: 'text-confidence-high-text',
    borderColor: 'border-confidence-high-border',
  },
  medium: {
    label: 'Medium confidence',
    shortLabel: 'Medium',
    bgColor: 'bg-confidence-medium-bg',
    textColor: 'text-confidence-medium-text',
    borderColor: 'border-confidence-medium-border',
  },
  low: {
    label: 'Low confidence',
    shortLabel: 'Low',
    bgColor: 'bg-confidence-low-bg',
    textColor: 'text-confidence-low-text',
    borderColor: 'border-confidence-low-border',
  },
};

function ConfidenceIcon({ confidence, className }: { confidence: ConfidenceLevel; className?: string }) {
  const iconColor = {
    high: 'text-confidence-high',
    medium: 'text-confidence-medium',
    low: 'text-confidence-low',
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
