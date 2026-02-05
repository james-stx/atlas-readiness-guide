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
        'relative flex w-full items-center gap-2 rounded-lg py-1 pl-8 pr-2 text-left',
        'transition-colors duration-fast hover:bg-warm-150',
        'tree-branch'
      )}
      role="treeitem"
      aria-level={2}
    >
      {/* Tree line */}
      {!isLast && (
        <span className="absolute left-[23px] top-1/2 bottom-0 w-px bg-warm-200" />
      )}

      {/* Status icon */}
      {covered ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          <Check className="h-3 w-3 text-confidence-high animate-checkmark-draw" />
        </span>
      ) : (
        <span className="flex h-3 w-3 shrink-0 rounded-full border border-warm-300" />
      )}

      {/* Topic label */}
      <span
        className={cn(
          'truncate text-ws-body-sm',
          covered ? 'text-warm-700' : 'text-warm-600'
        )}
      >
        {label}
      </span>
    </button>
  );
}
