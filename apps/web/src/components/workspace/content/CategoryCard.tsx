'use client';

import { useState } from 'react';
import { ChevronRight, Pencil, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfidenceBadge } from '@/components/ui/confidence-badge';
import { Button } from '@/components/ui/button';
import { OverflowMenu } from '@/components/ui/overflow-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { Input } from '@atlas/types';
import { getTopicLabel, getTopicConfig } from '@/lib/progress';

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
  const topicConfig = getTopicConfig(input.question_id);
  const preview = input.user_response.length > 50
    ? input.user_response.slice(0, 50) + '...'
    : input.user_response;

  return (
    <>
      <div
        className={cn(
          'rounded-lg border transition-all duration-fast',
          isExpanded
            ? 'border-warm-300 bg-white shadow-soft'
            : 'border-warm-200 hover:border-warm-300',
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
              'h-4 w-4 shrink-0 text-warm-400 transition-transform duration-fast',
              isExpanded && 'rotate-90'
            )}
          />
          <div className="flex-1 min-w-0">
            <span className="block truncate text-ws-body font-medium text-warm-900">
              {label}
            </span>
            {!isExpanded && (
              <span className="block truncate text-ws-body-sm text-warm-500">
                {preview}
              </span>
            )}
          </div>
          <ConfidenceBadge level={input.confidence_level} />
        </button>

        {/* Expanded view */}
        {isExpanded && (
          <div className="border-t border-warm-200 px-5 py-4 animate-fade-in">
            {/* Topic description */}
            {topicConfig?.description && (
              <p className="mb-3 text-ws-body-sm text-warm-500">
                {topicConfig.description}
              </p>
            )}

            {/* User input quote */}
            <div className="rounded-lg border-l-[3px] border-accent bg-warm-50 px-4 py-3">
              <p className="text-ws-body text-warm-800">
                &ldquo;{input.user_response}&rdquo;
              </p>
            </div>

            {/* Confidence */}
            <div className="mt-3 flex items-center gap-2">
              <ConfidenceBadge level={input.confidence_level} />
              {input.confidence_rationale && (
                <span className="text-ws-caption text-warm-500">
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
