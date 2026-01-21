'use client';

import { cn } from '@/lib/utils';

interface QuickResponse {
  id: string;
  label: string;
  value: string;
}

interface QuickResponsesProps {
  responses: QuickResponse[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function QuickResponses({
  responses,
  onSelect,
  disabled = false,
  className,
}: QuickResponsesProps) {
  if (responses.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {responses.map((response) => (
        <button
          key={response.id}
          onClick={() => onSelect(response.value)}
          disabled={disabled}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-full border transition-colors',
            'bg-white border-slate-200 text-slate-700',
            'hover:bg-slate-50 hover:border-slate-300',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {response.label}
        </button>
      ))}
    </div>
  );
}
