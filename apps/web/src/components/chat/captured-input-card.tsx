'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { ConfidenceLevel } from '@atlas/types';
import { Check } from 'lucide-react';

interface CapturedInputCardProps {
  label: string;
  value: string;
  confidence: ConfidenceLevel;
  isNew?: boolean;
  className?: string;
}

const CONFIDENCE_STYLES: Record<
  ConfidenceLevel,
  { bg: string; border: string; text: string; label: string }
> = {
  high: {
    bg: 'bg-accent-50',
    border: 'border-accent-200',
    text: 'text-accent-700',
    label: 'High Confidence',
  },
  medium: {
    bg: 'bg-warm-50',
    border: 'border-warm-200',
    text: 'text-warm-700',
    label: 'Medium Confidence',
  },
  low: {
    bg: 'bg-neutral-50',
    border: 'border-neutral-200',
    text: 'text-neutral-600',
    label: 'Low Confidence',
  },
};

export function CapturedInputCard({
  label,
  value,
  confidence,
  isNew = false,
  className,
}: CapturedInputCardProps) {
  const [isHighlighted, setIsHighlighted] = useState(isNew);
  const styles = CONFIDENCE_STYLES[confidence];

  // Remove highlight after 5 seconds
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setIsHighlighted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2 transition-all duration-500',
        styles.bg,
        styles.border,
        isHighlighted && 'ring-2 ring-accent-500 ring-offset-2',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Check className={cn('w-3 h-3', styles.text)} />
            <span className={cn('text-xs font-medium', styles.text)}>
              {styles.label}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mb-0.5">{label}</p>
          <p className="text-sm text-neutral-900 font-medium truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}
