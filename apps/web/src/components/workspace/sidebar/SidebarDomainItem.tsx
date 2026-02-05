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

const statusIcons: Record<DomainStatus, { icon: string; className: string }> = {
  adequate: { icon: '●', className: 'text-accent-600' },
  in_progress: { icon: '◐', className: 'text-warm-600' },
  not_started: { icon: '○', className: 'text-[var(--text-tertiary)]' },
};

export function SidebarDomainItem({
  domain,
  label,
  status,
  isSelected,
  isExpanded,
  count,
  onSelect,
  onToggleExpand,
  children,
}: SidebarDomainItemProps) {
  const statusConfig = statusIcons[status];

  return (
    <div>
      <button
        onClick={() => {
          onSelect();
          if (!isExpanded) onToggleExpand();
        }}
        className={cn(
          'group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors',
          isSelected
            ? 'border-l-2 border-accent-600 bg-accent-50 text-accent-700'
            : 'hover:bg-[var(--bg-tertiary)]'
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
              'h-4 w-4 text-[var(--text-tertiary)] transition-transform duration-normal',
              isExpanded && 'rotate-90'
            )}
          />
        </button>

        {/* Status indicator */}
        <span className={cn('text-[8px] leading-none', statusConfig.className)}>
          {statusConfig.icon}
        </span>

        {/* Domain name */}
        <span
          className={cn(
            'flex-1 truncate text-h3-workspace font-medium',
            isSelected ? 'text-accent-700' : 'text-[var(--text-primary)]'
          )}
        >
          {label}
        </span>

        {/* Count */}
        <span className="text-caption tabular-nums text-[var(--text-tertiary)]">
          {count.current}/{count.total}
        </span>
      </button>

      {/* Expanded children (topics) */}
      {isExpanded && children && (
        <div className="relative ml-1 mt-0.5 overflow-hidden transition-all duration-normal">
          {children}
        </div>
      )}
    </div>
  );
}
