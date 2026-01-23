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
            'px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200',
            'bg-white border-slate-200 text-slate-700 shadow-sm',
            'hover:bg-primary/5 hover:border-primary/30 hover:text-primary hover:shadow-md hover:-translate-y-0.5',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {response.label}
        </button>
      ))}
    </div>
  );
}
