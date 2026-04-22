'use client';

import React, { useState } from 'react';
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
  Loader2,
  Star,
  Paperclip,
  Trash2,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Input, ConfidenceLevel, FileTopicMapping } from '@atlas/types';
import { getTopicConfig } from '@/lib/progress';
import { useFiles } from '@/lib/context/files-context';

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
  isCapturingInput?: boolean;
  onWriteResponse: (response: string) => void;
  onEditResponse?: (response: string) => void;
  onDeleteMapping?: (mappingId: string) => void;
  onTalkToAtlas: () => void;
  onSkip: () => void;
  onUnskip: () => void;
}

// ============================================
// Confidence Icons
// ============================================

function HalfCircleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 3 A9 9 0 0 0 12 21 Z" fill="currentColor" />
    </svg>
  );
}

// ============================================
// Confidence Config (Rating - filled semantic colors)
// ============================================

const confidenceConfig: Record<ConfidenceLevel, {
  label: string;
  color: string;
  bgColor: string;
  iconColor: string;
  description: string;
  renderIcon: (className: string) => React.ReactNode;
}> = {
  high: {
    label: 'High Confidence',
    color: 'text-[#0F7B6C]',
    bgColor: 'bg-[#DBEDDB]',
    iconColor: 'text-[#0F7B6C]',
    description: 'Clear, specific, data-backed response',
    renderIcon: (cls) => <Star className={cls} fill="currentColor" />,
  },
  medium: {
    label: 'Medium Confidence',
    color: 'text-[#9A6700]',
    bgColor: 'bg-[#FBF3DB]',
    iconColor: 'text-[#9A6700]',
    description: 'Good foundation, could be more specific',
    renderIcon: (cls) => <HalfCircleIcon className={cls} />,
  },
  low: {
    label: 'Low Confidence',
    color: 'text-[#E03E3E]',
    bgColor: 'bg-[#FFE2DD]',
    iconColor: 'text-[#E03E3E]',
    description: 'Consider adding more detail',
    renderIcon: (cls) => <Circle className={cls} />,
  },
};

// ============================================
// Status Config (State - outlined with icons)
// ============================================

const statusConfig: Record<TopicStatus, {
  label: string;
  color: string;
  borderColor: string;
  bgColor: string;
  icon: typeof Check;
}> = {
  not_started: {
    label: 'Not started',
    color: 'text-[#787774]',
    borderColor: 'border-[#D4D1CB]',
    bgColor: 'bg-transparent',
    icon: Circle,
  },
  in_progress: {
    label: 'In progress',
    color: 'text-[#9A6700]',
    borderColor: 'border-[#E9B949]',
    bgColor: 'bg-transparent',
    icon: Loader2,
  },
  complete: {
    label: 'Complete',
    color: 'text-[#0F7B6C]',
    borderColor: 'border-[#0F7B6C]',
    bgColor: 'bg-transparent',
    icon: Check,
  },
  skipped: {
    label: 'Skipped',
    color: 'text-[#9B9A97]',
    borderColor: 'border-[#D4D1CB]',
    bgColor: 'bg-transparent',
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
  isCapturingInput = false,
  onWriteResponse,
  onEditResponse,
  onDeleteMapping,
  onTalkToAtlas,
  onSkip,
  onUnskip,
}: TopicCardProps) {
  const [cardState, setCardState] = useState<CardState>('collapsed');
  const [writeValue, setWriteValue] = useState('');
  const [editValue, setEditValue] = useState(input?.user_response || '');

  const { getSourceFile, mappings } = useFiles();
  const sourceFile = input?.source_file_id ? getSourceFile(input.source_file_id) : undefined;

  // All document mappings for this specific topic (may come from multiple files)
  const topicMappings = mappings.filter((m: FileTopicMapping) => m.question_id === topicId);

  // Source type determination
  const isManual = input?.confidence_rationale === 'Direct user input without AI analysis';
  const isDocumentSourced = !!input?.source_file_id;
  const isConversation = !!input && !isManual && !isDocumentSourced;

  const topicConfig = getTopicConfig(topicId);

  // Determine status.
  // isCapturingInput takes priority over input so that re-discussing an already-
  // complete topic shows "In progress" while Atlas is actively recording a new capture.
  const status: TopicStatus = isSkipped
    ? 'skipped'
    : isCapturingInput
    ? 'in_progress'
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

          {/* Confidence rating - appears to left of status (filled with star) */}
          {confidenceCfg && (
            <span className={cn(
              'shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium',
              confidenceCfg.bgColor,
              confidenceCfg.color
            )}>
              {confidenceCfg.renderIcon(cn('h-3 w-3', confidenceCfg.iconColor))}
              {confidenceCfg.label}
            </span>
          )}

          {/* Source badge — indicates where the input came from */}
          {input && (
            <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-[#9B9A97] max-w-[120px]">
              {isDocumentSourced || topicMappings.length > 0 ? (
                <>
                  <Paperclip className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {(sourceFile?.filename ?? (topicMappings.length > 0 ? getSourceFile(topicMappings[0].file_id)?.filename : undefined) ?? 'Document').replace(/\.[^.]+$/, '')}
                  </span>
                </>
              ) : isManual ? (
                <>
                  <PenLine className="h-3 w-3 shrink-0" />
                  <span>You entered</span>
                </>
              ) : (
                <>
                  <MessageSquare className="h-3 w-3 shrink-0" />
                  <span>Atlas</span>
                </>
              )}
            </span>
          )}

          {/* Status indicator - stays in fixed position (outlined with icon) */}
          <span className={cn(
            'shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium',
            statusCfg.borderColor,
            statusCfg.bgColor,
            statusCfg.color
          )}>
            <StatusIcon status={status} className="h-3 w-3" />
            {statusCfg.label}
          </span>

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

            {/* Confidence rating - appears to left of status (filled with star) */}
            {confidenceCfg && (
              <span className={cn(
                'shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium',
                confidenceCfg.bgColor,
                confidenceCfg.color
              )}>
                {confidenceCfg.renderIcon(cn('h-3 w-3', confidenceCfg.iconColor))}
                {confidenceCfg.label}
              </span>
            )}

            {/* Status indicator - stays in fixed position (outlined with icon) */}
            <span className={cn(
              'shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium',
              statusCfg.borderColor,
              statusCfg.bgColor,
              statusCfg.color
            )}>
              <StatusIcon status={status} className="h-3 w-3" />
              {statusCfg.label}
            </span>

            <ChevronDown className="h-4 w-4 shrink-0 text-[#9B9A97] rotate-180" />
          </button>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Why This Matters */}
            {topicConfig?.description && (
              <div className="rounded-md overflow-hidden border border-[#E8E6E1]">
                <div className="bg-[#E8E6E1] px-3 py-1.5">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[#787674]">
                    Why This Matters
                  </h4>
                </div>
                <div className="bg-[#F7F6F3] px-3 py-2.5">
                  <p className="text-[13px] leading-relaxed text-[#5C5A56]">
                    {topicConfig.description}
                  </p>
                </div>
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

            {/* Sources — labelled by origin */}
            {input && (topicMappings.length > 0 || input.user_response) && (
              <div>
                <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-2">
                  Sources
                </h4>
                <div className="space-y-1.5">
                  {/* Document sources from file_topic_mappings — read-only with delete */}
                  {topicMappings.map((mapping) => {
                    const mappingFile = getSourceFile(mapping.file_id);
                    return (
                      <SourceRow
                        key={mapping.id}
                        icon={<Paperclip className="h-3.5 w-3.5 shrink-0 text-[#9B9A97]" />}
                        label={mappingFile?.filename ?? 'Document'}
                        content={mapping.extracted_content}
                        isReadOnly
                        onDelete={onDeleteMapping ? () => onDeleteMapping(mapping.id) : undefined}
                      />
                    );
                  })}

                  {/* Fallback: doc-sourced input but mappings not yet loaded */}
                  {isDocumentSourced && topicMappings.length === 0 && sourceFile && input.user_response && (
                    <SourceRow
                      icon={<Paperclip className="h-3.5 w-3.5 shrink-0 text-[#9B9A97]" />}
                      label={sourceFile.filename}
                      content={input.user_response}
                      isReadOnly
                    />
                  )}

                  {/* Atlas conversation source */}
                  {isConversation && input.user_response && (
                    <SourceRow
                      icon={<MessageSquare className="h-3.5 w-3.5 shrink-0 text-[#9B9A97]" />}
                      label="Atlas conversation"
                      content={input.user_response}
                    />
                  )}

                  {/* Manual entry source */}
                  {isManual && input.user_response && (
                    <SourceRow
                      icon={<PenLine className="h-3.5 w-3.5 shrink-0 text-[#9B9A97]" />}
                      label="You entered"
                      content={input.user_response}
                    />
                  )}
                </div>
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
                {/* Edit / Add context button */}
                {input && (
                  isDocumentSourced ? (
                    <button
                      onClick={handleWriteClick}
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-[#5C5A56] hover:bg-[#E8E6E1] transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add context
                    </button>
                  ) : (
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-[#5C5A56] hover:bg-[#E8E6E1] transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  )
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
              placeholder={isDocumentSourced
                ? "Add your own context or additional details not covered in the document..."
                : "Share your thoughts on this topic..."}
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

function StatusIcon({ status, className }: { status: TopicStatus; className?: string }) {
  const icons: Record<TopicStatus, typeof Check> = {
    not_started: Circle,
    in_progress: Loader2,
    complete: Check,
    skipped: SkipForward,
  };
  const Icon = icons[status];
  return <Icon className={cn(className, status === 'in_progress' && 'animate-spin')} />;
}

function SourceRow({
  icon,
  label,
  content,
  isReadOnly = false,
  onDelete,
}: {
  icon: React.ReactNode;
  label: string;
  content: string;
  isReadOnly?: boolean;
  onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-1 items-center gap-1.5 text-[11px] font-medium text-[#9B9A97] hover:text-[#5C5A56] transition-colors min-w-0"
        >
          <ChevronRight className={cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-90')} />
          {icon}
          <span className="truncate text-left">{label}</span>
          {isReadOnly && (
            <span className="ml-1 shrink-0 text-[10px] text-[#C2C0BC] italic">read-only</span>
          )}
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="shrink-0 p-0.5 text-[#C2C0BC] hover:text-[#E03E3E] transition-colors"
            aria-label="Remove this source"
            title="Remove this source from topic"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
      {open && (
        <div className="mt-1.5 ml-5 rounded-md bg-[#F7F6F3] border border-[#E8E6E1] px-3 py-2.5">
          <p className={cn(
            'text-[13px] leading-relaxed whitespace-pre-wrap',
            isReadOnly ? 'text-[#9B9A97] italic' : 'text-[#5C5A56]'
          )}>
            {content}
          </p>
        </div>
      )}
    </div>
  );
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
