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
    <div className="flex h-12 items-center justify-between border-b border-warm-200 bg-white px-4">
      <span className="text-ws-body font-medium text-warm-900">
        Chat — {label}
      </span>
      <button
        onClick={onClose}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-warm-400 transition-colors duration-fast hover:bg-warm-150 hover:text-warm-600"
        aria-label="Close chat panel"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
