'use client';

import { cn } from '@/lib/utils';
import type { ConfidenceLevel } from '@atlas/types';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel | 'not_started';
  className?: string;
  animate?: boolean;
}

const config = {
  high: {
    bg: 'bg-confidence-high-bg',
    text: 'text-confidence-high-text',
    label: 'High',
  },
  medium: {
    bg: 'bg-confidence-medium-bg',
    text: 'text-confidence-medium-text',
    label: 'Medium',
  },
  low: {
    bg: 'bg-confidence-low-bg',
    text: 'text-confidence-low-text',
    label: 'Low',
  },
  not_started: {
    bg: 'bg-warm-100',
    text: 'text-warm-500',
    label: 'Not Started',
  },
} as const;

export function ConfidenceBadge({
  level,
  className,
  animate = false,
}: ConfidenceBadgeProps) {
  const c = config[level];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-ws-caption',
        c.bg,
        c.text,
        animate && 'animate-badge-appear',
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}
