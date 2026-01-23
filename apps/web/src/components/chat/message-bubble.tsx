'use client';

import { cn } from '@/lib/utils';
import type { MessageRole } from '@atlas/types';

interface MessageBubbleProps {
  role: MessageRole;
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export function MessageBubble({
  role,
  content,
  isStreaming = false,
  className,
}: MessageBubbleProps) {
  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in',
        isAssistant ? 'justify-start' : 'justify-end',
        className
      )}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-sm font-semibold">A</span>
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isAssistant
            ? 'bg-white border border-slate-200 text-slate-700 shadow-sm'
            : 'bg-primary text-white shadow-sm'
        )}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse-subtle" />
          )}
        </p>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
          <span className="text-slate-600 text-sm font-semibold">U</span>
        </div>
      )}
    </div>
  );
}
