'use client';

import { X } from 'lucide-react';
import { DOMAIN_LABELS } from '@atlas/config';
import type { DomainType } from '@atlas/types';

interface ChatHeaderProps {
  domain: DomainType | null;
  onClose: () => void;
}

export function ChatHeader({ domain, onClose }: ChatHeaderProps) {
  const label = domain ? DOMAIN_LABELS[domain] : 'Chat';

  return (
    <div className="flex h-12 items-center justify-between border-b border-[var(--border-primary)] bg-white px-4">
      <span className="text-body font-medium text-[var(--text-primary)]">
        Chat — {label}
      </span>
      <button
        onClick={onClose}
        className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)]"
        aria-label="Close chat panel"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
