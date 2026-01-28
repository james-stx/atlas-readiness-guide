'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { ConfidenceLevel, DomainType } from '@atlas/types';
import { ConfidenceBadge } from './confidence-badge';

const domainLabels: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

export interface CapturedInputNotification {
  id: string;
  topicLabel: string;
  domain: DomainType;
  confidence: ConfidenceLevel;
  timestamp: number;
}

interface InputNotificationProps {
  notification: CapturedInputNotification;
  onDismiss: (id: string) => void;
  autoHideDuration?: number;
}

export function InputNotification({
  notification,
  onDismiss,
  autoHideDuration = 3000,
}: InputNotificationProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(notification.id), 200);
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss, autoHideDuration, isPaused]);

  // Handle keyboard dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExiting(true);
        setTimeout(() => onDismiss(notification.id), 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notification.id, onDismiss]);

  const confidenceIconBg = {
    high: 'bg-accent-50',
    medium: 'bg-warm-50',
    low: 'bg-neutral-100',
  }[notification.confidence];

  const checkColor = {
    high: 'text-accent-600',
    medium: 'text-warm-600',
    low: 'text-neutral-500',
  }[notification.confidence];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'w-[280px] bg-white border border-neutral-200 rounded-xl p-3 shadow-elevated',
        isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkmark icon */}
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            confidenceIconBg
          )}
        >
          <Check className={cn('w-4 h-4', checkColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">
            {notification.topicLabel} captured
          </p>
          <div className="mt-1">
            <ConfidenceBadge confidence={notification.confidence} />
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Domain: {domainLabels[notification.domain]}
          </p>
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">
        Input captured: {notification.topicLabel}, {notification.confidence} confidence
      </span>
    </div>
  );
}
