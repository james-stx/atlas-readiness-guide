'use client';

import { useState } from 'react';
import { ChevronRight, Pencil, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfidenceBadge } from '@/components/ui/confidence-badge';
import { Button } from '@/components/ui/button';
import { OverflowMenu } from '@/components/ui/overflow-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { Input } from '@atlas/types';
import { getTopicLabel } from '@/lib/progress';

interface CategoryCardProps {
  input: Input;
  isHighlighted?: boolean;
  onEdit: () => void;
  onViewChat: () => void;
  onRemove: () => void;
}

export function CategoryCard({
  input,
  isHighlighted = false,
  onEdit,
  onViewChat,
  onRemove,
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const label = getTopicLabel(input.question_id);
  const preview = input.user_response.length > 35
    ? input.user_response.slice(0, 35) + '...'
    : input.user_response;

  return (
    <>
      <div
        className={cn(
          'rounded-lg border transition-all duration-normal',
          isExpanded
            ? 'border-[var(--border-secondary)] rounded-xl'
            : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]',
          isHighlighted && 'animate-card-highlight'
        )}
      >
        {/* Collapsed view */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left"
          aria-expanded={isExpanded}
          aria-label={`${label} — ${input.confidence_level} confidence`}
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 shrink-0 text-[var(--text-tertiary)] transition-transform duration-normal',
              isExpanded && 'rotate-90'
            )}
          />
          <span className="flex-1 truncate text-body font-medium text-[var(--text-primary)]">
            {label}
          </span>
          {!isExpanded && (
            <span className="hidden max-w-[180px] truncate text-body-sm text-[var(--text-secondary)] sm:block">
              &ldquo;{preview}&rdquo;
            </span>
          )}
          <ConfidenceBadge level={input.confidence_level} />
        </button>

        {/* Expanded view */}
        {isExpanded && (
          <div className="border-t border-[var(--border-primary)] px-5 py-4 animate-fade-in">
            {/* User input quote */}
            <div className="rounded-lg border-l-[3px] border-accent-600 bg-[var(--bg-secondary)] px-4 py-3">
              <p className="text-body text-[var(--text-primary)]">
                &ldquo;{input.user_response}&rdquo;
              </p>
            </div>

            {/* Confidence */}
            <div className="mt-3 flex items-center gap-2">
              <ConfidenceBadge level={input.confidence_level} />
              {input.confidence_rationale && (
                <span className="text-caption text-[var(--text-tertiary)]">
                  — {input.confidence_rationale}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onViewChat}>
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                View in Chat
              </Button>
              <div className="flex-1" />
              <OverflowMenu
                items={[
                  {
                    label: 'Remove',
                    variant: 'danger',
                    onClick: () => setShowConfirmRemove(true),
                  },
                ]}
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirmRemove}
        title="Remove this input?"
        message="You'll need to discuss this topic again in chat."
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => {
          setShowConfirmRemove(false);
          onRemove();
        }}
        onCancel={() => setShowConfirmRemove(false)}
      />
    </>
  );
}
