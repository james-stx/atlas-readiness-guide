'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'atlas-skipped-topics';

/**
 * Hook to manage skipped topics
 * Stored in localStorage so persists across sessions but not synced to backend
 */
export function useSkippedTopics() {
  const [skippedTopics, setSkippedTopics] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setSkippedTopics(new Set(parsed));
      }
    } catch {
      // Ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when skippedTopics changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...skippedTopics]));
    }
  }, [skippedTopics, isLoaded]);

  const skipTopic = useCallback((topicId: string) => {
    setSkippedTopics((prev) => new Set([...prev, topicId]));
  }, []);

  const unskipTopic = useCallback((topicId: string) => {
    setSkippedTopics((prev) => {
      const next = new Set(prev);
      next.delete(topicId);
      return next;
    });
  }, []);

  const isSkipped = useCallback(
    (topicId: string) => skippedTopics.has(topicId),
    [skippedTopics]
  );

  const toggleSkip = useCallback(
    (topicId: string) => {
      if (skippedTopics.has(topicId)) {
        unskipTopic(topicId);
      } else {
        skipTopic(topicId);
      }
    },
    [skippedTopics, skipTopic, unskipTopic]
  );

  return {
    skippedTopics,
    skipTopic,
    unskipTopic,
    isSkipped,
    toggleSkip,
    skippedCount: skippedTopics.size,
  };
}
