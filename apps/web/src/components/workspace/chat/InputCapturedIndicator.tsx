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
      className="flex w-full items-center gap-2 rounded-lg border border-accent/20 bg-accent-100 px-3 py-2 text-left transition-colors duration-fast hover:border-accent/40 animate-fade-in"
    >
      <span className="flex h-4 w-4 items-center justify-center">
        <Check className="h-3.5 w-3.5 text-accent" />
      </span>
      <div className="flex-1">
        <span className="text-ws-caption font-medium text-warm-900">
          Input captured
        </span>
        <div className="flex items-center gap-2">
          <span className="text-ws-caption text-warm-500">{label}</span>
          <ConfidenceBadge level={confidenceLevel} />
        </div>
      </div>
    </button>
  );
}
