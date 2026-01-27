'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import type { DomainType, Input } from '@atlas/types';
import { ConfidenceBadge, ConfidenceIcon } from './confidence-badge';
import { DOMAIN_TOPICS, type DomainProgress } from '@/lib/progress';

interface DomainAccordionProps {
  domain: DomainType;
  label: string;
  progress: DomainProgress;
  inputs: Input[];
  defaultExpanded?: boolean;
  className?: string;
}

export function DomainAccordion({
  domain,
  label,
  progress,
  inputs,
  defaultExpanded = false,
  className,
}: DomainAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const topics = DOMAIN_TOPICS[domain];
  const domainInputs = inputs.filter((i) => i.domain === domain);
  const coveredCount = progress.coveredTopics.length;
  const fillPercent = (coveredCount / topics.length) * 100;

  const headerId = `${domain}-header`;
  const contentId = `${domain}-content`;

  return (
    <div
      className={cn(
        'border border-slate-200 rounded-xl overflow-hidden',
        'transition-colors duration-150',
        !isExpanded && 'hover:bg-slate-50',
        className
      )}
    >
      {/* Header - clickable to expand/collapse */}
      <button
        id={headerId}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-300"
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        {/* Chevron */}
        <ChevronRight
          className={cn(
            'w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-150',
            isExpanded && 'rotate-90'
          )}
        />

        {/* Domain name */}
        <span className="text-sm font-semibold uppercase tracking-wide text-slate-900 flex-1">
          {label}
        </span>

        {/* Mini progress bar */}
        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden flex-shrink-0">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${fillPercent}%` }}
          />
        </div>

        {/* Count */}
        <span className="text-xs font-medium text-slate-500 flex-shrink-0 w-8 text-right">
          {coveredCount}/{topics.length}
        </span>
      </button>

      {/* Expandable content */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={cn(
          'grid transition-[grid-template-rows] duration-150 ease-out',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 border-t border-slate-100">
            {/* Key Topics section */}
            <div className="mt-4">
              <h4 className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">
                Key Topics
              </h4>
              <div className="space-y-0.5">
                {topics.map((topic) => {
                  const isCovered = progress.coveredTopics.includes(topic.id);
                  const matchingInput = domainInputs.find(
                    (i) => i.question_id === topic.id
                  );

                  return (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between h-9 px-1"
                    >
                      <div className="flex items-center gap-2">
                        {/* Checkmark or empty */}
                        {isCovered ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            className="text-primary flex-shrink-0"
                          >
                            <path
                              d="M3 8L6.5 11.5L13 5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
                        )}
                        <span
                          className={cn(
                            'text-sm',
                            isCovered
                              ? 'text-slate-700 font-medium'
                              : 'text-slate-400'
                          )}
                        >
                          {topic.label}
                        </span>
                      </div>

                      {/* Confidence indicator */}
                      {matchingInput ? (
                        <ConfidenceBadge
                          confidence={matchingInput.confidence_level}
                          variant="compact"
                        />
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Captured Inputs section */}
            {domainInputs.length > 0 && (
              <div className="mt-4">
                <h4 className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">
                  Captured Inputs
                </h4>
                <div className="space-y-2">
                  {domainInputs.slice(0, 3).map((input) => {
                    const topicConfig = topics.find(
                      (t) => t.id === input.question_id
                    );
                    const preview =
                      input.user_response.length > 100
                        ? input.user_response.slice(0, 100) + '...'
                        : input.user_response;

                    return (
                      <div
                        key={input.id}
                        className="bg-slate-50 rounded-lg p-3"
                      >
                        <p className="text-sm text-slate-700 line-clamp-2">
                          &ldquo;{preview}&rdquo;
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-500">
                            {topicConfig?.label || input.question_id}
                          </span>
                          <span className="text-slate-300">·</span>
                          <ConfidenceBadge
                            confidence={input.confidence_level}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {domainInputs.length > 3 && (
                    <p className="text-xs font-medium text-primary">
                      +{domainInputs.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
