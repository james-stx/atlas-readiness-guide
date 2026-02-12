'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  PenLine,
  SkipForward,
  RotateCcw,
  Check,
  AlertTriangle,
  Circle,
  Pencil,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Input, ConfidenceLevel } from '@atlas/types';
import { getTopicConfig } from '@/lib/progress';

// ============================================
// Types
// ============================================

type TopicStatus = 'not_started' | 'in_progress' | 'complete' | 'skipped';
type CardState = 'collapsed' | 'expanded' | 'writing' | 'editing';

interface TopicCardProps {
  topicId: string;
  label: string;
  input?: Input; // If present, topic has been completed
  isSkipped?: boolean;
  isHighlighted?: boolean;
  onWriteResponse: (response: string) => void;
  onEditResponse?: (response: string) => void;
  onTalkToAtlas: () => void;
  onSkip: () => void;
  onUnskip: () => void;
}

// ============================================
// Confidence Config
// ============================================

const confidenceConfig: Record<ConfidenceLevel, {
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  high: {
    label: 'Strong',
    shortLabel: 'Strong',
    color: 'text-[#0F7B6C]',
    bgColor: 'bg-[#DBEDDB]',
    description: 'Clear, specific, data-backed response',
  },
  medium: {
    label: 'Developing',
    shortLabel: 'Developing',
    color: 'text-[#9A6700]',
    bgColor: 'bg-[#FBF3DB]',
    description: 'Good foundation, could be more specific',
  },
  low: {
    label: 'Needs work',
    shortLabel: 'Needs work',
    color: 'text-[#E03E3E]',
    bgColor: 'bg-[#FFE2DD]',
    description: 'Consider adding more detail',
  },
};

// ============================================
// Status Config
// ============================================

const statusConfig: Record<TopicStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: typeof Check;
}> = {
  not_started: {
    label: 'Not started',
    color: 'text-[#787774]',
    bgColor: 'bg-[#F1F0EC]',
    icon: Circle,
  },
  in_progress: {
    label: 'In progress',
    color: 'text-[#9A6700]',
    bgColor: 'bg-[#FBF3DB]',
    icon: Circle,
  },
  complete: {
    label: 'Complete',
    color: 'text-[#0F7B6C]',
    bgColor: 'bg-[#DBEDDB]',
    icon: Check,
  },
  skipped: {
    label: 'Skipped',
    color: 'text-[#787774]',
    bgColor: 'bg-[#F1F0EC]',
    icon: SkipForward,
  },
};

// ============================================
// Component
// ============================================

export function TopicCard({
  topicId,
  label,
  input,
  isSkipped = false,
  isHighlighted = false,
  onWriteResponse,
  onEditResponse,
  onTalkToAtlas,
  onSkip,
  onUnskip,
}: TopicCardProps) {
  const [cardState, setCardState] = useState<CardState>('collapsed');
  const [writeValue, setWriteValue] = useState('');
  const [editValue, setEditValue] = useState(input?.user_response || '');
  const [showResponse, setShowResponse] = useState(false);

  const topicConfig = getTopicConfig(topicId);

  // Determine status
  const status: TopicStatus = isSkipped
    ? 'skipped'
    : input
    ? 'complete'
    : 'not_started';

  const statusCfg = statusConfig[status];
  const confidenceCfg = input ? confidenceConfig[input.confidence_level] : null;

  // Extract insights from input
  const extracted = input?.extracted_data as {
    keyInsight?: string;
    summary?: string;
    strengths?: string[];
    considerations?: string[];
    questions?: string[];
  } | undefined;

  const keyInsight = extracted?.keyInsight || extracted?.summary;
  const strengths = extracted?.strengths || [];
  const considerations = extracted?.considerations || [];
  const questions = extracted?.questions || [];

  // Handlers
  const handleCardClick = () => {
    if (cardState === 'writing' || cardState === 'editing') return;
    setCardState(cardState === 'collapsed' ? 'expanded' : 'collapsed');
  };

  const handleWriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWriteValue('');
    setCardState('writing');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(input?.user_response || '');
    setCardState('editing');
  };

  const handleTalkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTalkToAtlas();
  };

  const handleSkipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSkip();
    setCardState('collapsed');
  };

  const handleUnskipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUnskip();
    setCardState('collapsed');
  };

  const handleCancelWrite = () => {
    setWriteValue('');
    setCardState('expanded');
  };

  const handleSubmitWrite = () => {
    if (writeValue.trim()) {
      onWriteResponse(writeValue.trim());
      setWriteValue('');
    }
    setCardState('collapsed');
  };

  const handleCancelEdit = () => {
    setEditValue(input?.user_response || '');
    setCardState('expanded');
  };

  const handleSaveEdit = () => {
    if (onEditResponse && editValue.trim() && editValue.trim() !== input?.user_response) {
      onEditResponse(editValue.trim());
    }
    setCardState('expanded');
  };

  return (
    <div
      className={cn(
        'rounded-lg border bg-white transition-all duration-150',
        cardState === 'collapsed'
          ? 'border-[#E8E6E1] hover:border-[#D4D1CB]'
          : 'border-[#D4D1CB] shadow-sm',
        isHighlighted && 'ring-2 ring-[#2383E2] ring-offset-2'
      )}
    >
      {/* ─── Collapsed State ─── */}
      {cardState === 'collapsed' && (
        <button
          onClick={handleCardClick}
          className="flex w-full items-center gap-3 p-4 text-left"
        >
          {/* Topic label */}
          <span className={cn(
            'flex-1 text-[14px] font-medium',
            isSkipped ? 'text-[#9B9A97] line-through' : 'text-[#37352F]'
          )}>
            {label}
          </span>

          {/* Status pill */}
          <span className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
            statusCfg.bgColor,
            statusCfg.color
          )}>
            {statusCfg.label}
          </span>

          {/* Confidence badge (only for complete) */}
          {confidenceCfg && (
            <span className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
              confidenceCfg.bgColor,
              confidenceCfg.color
            )}>
              {confidenceCfg.shortLabel}
            </span>
          )}

          {/* Expand chevron */}
          <ChevronDown className="h-4 w-4 shrink-0 text-[#9B9A97]" />
        </button>
      )}

      {/* ─── Expanded State ─── */}
      {cardState === 'expanded' && (
        <div>
          {/* Header - Click to collapse */}
          <button
            onClick={handleCardClick}
            className="flex w-full items-center gap-3 p-4 text-left border-b border-[#F1F0EC]"
          >
            <span className="flex-1 text-[14px] font-medium text-[#37352F]">
              {label}
            </span>

            {/* Status pill */}
            <span className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
              statusCfg.bgColor,
              statusCfg.color
            )}>
              {statusCfg.label}
            </span>

            {/* Confidence badge */}
            {confidenceCfg && (
              <span className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                confidenceCfg.bgColor,
                confidenceCfg.color
              )}>
                {confidenceCfg.shortLabel}
              </span>
            )}

            <ChevronDown className="h-4 w-4 shrink-0 text-[#9B9A97] rotate-180" />
          </button>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Why This Matters */}
            {topicConfig?.description && (
              <div>
                <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-1.5">
                  Why This Matters
                </h4>
                <p className="text-[13px] leading-relaxed text-[#5C5A56]">
                  {topicConfig.description}
                </p>
              </div>
            )}

            {/* Key Insight (if input exists) */}
            {keyInsight && (
              <div>
                <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-1.5">
                  Key Insight
                </h4>
                <p className="text-[14px] leading-relaxed text-[#37352F]">
                  {keyInsight}
                </p>
              </div>
            )}

            {/* Strengths & Considerations (if input exists) */}
            {(strengths.length > 0 || considerations.length > 0) && (
              <div className="grid grid-cols-2 gap-4">
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
                {considerations.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#D9730D] mb-1.5">
                      To Consider
                    </h4>
                    <ul className="space-y-1">
                      {considerations.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[#D9730D] mt-0.5" />
                          <span className="text-[13px] text-[#5C5A56]">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Questions Asked (if available) */}
            {questions.length > 0 && (
              <div>
                <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-1.5">
                  Questions Discussed
                </h4>
                <ul className="space-y-1">
                  {questions.map((q, i) => (
                    <li key={i} className="text-[13px] text-[#5C5A56]">
                      • {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Your Response (collapsed by default) */}
            {input?.user_response && (
              <div>
                <button
                  onClick={() => setShowResponse(!showResponse)}
                  className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] hover:text-[#5C5A56] transition-colors"
                >
                  <ChevronRight className={cn(
                    'h-3.5 w-3.5 transition-transform',
                    showResponse && 'rotate-90'
                  )} />
                  Your Response
                </button>
                {showResponse && (
                  <div className="mt-2 rounded-md bg-[#FAF9F7] border border-[#E8E6E1] px-3 py-2.5">
                    <p className="text-[13px] leading-relaxed text-[#5C5A56] whitespace-pre-wrap">
                      {input.user_response}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Confidence explanation */}
            {confidenceCfg && (
              <div className="flex items-center gap-2 pt-2 border-t border-[#F1F0EC]">
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[11px] font-medium',
                  confidenceCfg.bgColor,
                  confidenceCfg.color
                )}>
                  {confidenceCfg.label}
                </span>
                <span className="text-[12px] text-[#9B9A97]">
                  {confidenceCfg.description}
                </span>
              </div>
            )}
          </div>

          {/* Action Options */}
          <div className="px-4 py-3 border-t border-[#F1F0EC] bg-[#FAFAFA]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#9B9A97]">
                {input ? formatTimestamp(input.created_at) : 'How would you like to proceed?'}
              </span>
              <div className="flex items-center gap-2">
                {/* Edit button (if has input) */}
                {input && (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-[#5C5A56] hover:bg-[#E8E6E1] transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                )}

                {/* Write button (if no input) */}
                {!input && !isSkipped && (
                  <button
                    onClick={handleWriteClick}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-[#5C5A56] hover:bg-[#E8E6E1] transition-colors"
                  >
                    <PenLine className="h-3.5 w-3.5" />
                    Write
                  </button>
                )}

                {/* Skip/Unskip button */}
                {isSkipped ? (
                  <button
                    onClick={handleUnskipClick}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-[#5C5A56] hover:bg-[#E8E6E1] transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Undo skip
                  </button>
                ) : !input ? (
                  <button
                    onClick={handleSkipClick}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-[#9B9A97] hover:bg-[#E8E6E1] transition-colors"
                  >
                    <SkipForward className="h-3.5 w-3.5" />
                    Skip
                  </button>
                ) : null}

                {/* Talk to Atlas button */}
                <button
                  onClick={handleTalkClick}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-white bg-[#2383E2] hover:bg-[#1A6DC0] transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {input ? 'Discuss' : 'Talk to Atlas'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Writing State ─── */}
      {cardState === 'writing' && (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 p-4 border-b border-[#F1F0EC]">
            <div className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-[#2383E2]" />
              <span className="text-[14px] font-medium text-[#37352F]">{label}</span>
            </div>
            <button
              onClick={handleCancelWrite}
              className="text-[#9B9A97] hover:text-[#5C5A56]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Write Form */}
          <div className="p-4">
            <textarea
              value={writeValue}
              onChange={(e) => setWriteValue(e.target.value)}
              className="w-full min-h-[120px] rounded-md border border-[#D4D1CB] bg-white px-3 py-2.5 text-[14px] text-[#37352F] placeholder:text-[#9B9A97] focus:outline-none focus:ring-2 focus:ring-[#2383E2]/30 focus:border-[#2383E2] resize-none"
              placeholder="Share your thoughts on this topic..."
              autoFocus
            />
          </div>

          {/* Write Actions */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#F1F0EC] bg-[#FAFAFA]">
            <button
              onClick={handleTalkClick}
              className="flex items-center gap-1.5 text-[13px] text-[#2383E2] hover:text-[#1A6DC0]"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Not sure? Ask Atlas
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelWrite}
                className="rounded-md px-3 py-1.5 text-[13px] text-[#5C5A56] hover:bg-[#E8E6E1] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitWrite}
                disabled={!writeValue.trim()}
                className="rounded-md px-3 py-1.5 text-[13px] font-medium text-white bg-[#2383E2] hover:bg-[#1A6DC0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Editing State ─── */}
      {cardState === 'editing' && (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 p-4 border-b border-[#F1F0EC]">
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-[#2383E2]" />
              <span className="text-[14px] font-medium text-[#37352F]">Editing: {label}</span>
            </div>
            <button
              onClick={handleCancelEdit}
              className="text-[#9B9A97] hover:text-[#5C5A56]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Edit Form */}
          <div className="p-4">
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
              onClick={handleTalkClick}
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
                disabled={!editValue.trim() || editValue.trim() === input?.user_response}
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

// ============================================
// Helpers
// ============================================

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
