'use client';

import { useState } from 'react';
import { ChevronDown, MessageSquare, MoreHorizontal, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
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

const confidenceConfig = {
  high: {
    label: 'High',
    bg: 'bg-[#DDEDEA]',
    text: 'text-[#0F7B6C]',
    dot: 'bg-[#0F7B6C]',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-[#FAEBDD]',
    text: 'text-[#D9730D]',
    dot: 'bg-[#D9730D]',
  },
  low: {
    label: 'Low',
    bg: 'bg-[#FBE4E4]',
    text: 'text-[#E03E3E]',
    dot: 'bg-[#E03E3E]',
  },
};

export function CategoryCard({
  input,
  isHighlighted = false,
  onEdit,
  onViewChat,
  onRemove,
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const label = getTopicLabel(input.question_id);
  const topicConfig = getTopicConfig(input.question_id);
  const conf = confidenceConfig[input.confidence_level];

  // Generate insight points based on confidence
  const insights = generateInsights(input);

  return (
    <>
      <div
        className={cn(
          'rounded-lg border bg-white transition-all duration-150',
          isExpanded ? 'border-[#E8E6E1] shadow-sm' : 'border-[#F1F0EC]',
          isHighlighted && 'ring-2 ring-[#2383E2] ring-offset-2',
          !isExpanded && 'hover:border-[#E8E6E1]'
        )}
      >
        {/* Header row - always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center gap-3 p-4 text-left"
          aria-expanded={isExpanded}
        >
          {/* Expand icon */}
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-[#9B9A97] transition-transform duration-150',
              !isExpanded && '-rotate-90'
            )}
          />

          {/* Title */}
          <span className="flex-1 text-[15px] font-medium text-[#37352F]">
            {label}
          </span>

          {/* Confidence badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium',
              conf.bg,
              conf.text
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', conf.dot)} />
            {conf.label}
          </span>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-[#F1F0EC] px-4 pb-4 pt-3 animate-in slide-in-from-top-2 duration-150">
            {/* KEY INSIGHT section */}
            <div className="mb-4">
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-2">
                Key Insight
              </h4>
              <p className="text-[14px] leading-relaxed text-[#37352F]">
                {generateKeyInsight(input)}
              </p>
            </div>

            {/* YOUR INPUT section */}
            <div className="mb-4">
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-2">
                Your Input
              </h4>
              <div className="rounded-md border-l-[3px] border-[#2383E2] bg-[#FAF9F7] px-3 py-2.5">
                <p className="text-[14px] leading-relaxed text-[#5C5A56] italic">
                  &ldquo;{input.user_response}&rdquo;
                </p>
              </div>
            </div>

            {/* WHAT THIS MEANS section */}
            <div className="mb-4">
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-2">
                What This Means
              </h4>
              <div className="space-y-1.5">
                {insights.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0F7B6C]" />
                    <span className="text-[13px] text-[#5C5A56]">{s}</span>
                  </div>
                ))}
                {insights.considerations.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D9730D]" />
                    <span className="text-[13px] text-[#5C5A56]">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with metadata and actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F1F0EC]">
              <span className="text-[12px] text-[#9B9A97]">
                {formatTimestamp(input.created_at)}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewChat();
                  }}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-[#2383E2] hover:bg-[#F7F6F3] transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Discuss
                </button>

                {/* Overflow menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-[#9B9A97] hover:bg-[#F7F6F3] hover:text-[#5C5A56] transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 top-full z-20 mt-1 min-w-[120px] rounded-lg border border-[#E8E6E1] bg-white py-1 shadow-lg">
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            onEdit();
                          }}
                          className="flex w-full items-center px-3 py-1.5 text-[13px] text-[#5C5A56] hover:bg-[#F7F6F3]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setShowConfirmRemove(true);
                          }}
                          className="flex w-full items-center px-3 py-1.5 text-[13px] text-[#E03E3E] hover:bg-[#FBE4E4]"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
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

// Helper functions to get AI-generated insights or generate fallback insights
function generateKeyInsight(input: Input): string {
  // Use AI-generated insight if available
  const extracted = input.extracted_data as {
    keyInsight?: string;
    summary?: string;
  };

  if (extracted?.keyInsight) {
    return extracted.keyInsight;
  }

  if (extracted?.summary) {
    return extracted.summary;
  }

  // Fallback: Generate based on confidence
  const topic = getTopicLabel(input.question_id);
  if (input.confidence_level === 'high') {
    return `Clear understanding of ${topic.toLowerCase()} with specific details provided.`;
  } else if (input.confidence_level === 'medium') {
    return `Partial clarity on ${topic.toLowerCase()}. Some areas may benefit from further exploration.`;
  } else {
    return `Initial thoughts on ${topic.toLowerCase()} captured. Consider adding more specifics.`;
  }
}

function generateInsights(input: Input): { strengths: string[]; considerations: string[] } {
  // Use AI-generated insights if available
  const extracted = input.extracted_data as {
    strengths?: string[];
    considerations?: string[];
  };

  if (extracted?.strengths || extracted?.considerations) {
    return {
      strengths: extracted.strengths || [],
      considerations: extracted.considerations || [],
    };
  }

  // Fallback: Generate based on confidence level
  const strengths: string[] = [];
  const considerations: string[] = [];

  if (input.confidence_level === 'high') {
    strengths.push('Clear, specific information provided');
    if (input.user_response.match(/\d+/)) {
      strengths.push('Quantitative data included');
    }
  } else if (input.confidence_level === 'medium') {
    strengths.push('Foundation established for this area');
    considerations.push('Consider adding specific examples or data');
  } else {
    strengths.push('Initial perspective captured');
    considerations.push('More detail would strengthen this assessment');
  }

  return { strengths, considerations };
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
