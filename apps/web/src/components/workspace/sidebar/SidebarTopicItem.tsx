'use client';

import { cn } from '@/lib/utils';

interface SidebarTopicItemProps {
  label: string;
  covered: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function SidebarTopicItem({
  label,
  covered,
  isSelected,
  onClick,
}: SidebarTopicItemProps) {
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
      {/* Status indicator - Notion-style checkmark or empty circle */}
      {covered ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="mr-2.5 shrink-0"
          fill="none"
        >
          <path
            d="M13 5L6.5 11.5L3 8"
            stroke="#35A552"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span className="h-[14px] w-[14px] mr-2.5 rounded-full border-[1.5px] border-[#CDCDCA] shrink-0" />
      )}

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
