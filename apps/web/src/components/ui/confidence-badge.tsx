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
    icon: '●',
    label: 'High',
  },
  medium: {
    bg: 'bg-confidence-medium-bg',
    text: 'text-confidence-medium-text',
    icon: '◐',
    label: 'Medium',
  },
  low: {
    bg: 'bg-confidence-low-bg',
    text: 'text-confidence-low-text',
    icon: '○',
    label: 'Low',
  },
  not_started: {
    bg: 'bg-transparent',
    text: 'text-[var(--text-tertiary)]',
    icon: '—',
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
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-caption font-medium',
        c.bg,
        c.text,
        animate && 'animate-badge-appear',
        className
      )}
    >
      <span className="text-[8px] leading-none">{c.icon}</span>
      {c.label}
    </span>
  );
}
