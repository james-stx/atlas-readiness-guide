'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.querySelector('button')?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onCancel}
        aria-hidden
      />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="relative z-10 mx-4 w-full max-w-sm rounded-lg border border-warm-200 bg-white p-6 shadow-elevated animate-fade-in"
      >
        <h3
          id="confirm-title"
          className={cn(
            'text-ws-heading',
            variant === 'danger' ? 'text-danger' : 'text-warm-900'
          )}
        >
          {title}
        </h3>
        <p
          id="confirm-message"
          className="mt-2 text-ws-body text-warm-600"
        >
          {message}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'accent'}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
