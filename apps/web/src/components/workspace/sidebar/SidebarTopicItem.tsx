'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarTopicItemProps {
  label: string;
  covered: boolean;
  isLast: boolean;
  onClick: () => void;
}

export function SidebarTopicItem({
  label,
  covered,
  isLast,
  onClick,
}: SidebarTopicItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex w-full items-center gap-2 rounded-md py-1 pl-8 pr-2 text-left transition-colors hover:bg-[var(--bg-tertiary)]',
        'tree-branch'
      )}
      role="treeitem"
      aria-level={2}
    >
      {/* Tree line */}
      {!isLast && (
        <span className="absolute left-[23px] top-1/2 bottom-0 w-px bg-[var(--border-primary)]" />
      )}

      {/* Status icon */}
      {covered ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          <Check className="h-3.5 w-3.5 text-accent-600 animate-checkmark-draw" />
        </span>
      ) : (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[10px] text-[var(--text-tertiary)]">
          ○
        </span>
      )}

      {/* Topic label */}
      <span className="truncate text-body text-[var(--text-secondary)]">
        {label}
      </span>
    </button>
  );
}
