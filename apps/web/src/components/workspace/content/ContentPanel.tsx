'use client';

import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { DOMAIN_TOPICS } from '@/lib/progress';
import { EmptyState } from './EmptyState';
import { ContentDomainHeader } from './ContentDomainHeader';
import { TopicCard } from './TopicCard';
import { ReportPanel } from '../report/ReportPanel';
import { useEffect, useRef, useCallback } from 'react';
import { useSkippedTopics } from '@/lib/hooks/use-skipped-topics';
import type { Input } from '@atlas/types';

export function ContentPanel() {
  const {
    selectedDomain,
    selectedCategory,
    getDomainInputCount,
    selectCategory,
    selectDomain,
    discussTopic,
    progressState,
    activeView,
  } = useWorkspace();
  const { inputs, addInput, session, isLoading, capturingTopicId } = useAssessment();
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

  // When a request is in flight, ensure the content panel is showing the domain
  // where capture is actually happening (session.current_domain). Without this,
  // a domain mismatch means firstUncapturedTopicId never matches any visible topic.
  useEffect(() => {
    if (isLoading && session?.current_domain && selectedDomain !== session.current_domain) {
      selectDomain(session.current_domain);
    }
  }, [isLoading, session?.current_domain, selectedDomain, selectDomain]);

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

  // Compute the in-progress topic using session.current_domain (where capture
  // is happening) rather than selectedDomain (what the user is browsing).
  // If domains match this is identical; if they differ we get the right result
  // on the next render after the selectDomain() effect above fires.
  const sessionDomain = session?.current_domain ?? selectedDomain;
  const sessionInputs = inputs.filter((i) => i.domain === sessionDomain);
  const sessionTopics = DOMAIN_TOPICS[sessionDomain] || [];

  // First uncaptured, non-skipped topic in the session's active domain.
  const firstUncapturedTopicId = sessionTopics.find(
    (t) => !sessionInputs.find((i) => i.question_id === t.id) && !isSkipped(t.id)
  )?.id;

  // No intermediate — showInProgress is computed per-topic below.

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
      {/* Sticky domain header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto max-w-[720px] px-8 pt-6 pb-4">
          <ContentDomainHeader
            domain={selectedDomain}
            count={count}
            domainProgress={dp}
            onTopicSelect={handleTopicSelect}
          />
        </div>
      </div>

      {/* Scrollable topic cards */}
      <div className="mx-auto max-w-[720px] px-8 pt-4 pb-8">
        <div className="space-y-3">
          {topics.map((topic) => {
            const input = domainInputs.find((i) => i.question_id === topic.id);
            // Show in-progress while a request is in flight for this topic.
            // Priority order (all require isLoading=true):
            //   1. selectedCategory — set the instant user clicks "Talk to Atlas"; no SSE
            //      events needed; works for re-discussions (already-captured topics too).
            //   2. capturingTopicId — SSE-confirmed from tool_start or input events.
            //   3. firstUncapturedTopicId — heuristic fallback for generic typed messages.
            const showInProgress =
              isLoading &&
              !isSkipped(topic.id) &&
              (topic.id === selectedCategory ||
                topic.id === capturingTopicId ||
                (!input && topic.id === firstUncapturedTopicId));
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
                  isCapturingInput={showInProgress}
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
