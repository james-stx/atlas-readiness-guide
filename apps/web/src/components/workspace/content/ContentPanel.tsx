'use client';

import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { DOMAIN_TOPICS } from '@/lib/progress';
import { EmptyState } from './EmptyState';
import { ContentDomainHeader } from './ContentDomainHeader';
import { InsightCard } from './InsightCard';
import { NotStartedCard } from './NotStartedCard';
import { InlineSnapshotCTA } from './InlineSnapshotCTA';
import { useEffect, useRef, useCallback } from 'react';
import type { Input } from '@atlas/types';

export function ContentPanel() {
  const {
    selectedDomain,
    selectedCategory,
    getDomainInputCount,
    selectCategory,
    openChat,
    progressState,
  } = useWorkspace();
  const { inputs, addInput, session } = useAssessment();
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
  const showSnapshotCTA = count.total > 0 && count.current / count.total >= 0.6;

  // Open chat and focus on a topic - explicit user action
  const handleDiscussTopic = useCallback((topicId: string) => {
    selectCategory(selectedDomain, topicId);
    openChat(selectedDomain);
  }, [selectedDomain, selectCategory, openChat]);

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
      extracted_data: {
        keyInsight: 'Response provided directly by user.',
        summary: response.slice(0, 150) + (response.length > 150 ? '...' : ''),
        strengths: [],
        considerations: ['Consider discussing with Atlas to develop this further.'],
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addInput(newInput);
  }, [session, selectedDomain, addInput]);

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

        {/* Insight Cards - Topics with inputs */}
        {domainInputs.length > 0 && (
          <div className="space-y-3 mb-6">
            {domainInputs.map((input) => (
              <div
                key={input.id}
                ref={(el) => {
                  categoryRefs.current[input.question_id] = el;
                }}
              >
                <InsightCard
                  input={input}
                  isHighlighted={selectedCategory === input.question_id}
                  onDiscuss={() => handleDiscussTopic(input.question_id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Not Yet Explored - Topics without inputs */}
        {topics.filter((t) => !domainInputs.find((i) => i.question_id === t.id)).length > 0 && (
          <div className="mt-6">
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97] mb-3">
              Not Yet Explored
            </h3>
            <div className="space-y-2">
              {topics
                .filter((topic) => !domainInputs.find((i) => i.question_id === topic.id))
                .map((topic) => (
                  <NotStartedCard
                    key={topic.id}
                    label={topic.label}
                    topicId={topic.id}
                    onWriteResponse={(response) => handleWriteResponse(topic.id, response)}
                    onTalkToAtlas={() => handleDiscussTopic(topic.id)}
                    onSkip={() => {
                      // Skip just collapses the card - no action needed
                    }}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Snapshot CTA */}
        {showSnapshotCTA && (
          <InlineSnapshotCTA
            domainLabel={dp.status === 'adequate' ? 'this domain' : selectedDomain}
            covered={count.current}
            total={count.total}
          />
        )}
      </div>
    </div>
  );
}
