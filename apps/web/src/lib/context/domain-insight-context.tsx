'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import { useWorkspace } from './workspace-context';
import { useAssessment } from './assessment-context';
import type { DomainType } from '@atlas/types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DomainInsight {
  domain: DomainType;
  readinessLevel: 'strong' | 'developing' | 'early';
  headline: string;
  narrative: string;
  strengths: string[];
  gaps: string[];
  nextStep: string;
}

type InsightEntry = {
  insight: DomainInsight;
  inputCountAtGeneration: number;
  viewedAt: string | null;
};

interface DomainInsightContextValue {
  entries: Partial<Record<DomainType, InsightEntry>>;
  generatingDomain: DomainType | null;
  newlyReadyDomain: DomainType | null;
  isStale: (domain: DomainType) => boolean;
  isNew: (domain: DomainType) => boolean;
  refreshInsight: (domain: DomainType) => void;
  markViewed: (domain: DomainType) => void;
  dismissNew: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const DomainInsightContext = createContext<DomainInsightContextValue | null>(null);

const DOMAIN_ORDER: DomainType[] = ['market', 'product', 'gtm', 'operations', 'financials'];
const TOPICS_PER_DOMAIN = 5;

// ─── Provider ────────────────────────────────────────────────────────────────

export function DomainInsightProvider({ children }: { children: ReactNode }) {
  const { progressState } = useWorkspace();
  const { session } = useAssessment();

  const [entries, setEntries] = useState<Partial<Record<DomainType, InsightEntry>>>({});
  const [generatingDomain, setGeneratingDomain] = useState<DomainType | null>(null);
  const [newlyReadyDomain, setNewlyReadyDomain] = useState<DomainType | null>(null);

  const prevCountsRef = useRef<Partial<Record<DomainType, number>>>({});
  const mountedRef = useRef(false);
  // Stable ref for session so doFetch doesn't need it as a dependency
  const sessionRef = useRef(session);
  sessionRef.current = session;

  // Load from localStorage when session becomes available, then auto-fetch for any
  // completed domain that has no stored entry (handles page reloads and redeployments)
  useEffect(() => {
    if (!session) return;

    let loadedEntries: Partial<Record<DomainType, InsightEntry>> = {};
    try {
      const raw = localStorage.getItem(`atlas-chapter-insights-${session.id}`);
      if (raw) loadedEntries = JSON.parse(raw);
    } catch {
      // ignore storage errors
    }
    setEntries(loadedEntries);

    // Auto-fetch insight for completed domains with no stored entry
    const domainProgress = progressState.domainProgress;
    for (const domain of DOMAIN_ORDER) {
      const dp = domainProgress[domain];
      const current = dp?.coveredTopics?.length ?? 0;
      if (current >= TOPICS_PER_DOMAIN && !loadedEntries[domain]) {
        doFetch(domain, current);
        break; // one at a time on initial load
      }
    }
  }, [session?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to localStorage whenever entries change
  useEffect(() => {
    if (!session) return;
    try {
      localStorage.setItem(
        `atlas-chapter-insights-${session.id}`,
        JSON.stringify(entries)
      );
    } catch {
      // ignore storage errors
    }
  }, [entries, session?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stable fetch helper — uses sessionRef to avoid stale closure
  const doFetch = useCallback((domain: DomainType, inputCount: number) => {
    const s = sessionRef.current;
    if (!s) return;

    setGeneratingDomain(domain);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

    fetch(`${apiUrl}/api/domain/insight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: s.id, domain }),
    })
      .then((res) => res.json())
      .then((data: { insight: DomainInsight | null }) => {
        if (data.insight) {
          const entry: InsightEntry = {
            insight: data.insight,
            inputCountAtGeneration: inputCount,
            viewedAt: null,
          };
          setEntries((prev) => ({ ...prev, [domain]: entry }));
          setNewlyReadyDomain(domain);
        }
        setGeneratingDomain(null);
      })
      .catch(() => {
        setGeneratingDomain(null);
      });
  }, []); // stable — reads session via ref

  // Watch domain progress for completions (transition from < 5 → >= 5 topics)
  useEffect(() => {
    const domainProgress = progressState.domainProgress;
    if (!domainProgress || !session) return;

    if (!mountedRef.current) {
      // First render: initialise prevCountsRef without triggering any fetch
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

      if (current >= TOPICS_PER_DOMAIN && prev < TOPICS_PER_DOMAIN) {
        prevCountsRef.current[domain] = current;
        doFetch(domain, current);
        break; // one at a time
      }

      prevCountsRef.current[domain] = current;
    }
  }, [progressState.domainProgress, session, doFetch]);

  const isStale = useCallback(
    (domain: DomainType): boolean => {
      const entry = entries[domain];
      if (!entry) return false;
      const dp = progressState.domainProgress[domain];
      const current = dp?.coveredTopics?.length ?? 0;
      return current > entry.inputCountAtGeneration;
    },
    [entries, progressState.domainProgress]
  );

  const isNew = useCallback(
    (domain: DomainType): boolean => {
      const entry = entries[domain];
      return !!entry && entry.viewedAt === null;
    },
    [entries]
  );

  const markViewed = useCallback((domain: DomainType) => {
    setEntries((prev) => {
      const entry = prev[domain];
      if (!entry || entry.viewedAt !== null) return prev;
      return { ...prev, [domain]: { ...entry, viewedAt: new Date().toISOString() } };
    });
  }, []);

  const refreshInsight = useCallback(
    (domain: DomainType) => {
      const dp = progressState.domainProgress[domain];
      const current = dp?.coveredTopics?.length ?? 0;
      doFetch(domain, current);
    },
    [doFetch, progressState.domainProgress]
  );

  const dismissNew = useCallback(() => {
    setNewlyReadyDomain(null);
  }, []);

  return (
    <DomainInsightContext.Provider
      value={{
        entries,
        generatingDomain,
        newlyReadyDomain,
        isStale,
        isNew,
        refreshInsight,
        markViewed,
        dismissNew,
      }}
    >
      {children}
    </DomainInsightContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useDomainInsight(): DomainInsightContextValue {
  const ctx = useContext(DomainInsightContext);
  if (!ctx) throw new Error('useDomainInsight must be used within DomainInsightProvider');
  return ctx;
}
