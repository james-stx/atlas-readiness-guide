'use client';

import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { DOMAIN_TOPICS } from '@/lib/progress';
import { EmptyState } from './EmptyState';
import { ContentDomainHeader } from './ContentDomainHeader';
import { TopicCard } from './TopicCard';
import { ReportPanel } from '../report/ReportPanel';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useSkippedTopics } from '@/lib/hooks/use-skipped-topics';
import type { Input } from '@atlas/types';

export function ContentPanel() {
  const {
    selectedDomain,
    selectedCategory,
    getDomainInputCount,
    selectCategory,
    discussTopic,
    progressState,
    activeView,
  } = useWorkspace();
  const { inputs, addInput, session } = useAssessment();
  const { isSkipped, skipTopic, unskipTopic } = useSkippedTopics();
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll to selected category
  useEffect(() => {
    if (selectedCategory && categoryRefs.current[selectedCategory]) {
      categoryRefs.current[selectedCategory]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedCategory]);

  if (!selectedDomain) {
    return (
      <div className="flex-1 overflow-y-auto bg-white workspace-panel">
        <EmptyState />
      </div>
    );
  }

  const topics = DOMAIN_TOPICS[selectedDomain] || [];
  const domainInputs = inputs.filter((i) => i.domain === selectedDomain);
  const count = getDomainInputCount(selectedDomain);
  const dp = progressState.domainProgress[selectedDomain];
  // Open chat and start discussing a topic - explicit user action via "Talk to Atlas" button
  const handleDiscussTopic = useCallback((topicId: string) => {
    discussTopic(selectedDomain, topicId);
  }, [selectedDomain, discussTopic]);

  // Just highlight the topic in domain header without opening chat
  const handleTopicSelect = useCallback((topicId: string) => {
    selectCategory(selectedDomain, topicId);
    // Don't auto-open chat - let user choose
  }, [selectedDomain, selectCategory]);

  // Handle direct write response from NotStartedCard
  const handleWriteResponse = useCallback((topicId: string, response: string) => {
    if (!session || !selectedDomain) return;

    // Create a new input with user's direct response
    const newInput: Input = {
      id: `input-${Date.now()}`,
      session_id: session.id,
      question_id: topicId,
      domain: selectedDomain,
      user_response: response,
      confidence_level: 'medium', // Default confidence for direct writes
      confidence_rationale: 'Direct user input without AI analysis',
      extracted_data: {
        keyInsight: 'Response provided directly by user.',
        summary: response.slice(0, 150) + (response.length > 150 ? '...' : ''),
        strengths: [],
        considerations: ['Consider discussing with Atlas to develop this further.'],
      },
      created_at: new Date().toISOString(),
    };

    addInput(newInput);
  }, [session, selectedDomain, addInput]);

  // If viewing report, render ReportPanel instead
  if (activeView === 'report') {
    return <ReportPanel />;
  }

  return (
    <div
      className="flex-1 overflow-y-auto bg-white workspace-panel"
      role="main"
      aria-label="Assessment content"
    >
      <div className="mx-auto max-w-[720px] px-8 py-8">
        {/* Domain header with insight card */}
        <ContentDomainHeader
          domain={selectedDomain}
          count={count}
          domainProgress={dp}
          onTopicSelect={handleTopicSelect}
        />

        {/* All Topics - Unified cards */}
        <div className="space-y-3">
          {topics.map((topic) => {
            const input = domainInputs.find((i) => i.question_id === topic.id);
            return (
              <div
                key={topic.id}
                ref={(el) => {
                  categoryRefs.current[topic.id] = el;
                }}
              >
                <TopicCard
                  topicId={topic.id}
                  label={topic.label}
                  input={input}
                  isSkipped={isSkipped(topic.id)}
                  isHighlighted={selectedCategory === topic.id}
                  onWriteResponse={(response) => handleWriteResponse(topic.id, response)}
                  onTalkToAtlas={() => handleDiscussTopic(topic.id)}
                  onSkip={() => skipTopic(topic.id)}
                  onUnskip={() => unskipTopic(topic.id)}
                />
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
