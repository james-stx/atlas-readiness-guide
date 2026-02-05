'use client';

import { cn } from '@/lib/utils';

interface NotStartedCardProps {
  label: string;
  onClick: () => void;
}

export function NotStartedCard({ label, onClick }: NotStartedCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-lg border border-dashed border-[var(--border-primary)] px-4 py-2.5',
        'text-left transition-all duration-normal',
        'hover:border-solid hover:border-[var(--border-secondary)] hover:cursor-pointer'
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[var(--text-tertiary)]">○</span>
        <span className="text-body text-[var(--text-tertiary)]">{label}</span>
      </div>
      <span className="text-caption text-[var(--text-tertiary)]">Not Started</span>
    </button>
  );
}
