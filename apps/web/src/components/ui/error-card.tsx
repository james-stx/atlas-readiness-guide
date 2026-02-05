'use client';

import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorCard({
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorCardProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3',
        className
      )}
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      <div className="flex-1 space-y-2">
        <p className="text-body-sm text-red-700">{message}</p>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-7 px-2 text-caption text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
