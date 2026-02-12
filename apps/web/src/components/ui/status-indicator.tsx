'use client';

import { cn } from '@/lib/utils';
import type { ConfidenceLevel } from '@atlas/types';

/**
 * Unified status indicator system
 *
 * Topic Status:
 * - not_started: Empty circle (○)
 * - in_progress: Half-filled circle (◐) - started but not yet captured
 * - complete: Checkmark (✓) or filled circle
 *
 * Confidence Level (for completed topics):
 * - high: Green - strong, data-backed response
 * - medium: Orange - clear but general
 * - low: Red with warning - needs attention
 */

export type TopicStatus = 'not_started' | 'in_progress' | 'complete';

interface StatusIndicatorProps {
  status: TopicStatus;
  confidence?: ConfidenceLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { icon: 14, text: 'text-[11px]' },
  md: { icon: 16, text: 'text-[12px]' },
  lg: { icon: 18, text: 'text-[13px]' },
};

const confidenceColors = {
  high: {
    fill: '#35A552',
    label: 'Strong',
    textColor: 'text-[#0F7B6C]',
  },
  medium: {
    fill: '#CB7B3E',
    label: 'Developing',
    textColor: 'text-[#D9730D]',
  },
  low: {
    fill: '#E03E3E',
    label: 'Needs attention',
    textColor: 'text-[#E03E3E]',
  },
};

export function StatusIndicator({
  status,
  confidence,
  size = 'md',
  showLabel = false,
  className,
}: StatusIndicatorProps) {
  const s = sizeConfig[size];

  // Not started - empty circle
  if (status === 'not_started') {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        <svg width={s.icon} height={s.icon} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#CDCDCA" strokeWidth="1.5" />
        </svg>
        {showLabel && (
          <span className={cn(s.text, 'text-[#9B9A97]')}>Not started</span>
        )}
      </div>
    );
  }

  // In progress - half circle
  if (status === 'in_progress') {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        <svg width={s.icon} height={s.icon} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#CB7B3E" strokeWidth="1.5" />
          <path
            d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14"
            fill="#CB7B3E"
          />
        </svg>
        {showLabel && (
          <span className={cn(s.text, 'text-[#CB7B3E]')}>In progress</span>
        )}
      </div>
    );
  }

  // Complete - show confidence-colored checkmark or warning
  const conf = confidence ? confidenceColors[confidence] : confidenceColors.medium;

  // Low confidence gets a warning indicator
  if (confidence === 'low') {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        <svg width={s.icon} height={s.icon} viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2L14 13H2L8 2Z"
            stroke={conf.fill}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M8 6V9"
            stroke={conf.fill}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11" r="0.75" fill={conf.fill} />
        </svg>
        {showLabel && (
          <span className={cn(s.text, conf.textColor)}>{conf.label}</span>
        )}
      </div>
    );
  }

  // High/Medium confidence - checkmark
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 16 16" fill="none">
        <path
          d="M13 5L6.5 11.5L3 8"
          stroke={conf.fill}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showLabel && (
        <span className={cn(s.text, conf.textColor)}>{conf.label}</span>
      )}
    </div>
  );
}

/**
 * Confidence dots indicator (3 dots showing confidence level)
 */
interface ConfidenceDotsProps {
  level: ConfidenceLevel;
  size?: 'sm' | 'md';
  className?: string;
}

export function ConfidenceDots({ level, size = 'md', className }: ConfidenceDotsProps) {
  const filled = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            dotSize,
            'rounded-full',
            i <= filled ? 'bg-[#37352F]' : 'border border-[#D4D1CB]'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Domain status dot (used in sidebar)
 */
interface DomainStatusDotProps {
  status: 'not_started' | 'in_progress' | 'adequate';
  size?: number;
  className?: string;
}

const domainStatusColors = {
  adequate: '#35A552',     // Green - complete
  in_progress: '#CB7B3E',  // Orange - in progress
  not_started: '#91918E',  // Gray - not started
};

export function DomainStatusDot({ status, size = 8, className }: DomainStatusDotProps) {
  return (
    <span
      className={cn('rounded-full', className)}
      style={{
        width: size,
        height: size,
        backgroundColor: domainStatusColors[status],
      }}
    />
  );
}
