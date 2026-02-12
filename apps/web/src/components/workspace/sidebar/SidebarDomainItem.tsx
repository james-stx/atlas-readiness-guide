'use client';

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
}

const statusColors: Record<DomainStatus, string> = {
  adequate: 'bg-[#35A552]',      // Green - complete
  in_progress: 'bg-[#CB7B3E]',   // Orange - in progress
  not_started: 'bg-[#91918E]',   // Gray - not started
};

export function SidebarDomainItem({
  label,
  status,
  isSelected,
  isExpanded,
  count,
  onSelect,
  onToggleExpand,
}: SidebarDomainItemProps) {
  return (
    <div
      className={cn(
        'group flex items-center h-[32px] mx-1 px-2 rounded-[3px] cursor-pointer select-none',
        isSelected ? 'bg-[#EBEBEA]' : 'hover:bg-[#EBEBEA]'
      )}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}
      onClick={() => {
        onSelect();
        if (!isExpanded) onToggleExpand();
      }}
      role="treeitem"
      aria-expanded={isExpanded}
    >
      {/* Icon container - shows status dot by default, chevron on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand();
        }}
        className="relative flex items-center justify-center w-[22px] h-[22px] mr-1.5 rounded-[3px] group-hover:bg-[#E8E7E4]"
        tabIndex={-1}
      >
        {/* Status dot - visible by default, hidden on hover */}
        <span
          className={cn(
            'h-[8px] w-[8px] rounded-full transition-opacity duration-100',
            'group-hover:opacity-0',
            statusColors[status]
          )}
        />

        {/* Chevron - hidden by default, visible on hover */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={cn(
            'absolute text-[#91918E] transition-all duration-100',
            'opacity-0 group-hover:opacity-100',
            isExpanded ? 'rotate-90' : ''
          )}
          fill="currentColor"
        >
          <path d="M4.5 2.5L8.5 6L4.5 9.5V2.5Z" />
        </svg>
      </button>

      {/* Domain name */}
      <span className="flex-1 text-[14px] leading-[1.3] text-[#37352F] truncate">
        {label}
      </span>

      {/* Progress count */}
      <span className="text-[12px] text-[#91918E] tabular-nums ml-1">
        {count.current}/{count.total}
      </span>
    </div>
  );
}
