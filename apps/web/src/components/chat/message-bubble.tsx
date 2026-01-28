'use client';

import { cn } from '@/lib/utils';
import { Compass, User } from 'lucide-react';
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
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Compass className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isAssistant
            ? 'bg-neutral-50 border border-neutral-100 text-neutral-700'
            : 'bg-neutral-900 text-white'
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
        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-neutral-500" />
        </div>
      )}
    </div>
  );
}
