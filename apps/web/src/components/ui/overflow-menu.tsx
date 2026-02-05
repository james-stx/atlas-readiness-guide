'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverflowMenuItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface OverflowMenuProps {
  items: OverflowMenuItem[];
  className?: string;
}

export function OverflowMenu({ items, className }: OverflowMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={menuRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-warm-400 transition-colors duration-fast hover:bg-warm-150 hover:text-warm-600"
        aria-label="More options"
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-warm-200 bg-white py-1 shadow-medium animate-fade-in">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={cn(
                'flex w-full items-center px-3 py-1.5 text-ws-body-sm transition-colors duration-fast',
                item.variant === 'danger'
                  ? 'text-danger hover:bg-danger-bg'
                  : 'text-warm-700 hover:bg-warm-100'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
