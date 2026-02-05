'use client';

import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { DOMAIN_TOPICS, DOMAINS } from '@/lib/progress';
import { EmptyState } from './EmptyState';
import { ContentDomainHeader } from './ContentDomainHeader';
import { CategoryCard } from './CategoryCard';
import { NotStartedCard } from './NotStartedCard';
import { InlineSnapshotCTA } from './InlineSnapshotCTA';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';
import { useEffect, useRef } from 'react';

export function ContentPanel() {
  const {
    selectedDomain,
    selectedCategory,
    getDomainInputCount,
    selectCategory,
    openChat,
    progressState,
  } = useWorkspace();
  const { inputs, isLoading } = useAssessment();
  const scrollRef = useRef<HTMLDivElement>(null);
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
  const domainInfo = DOMAINS.find((d) => d.key === selectedDomain);
  const dp = progressState.domainProgress[selectedDomain];
  const showSnapshotCTA = count.total > 0 && count.current / count.total >= 0.6;

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto bg-white workspace-panel"
      role="main"
      aria-label="Assessment content"
    >
      <div className="mx-auto max-w-content px-8 py-6">
        {isLoading && inputs.length === 0 ? (
          <SkeletonLoader lines={5} lineHeight={48} gap={8} />
        ) : (
          <>
            <ContentDomainHeader domain={selectedDomain} count={count} />

            <div className="space-y-2">
              {topics.map((topic) => {
                const input = domainInputs.find(
                  (i) => i.question_id === topic.id
                );

                return (
                  <div
                    key={topic.id}
                    ref={(el) => { categoryRefs.current[topic.id] = el; }}
                  >
                    {input ? (
                      <CategoryCard
                        input={input}
                        isHighlighted={selectedCategory === topic.id}
                        onEdit={() => {
                          selectCategory(selectedDomain, topic.id);
                          openChat(selectedDomain);
                        }}
                        onViewChat={() => {
                          selectCategory(selectedDomain, topic.id);
                          openChat(selectedDomain);
                        }}
                        onRemove={() => {
                          // TODO: Implement input removal via API
                        }}
                      />
                    ) : (
                      <NotStartedCard
                        label={topic.label}
                        onClick={() => {
                          selectCategory(selectedDomain, topic.id);
                          openChat(selectedDomain);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {showSnapshotCTA && (
              <InlineSnapshotCTA
                domainLabel={domainInfo?.label ?? selectedDomain}
                covered={count.current}
                total={count.total}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
