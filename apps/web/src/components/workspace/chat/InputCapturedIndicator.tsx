'use client';

import { Check } from 'lucide-react';
import { ConfidenceBadge } from '@/components/ui/confidence-badge';
import { getTopicLabel } from '@/lib/progress';
import type { ConfidenceLevel } from '@atlas/types';

interface InputCapturedIndicatorProps {
  questionId: string;
  confidenceLevel: ConfidenceLevel;
  onClick?: () => void;
}

export function InputCapturedIndicator({
  questionId,
  confidenceLevel,
  onClick,
}: InputCapturedIndicatorProps) {
  const label = getTopicLabel(questionId);

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg border border-accent-600/20 bg-accent-50 px-3 py-2 text-left transition-colors hover:border-accent-600/40 animate-fade-in"
    >
      <span className="flex h-4 w-4 items-center justify-center">
        <Check className="h-3.5 w-3.5 text-accent-600" />
      </span>
      <div className="flex-1">
        <span className="text-caption font-semibold text-[var(--text-primary)]">
          Input captured
        </span>
        <div className="flex items-center gap-2">
          <span className="text-caption text-[var(--text-tertiary)]">{label}</span>
          <ConfidenceBadge level={confidenceLevel} />
        </div>
      </div>
    </button>
  );
}
