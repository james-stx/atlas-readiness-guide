'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import type { DomainType } from '@atlas/types';
import type { DomainInsight } from '@/components/workspace/DomainInsightModal';

const DOMAIN_ORDER: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];
const TOPICS_PER_DOMAIN = 5;

export function useDomainCompletionInsight() {
  const { progressState } = useWorkspace();
  const { session } = useAssessment();

  const [insightDomain, setInsightDomain] = useState<DomainType | null>(null);
  const [insight, setInsight] = useState<DomainInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track previous topic counts to detect transitions
  const prevCountsRef = useRef<Partial<Record<DomainType, number>>>({});
  // Track which domains have already shown their insight this session
  const shownRef = useRef<Set<DomainType>>(new Set());
  // Guard: skip firing on the very first render (already-complete domains at page load)
  const mountedRef = useRef(false);

  useEffect(() => {
    const domainProgress = progressState.domainProgress;
    if (!domainProgress || !session) return;

    if (!mountedRef.current) {
      // First render: initialise prevCountsRef without triggering any modal
      for (const domain of DOMAIN_ORDER) {
        const dp = domainProgress[domain];
        prevCountsRef.current[domain] = dp?.coveredTopics?.length ?? 0;
      }
      mountedRef.current = true;
      return;
    }

    // Subsequent renders: look for new completions
    for (const domain of DOMAIN_ORDER) {
      const dp = domainProgress[domain];
      const current = dp?.coveredTopics?.length ?? 0;
      const prev = prevCountsRef.current[domain] ?? 0;

      if (current >= TOPICS_PER_DOMAIN && prev < TOPICS_PER_DOMAIN && !shownRef.current.has(domain)) {
        shownRef.current.add(domain);
        prevCountsRef.current[domain] = current;

        // Trigger the insight fetch
        setInsightDomain(domain);
        setInsight(null);
        setIsLoading(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

        fetch(`${apiUrl}/api/domain/insight`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: session.id, domain }),
        })
          .then((res) => res.json())
          .then((data: { insight: DomainInsight | null }) => {
            if (data.insight) {
              setInsight(data.insight);
            } else {
              // API returned null — dismiss silently
              setInsightDomain(null);
            }
            setIsLoading(false);
          })
          .catch(() => {
            // Network error — dismiss silently
            setInsightDomain(null);
            setIsLoading(false);
          });

        // Only show one insight at a time; break after first detected transition
        break;
      }

      prevCountsRef.current[domain] = current;
    }
  }, [progressState.domainProgress, session]);

  const dismissInsight = useCallback(() => {
    setInsightDomain(null);
    setInsight(null);
    setIsLoading(false);
  }, []);

  return { insightDomain, insight, isLoading, dismissInsight };
}
