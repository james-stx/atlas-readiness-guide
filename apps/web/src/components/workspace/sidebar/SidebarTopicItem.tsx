'use client';

import { cn } from '@/lib/utils';
import { StatusIndicator } from '@/components/ui/status-indicator';
import type { ConfidenceLevel } from '@atlas/types';

interface SidebarTopicItemProps {
  label: string;
  covered: boolean;
  confidence?: ConfidenceLevel;
  isSelected: boolean;
  onClick: () => void;
}

export function SidebarTopicItem({
  label,
  covered,
  confidence,
  isSelected,
  onClick,
}: SidebarTopicItemProps) {
  const status = covered ? 'complete' : 'not_started';

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center w-full h-[32px] mx-1 pl-[28px] pr-2 rounded-[3px] text-left',
        'transition-colors duration-75',
        isSelected ? 'bg-[#EBEBEA]' : 'hover:bg-[#EBEBEA]'
      )}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}
      role="treeitem"
      aria-level={2}
    >
      {/* Status indicator */}
      <div className="mr-2.5 shrink-0">
        <StatusIndicator status={status} confidence={confidence} size="md" />
      </div>

      {/* Topic label */}
      <span
        className={cn(
          'text-[14px] leading-[1.2] truncate',
          covered ? 'text-[#37352F]' : 'text-[#787774]'
        )}
      >
        {label}
      </span>
    </button>
  );
}
