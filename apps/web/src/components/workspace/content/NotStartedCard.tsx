'use client';

import { useState } from 'react';
import { ChevronDown, MessageSquare, PenLine, SkipForward, Circle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTopicConfig } from '@/lib/progress';

interface NotStartedCardProps {
  label: string;
  topicId?: string;
  isSkipped?: boolean;
  onWriteResponse: (response: string) => void;
  onTalkToAtlas: () => void;
  onSkip?: () => void;
  onUnskip?: () => void;
}

type CardState = 'collapsed' | 'expanded' | 'writing';

export function NotStartedCard({
  label,
  topicId,
  isSkipped = false,
  onWriteResponse,
  onTalkToAtlas,
  onSkip,
  onUnskip,
}: NotStartedCardProps) {
  const [cardState, setCardState] = useState<CardState>('collapsed');
  const [writeValue, setWriteValue] = useState('');

  const topicConfig = topicId ? getTopicConfig(topicId) : null;

  const handleCardClick = () => {
    if (cardState === 'writing') return;
    setCardState(cardState === 'collapsed' ? 'expanded' : 'collapsed');
  };

  const handleWriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCardState('writing');
  };

  const handleTalkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTalkToAtlas();
  };

  const handleSkipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSkip?.();
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

  return (
    <div
      className={cn(
        'rounded-lg border bg-white transition-all duration-150',
        cardState === 'collapsed'
          ? 'border-dashed border-[#D4D1CB] hover:border-[#9B9A97]'
          : 'border-solid border-[#D4D1CB] shadow-sm'
      )}
    >
      {/* Collapsed State */}
      {cardState === 'collapsed' && (
        <button
          onClick={handleCardClick}
          className="flex w-full items-center gap-3 px-4 py-3 text-left"
        >
          {isSkipped ? (
            <SkipForward className="h-4 w-4 shrink-0 text-[#9B9A97]" />
          ) : (
            <Circle className="h-4 w-4 shrink-0 text-[#D4D1CB]" />
          )}
          <span className={cn(
            'flex-1 text-[14px]',
            isSkipped ? 'text-[#9B9A97] line-through' : 'text-[#787774]'
          )}>
            {label}
          </span>
          {isSkipped ? (
            <span className="text-[11px] text-[#9B9A97] mr-2">Skipped</span>
          ) : null}
          <ChevronDown className="h-4 w-4 shrink-0 text-[#9B9A97]" />
        </button>
      )}

      {/* Expanded State - Shows options */}
      {cardState === 'expanded' && (
        <div>
          {/* Header */}
          <button
            onClick={handleCardClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-left border-b border-[#F1F0EC]"
          >
            <Circle className="h-4 w-4 shrink-0 text-[#D4D1CB]" />
            <span className="flex-1 text-[14px] font-medium text-[#37352F]">
              {label}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#9B9A97] rotate-180" />
          </button>

          {/* Why This Matters */}
          {topicConfig?.description && (
            <div className="px-4 py-3 border-b border-[#F1F0EC]">
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-1">
                Why This Matters
              </h4>
              <p className="text-[13px] leading-relaxed text-[#5C5A56]">
                {topicConfig.description}
              </p>
            </div>
          )}

          {/* Action Options */}
          <div className="p-4">
            <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-3">
              How would you like to proceed?
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {/* Write Response */}
              <button
                onClick={handleWriteClick}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[#E8E6E1] hover:border-[#2383E2] hover:bg-[#F7FBFF] transition-colors group"
              >
                <PenLine className="h-5 w-5 text-[#9B9A97] group-hover:text-[#2383E2]" />
                <span className="text-[12px] font-medium text-[#5C5A56] group-hover:text-[#2383E2]">
                  Write response
                </span>
              </button>

              {/* Talk to Atlas */}
              <button
                onClick={handleTalkClick}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[#E8E6E1] hover:border-[#2383E2] hover:bg-[#F7FBFF] transition-colors group"
              >
                <MessageSquare className="h-5 w-5 text-[#9B9A97] group-hover:text-[#2383E2]" />
                <span className="text-[12px] font-medium text-[#5C5A56] group-hover:text-[#2383E2]">
                  Talk to Atlas
                </span>
              </button>

              {/* Skip / Unskip */}
              {isSkipped ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnskip?.();
                    setCardState('collapsed');
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[#E8E6E1] hover:border-[#2383E2] hover:bg-[#F7FBFF] transition-colors group"
                >
                  <RotateCcw className="h-5 w-5 text-[#9B9A97] group-hover:text-[#2383E2]" />
                  <span className="text-[12px] font-medium text-[#5C5A56] group-hover:text-[#2383E2]">
                    Undo skip
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleSkipClick}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[#E8E6E1] hover:border-[#9B9A97] hover:bg-[#FAF9F7] transition-colors group"
                >
                  <SkipForward className="h-5 w-5 text-[#9B9A97]" />
                  <span className="text-[12px] font-medium text-[#9B9A97]">
                    Skip for now
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Writing State */}
      {cardState === 'writing' && (
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F1F0EC]">
            <PenLine className="h-4 w-4 shrink-0 text-[#2383E2]" />
            <span className="flex-1 text-[14px] font-medium text-[#37352F]">
              {label}
            </span>
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
    </div>
  );
}
