'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type { DomainType, Input } from '@atlas/types';
import {
  calculateFullProgressState,
  getTopicLabel,
  type ProgressState,
} from '../progress';
import type { CapturedInputNotification } from '@/components/progress/input-notification';

// ============================================
// Context Types
// ============================================

interface ProgressContextValue {
  progressState: ProgressState;
  isPanelOpen: boolean;
  scrollToDomain: DomainType | null;
  notifications: CapturedInputNotification[];

  openPanel: (scrollTo?: DomainType) => void;
  closePanel: () => void;
  addNotification: (input: Input) => void;
  dismissNotification: (id: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

// ============================================
// Provider
// ============================================

interface ProgressProviderProps {
  children: ReactNode;
  inputs: Input[];
  currentDomain: DomainType;
}

export function ProgressProvider({
  children,
  inputs,
  currentDomain,
}: ProgressProviderProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [scrollToDomain, setScrollToDomain] = useState<DomainType | null>(null);
  const [notifications, setNotifications] = useState<CapturedInputNotification[]>([]);
  const notificationCountRef = useRef(0);

  // Calculate progress state from inputs - memoized
  const progressState = useMemo(
    () => calculateFullProgressState(inputs, currentDomain),
    [inputs, currentDomain]
  );

  const openPanel = useCallback((scrollTo?: DomainType) => {
    setIsPanelOpen(true);
    setScrollToDomain(scrollTo ?? null);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setScrollToDomain(null);
  }, []);

  const addNotification = useCallback((input: Input) => {
    const notification: CapturedInputNotification = {
      id: `notif-${++notificationCountRef.current}`,
      topicLabel: getTopicLabel(input.question_id),
      domain: input.domain,
      confidence: input.confidence_level,
      timestamp: Date.now(),
    };

    setNotifications((prev) => {
      // Keep max 5 in the queue (only 3 shown at a time)
      const updated = [...prev, notification];
      return updated.slice(-5);
    });
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value: ProgressContextValue = {
    progressState,
    isPanelOpen,
    scrollToDomain,
    notifications,
    openPanel,
    closePanel,
    addNotification,
    dismissNotification,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
