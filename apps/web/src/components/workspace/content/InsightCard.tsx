'use client';

import { useState } from 'react';
import { ChevronDown, MessageSquare, Check, AlertTriangle, Circle, Pencil, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Input } from '@atlas/types';
import { getTopicLabel } from '@/lib/progress';
import { ConfidenceDots } from '@/components/ui/status-indicator';

interface InsightCardProps {
  input: Input;
  isHighlighted?: boolean;
  onDiscuss: () => void;
  onSaveEdit?: (newResponse: string) => void;
}

type CardState = 'collapsed' | 'expanded' | 'editing';

const confidenceLabels = {
  high: { label: 'Strong', color: 'text-[#0F7B6C]' },
  medium: { label: 'Developing', color: 'text-[#D9730D]' },
  low: { label: 'Needs work', color: 'text-[#E03E3E]' },
};

export function InsightCard({
  input,
  isHighlighted = false,
  onDiscuss,
  onSaveEdit,
}: InsightCardProps) {
  const [cardState, setCardState] = useState<CardState>('collapsed');
  const [editValue, setEditValue] = useState(input.user_response);

  const topicLabel = getTopicLabel(input.question_id);

  // Extract AI-generated insights
  const extracted = input.extracted_data as {
    keyInsight?: string;
    summary?: string;
    strengths?: string[];
    considerations?: string[];
  };

  const keyInsight = extracted?.keyInsight || extracted?.summary || generateFallbackInsight(input);
  const strengths = extracted?.strengths || [];
  const considerations = extracted?.considerations || [];
  const conf = confidenceLabels[input.confidence_level];

  // Categorize considerations
  const { assumptions, gaps } = categorizeConsiderations(considerations);

  const handleCardClick = () => {
    if (cardState === 'editing') return;
    setCardState(cardState === 'collapsed' ? 'expanded' : 'collapsed');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(input.user_response);
    setCardState('editing');
  };

  const handleCancelEdit = () => {
    setEditValue(input.user_response);
    setCardState('expanded');
  };

  const handleSaveEdit = () => {
    if (onSaveEdit && editValue.trim() !== input.user_response) {
      onSaveEdit(editValue.trim());
    }
    setCardState('expanded');
  };

  const handleDiscussClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDiscuss();
  };

  return (
    <div
      className={cn(
        'rounded-lg border bg-white transition-all duration-150',
        cardState === 'collapsed' ? 'border-[#E8E6E1] hover:border-[#D4D1CB]' : 'border-[#D4D1CB] shadow-sm',
        isHighlighted && 'ring-2 ring-[#2383E2] ring-offset-2'
      )}
    >
      {/* Collapsed State - Click to expand */}
      {cardState === 'collapsed' && (
        <button
          onClick={handleCardClick}
          className="flex w-full items-start gap-3 p-4 text-left"
        >
          {/* Confidence indicator */}
          <div className="shrink-0 pt-0.5" title={conf.label}>
            <ConfidenceDots level={input.confidence_level} size="md" />
          </div>

          {/* Insight preview */}
          <p className="flex-1 text-[14px] leading-relaxed text-[#37352F] line-clamp-2">
            {keyInsight}
          </p>

          {/* Expand chevron */}
          <ChevronDown className="h-4 w-4 shrink-0 text-[#9B9A97] mt-0.5" />
        </button>
      )}

      {/* Expanded State */}
      {cardState === 'expanded' && (
        <div>
          {/* Header - Click to collapse */}
          <button
            onClick={handleCardClick}
            className="flex w-full items-center justify-between gap-3 p-4 pb-3 text-left border-b border-[#F1F0EC]"
          >
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#37352F]">
                {topicLabel}
              </span>
              <span className={cn('text-[11px]', conf.color)}>
                {conf.label}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#9B9A97] rotate-180" />
          </button>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Key Insight */}
            <div>
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-1.5">
                Key Insight
              </h4>
              <p className="text-[14px] leading-relaxed text-[#37352F]">
                {keyInsight}
              </p>
            </div>

            {/* Implications */}
            {(strengths.length > 0 || assumptions.length > 0 || gaps.length > 0) && (
              <div className="grid grid-cols-2 gap-4">
                {/* Strengths */}
                {strengths.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#0F7B6C] mb-1.5">
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="h-3.5 w-3.5 shrink-0 text-[#0F7B6C] mt-0.5" />
                          <span className="text-[13px] text-[#5C5A56]">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Needs Attention */}
                {(assumptions.length > 0 || gaps.length > 0) && (
                  <div>
                    <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#D9730D] mb-1.5">
                      Needs Attention
                    </h4>
                    <ul className="space-y-1">
                      {assumptions.map((a, i) => (
                        <li key={`a-${i}`} className="flex items-start gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[#D9730D] mt-0.5" />
                          <span className="text-[13px] text-[#5C5A56]">{a}</span>
                        </li>
                      ))}
                      {gaps.map((g, i) => (
                        <li key={`g-${i}`} className="flex items-start gap-1.5">
                          <Circle className="h-3.5 w-3.5 shrink-0 text-[#E03E3E] mt-0.5" />
                          <span className="text-[13px] text-[#5C5A56]">{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* User Response */}
            <div>
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-1.5">
                Your Response
              </h4>
              <div className="rounded-md bg-[#FAF9F7] border border-[#E8E6E1] px-3 py-2.5">
                <p className="text-[13px] leading-relaxed text-[#5C5A56]">
                  {input.user_response}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#F1F0EC] bg-[#FAFAFA]">
            <span className="text-[11px] text-[#9B9A97]">
              {formatTimestamp(input.created_at)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-[#5C5A56] hover:bg-[#E8E6E1] transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={handleDiscussClick}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-white bg-[#2383E2] hover:bg-[#1A6DC0] transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Discuss with Atlas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editing State */}
      {cardState === 'editing' && (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 p-4 pb-3 border-b border-[#F1F0EC]">
            <span className="text-[13px] font-medium text-[#37352F]">
              Editing: {topicLabel}
            </span>
            <button
              onClick={handleCancelEdit}
              className="text-[#9B9A97] hover:text-[#5C5A56]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Edit Form */}
          <div className="p-4">
            <label className="block text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-2">
              Your Response
            </label>
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full min-h-[120px] rounded-md border border-[#D4D1CB] bg-white px-3 py-2.5 text-[14px] text-[#37352F] placeholder:text-[#9B9A97] focus:outline-none focus:ring-2 focus:ring-[#2383E2]/30 focus:border-[#2383E2] resize-none"
              placeholder="Update your response..."
              autoFocus
            />
            <p className="mt-2 text-[12px] text-[#9B9A97]">
              Your insights will be re-analyzed after saving.
            </p>
          </div>

          {/* Edit Actions */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#F1F0EC] bg-[#FAFAFA]">
            <button
              onClick={handleDiscussClick}
              className="flex items-center gap-1.5 text-[13px] text-[#2383E2] hover:text-[#1A6DC0]"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Need help? Ask Atlas
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelEdit}
                className="rounded-md px-3 py-1.5 text-[13px] text-[#5C5A56] hover:bg-[#E8E6E1] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editValue.trim() || editValue.trim() === input.user_response}
                className="rounded-md px-3 py-1.5 text-[13px] font-medium text-white bg-[#2383E2] hover:bg-[#1A6DC0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function generateFallbackInsight(input: Input): string {
  if (input.confidence_level === 'high') {
    return 'Clear, specific information provided for this topic.';
  } else if (input.confidence_level === 'medium') {
    return 'Foundation established, though some details could be strengthened.';
  }
  return 'Initial perspective captured. Consider adding more specifics.';
}

function categorizeConsiderations(considerations: string[]): {
  assumptions: string[];
  gaps: string[];
} {
  const assumptions: string[] = [];
  const gaps: string[] = [];

  for (const c of considerations) {
    const lower = c.toLowerCase();
    if (lower.includes('gap') || lower.includes('missing') || lower.includes('no ') || lower.includes('haven\'t')) {
      gaps.push(c);
    } else {
      assumptions.push(c);
    }
  }

  return { assumptions, gaps };
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
