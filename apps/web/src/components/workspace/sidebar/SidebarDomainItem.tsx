'use client';

import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DomainType } from '@atlas/types';
import type { DomainStatus } from '@/lib/progress';

interface SidebarDomainItemProps {
  domain: DomainType;
  label: string;
  status: DomainStatus;
  isSelected: boolean;
  isExpanded: boolean;
  count: { current: number; total: number };
  onSelect: () => void;
  onToggleExpand: () => void;
  children?: React.ReactNode;
}

const statusDot: Record<DomainStatus, string> = {
  adequate: 'bg-confidence-high',
  in_progress: 'bg-confidence-medium',
  not_started: 'bg-warm-300',
};

export function SidebarDomainItem({
  label,
  status,
  isSelected,
  isExpanded,
  count,
  onSelect,
  onToggleExpand,
  children,
}: SidebarDomainItemProps) {
  return (
    <div>
      <button
        onClick={() => {
          onSelect();
          if (!isExpanded) onToggleExpand();
        }}
        className={cn(
          'group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left',
          'transition-colors duration-fast',
          isSelected
            ? 'bg-warm-150 text-warm-900'
            : 'text-warm-800 hover:bg-warm-150'
        )}
        aria-expanded={isExpanded}
        role="treeitem"
        aria-level={1}
      >
        {/* Chevron */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="flex shrink-0 items-center justify-center"
          aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
          tabIndex={-1}
        >
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 text-warm-400 transition-transform duration-fast',
              isExpanded && 'rotate-90'
            )}
          />
        </button>

        {/* Status dot */}
        <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', statusDot[status])} />

        {/* Domain name */}
        <span
          className={cn(
            'flex-1 truncate text-ws-body-sm',
            isSelected ? 'font-medium text-warm-950' : 'font-normal'
          )}
        >
          {label}
        </span>

        {/* Count */}
        <span className="text-ws-caption tabular-nums text-warm-500">
          {count.current}/{count.total}
        </span>
      </button>

      {/* Expanded children (topics) */}
      {isExpanded && children && (
        <div className="mt-0.5 overflow-hidden animate-expand-down">
          {children}
        </div>
      )}
    </div>
  );
}
