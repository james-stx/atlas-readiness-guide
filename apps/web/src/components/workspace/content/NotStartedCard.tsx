'use client';

import { cn } from '@/lib/utils';
import { getTopicConfig } from '@/lib/progress';

interface NotStartedCardProps {
  label: string;
  topicId?: string;
  onClick: () => void;
}

export function NotStartedCard({ label, topicId, onClick }: NotStartedCardProps) {
  const topicConfig = topicId ? getTopicConfig(topicId) : null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border border-dashed border-warm-200 px-4 py-3',
        'text-left transition-all duration-fast',
        'hover:border-solid hover:border-warm-300 hover:bg-warm-50 hover:cursor-pointer'
      )}
    >
      <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full border border-warm-300" />
      <div className="flex-1 min-w-0">
        <span className="text-ws-body font-medium text-warm-700">{label}</span>
        {topicConfig?.description && (
          <p className="mt-0.5 text-ws-body-sm text-warm-500">{topicConfig.description}</p>
        )}
      </div>
      <span className="shrink-0 text-ws-caption text-warm-400">Click to start</span>
    </button>
  );
}
