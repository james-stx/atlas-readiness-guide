'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type your response...',
  className,
  maxLength = 2000,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter or Cmd/Ctrl+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.8;
  const isOverLimit = charCount > maxLength;

  return (
    <div className={cn('bg-white border-t border-neutral-100 p-4', className)}>
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value.slice(0, maxLength + 100))}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={cn(
                'w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 pr-12',
                'text-sm text-neutral-900 placeholder:text-neutral-400',
                'focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 focus:bg-white',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200',
                isOverLimit && 'border-red-300 focus:border-red-400 focus:ring-red-500/30'
              )}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={disabled || !value.trim() || isOverLimit}
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              'bg-neutral-900 text-white transition-all duration-150',
              'hover:bg-neutral-800',
              'focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-neutral-400">
            {isMac ? '⌘' : 'Ctrl'}+Enter or Enter to send
          </p>
          <p
            className={cn(
              'text-xs transition-colors',
              isOverLimit
                ? 'text-red-500 font-medium'
                : isNearLimit
                  ? 'text-warm-600'
                  : 'text-neutral-400'
            )}
          >
            {charCount.toLocaleString()}/{maxLength.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
