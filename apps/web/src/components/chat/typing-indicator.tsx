'use client';

import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex gap-3 animate-fade-in', className)}>
      <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-semibold">A</span>
      </div>

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
