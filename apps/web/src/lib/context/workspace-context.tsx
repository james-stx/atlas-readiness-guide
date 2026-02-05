'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { DomainType } from '@atlas/types';
import { useAssessment } from './assessment-context';
import { calculateFullProgressState, DOMAIN_TOPICS } from '../progress';
import type { ProgressState } from '../progress';

// ============================================
// Types
// ============================================

type MobileTab = 'domains' | 'content' | 'chat';

interface WorkspaceState {
  // Navigation
  selectedDomain: DomainType | null;
  expandedDomains: DomainType[];
  selectedCategory: string | null;

  // Chat panel — hidden by default, slides in on category select
  isChatOpen: boolean;
  chatDomain: DomainType | null;

  // Mobile
  mobileTab: MobileTab;

  // Sidebar collapsed (tablet)
  isSidebarCollapsed: boolean;
}

type WorkspaceAction =
  | { type: 'SELECT_DOMAIN'; payload: DomainType }
  | { type: 'SELECT_CATEGORY'; payload: { domain: DomainType; categoryId: string } }
  | { type: 'TOGGLE_DOMAIN_EXPAND'; payload: DomainType }
  | { type: 'OPEN_CHAT'; payload?: DomainType }
  | { type: 'CLOSE_CHAT' }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_MOBILE_TAB'; payload: MobileTab }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'RESTORE_STATE'; payload: Partial<WorkspaceState> };

// ============================================
// Initial State
// ============================================

const STORAGE_KEY = 'atlas-workspace-state';

function getInitialState(): WorkspaceState {
  // Restore persisted nav state if available
  let restoredDomain: DomainType | null = 'market';
  let restoredExpanded: DomainType[] = ['market'];

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.selectedDomain) restoredDomain = parsed.selectedDomain;
        if (parsed.expandedDomains) restoredExpanded = parsed.expandedDomains;
      }
    } catch {
      // Ignore parse errors
    }
  }

  return {
    selectedDomain: restoredDomain,
    expandedDomains: restoredExpanded,
    selectedCategory: null,
    isChatOpen: false, // Chat hidden by default — opens on category select
    chatDomain: null,
    mobileTab: 'content', // Default to content view on mobile
    isSidebarCollapsed: false,
  };
}

// ============================================
// Reducer
// ============================================

function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction
): WorkspaceState {
  switch (action.type) {
    case 'SELECT_DOMAIN': {
      const domain = action.payload;
      const expanded = state.expandedDomains.includes(domain)
        ? state.expandedDomains
        : [...state.expandedDomains, domain];
      return {
        ...state,
        selectedDomain: domain,
        expandedDomains: expanded,
        selectedCategory: null,
        // Selecting a domain does NOT open chat — only category select does
      };
    }

    case 'SELECT_CATEGORY':
      return {
        ...state,
        selectedDomain: action.payload.domain,
        selectedCategory: action.payload.categoryId,
        chatDomain: action.payload.domain,
        isChatOpen: true, // Category select opens chat
        expandedDomains: state.expandedDomains.includes(action.payload.domain)
          ? state.expandedDomains
          : [...state.expandedDomains, action.payload.domain],
      };

    case 'TOGGLE_DOMAIN_EXPAND': {
      const domain = action.payload;
      const expanded = state.expandedDomains.includes(domain)
        ? state.expandedDomains.filter((d) => d !== domain)
        : [...state.expandedDomains, domain];
      return { ...state, expandedDomains: expanded };
    }

    case 'OPEN_CHAT':
      return {
        ...state,
        isChatOpen: true,
        chatDomain: action.payload ?? state.selectedDomain ?? 'market',
      };

    case 'CLOSE_CHAT':
      return { ...state, isChatOpen: false };

    case 'TOGGLE_CHAT':
      return { ...state, isChatOpen: !state.isChatOpen };

    case 'SET_MOBILE_TAB':
      return { ...state, mobileTab: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };

    case 'RESTORE_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// ============================================
// Context
// ============================================

interface WorkspaceContextValue extends WorkspaceState {
  // Navigation
  selectDomain: (domain: DomainType) => void;
  selectCategory: (domain: DomainType, categoryId: string) => void;
  toggleDomainExpand: (domain: DomainType) => void;

  // Chat
  openChat: (domain?: DomainType) => void;
  closeChat: () => void;
  toggleChat: () => void;

  // Mobile
  setMobileTab: (tab: MobileTab) => void;

  // Sidebar
  toggleSidebar: () => void;

  // Progress (derived from assessment context)
  progressState: ProgressState;

  // Domain topic helpers
  getTopicsForDomain: (domain: DomainType) => { id: string; label: string; covered: boolean }[];
  getDomainInputCount: (domain: DomainType) => { current: number; total: number };
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

// ============================================
// Provider
// ============================================

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, undefined, getInitialState);
  const { inputs, session } = useAssessment();

  // Calculate progress from assessment inputs
  const progressState = calculateFullProgressState(
    inputs,
    session?.current_domain ?? 'market'
  );

  // Persist workspace state to localStorage
  useEffect(() => {
    if (state.selectedDomain) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedDomain: state.selectedDomain,
        expandedDomains: state.expandedDomains,
      }));
    }
  }, [state.selectedDomain, state.expandedDomains]);

  // Actions
  const selectDomain = useCallback((domain: DomainType) => {
    dispatch({ type: 'SELECT_DOMAIN', payload: domain });
  }, []);

  const selectCategory = useCallback((domain: DomainType, categoryId: string) => {
    dispatch({ type: 'SELECT_CATEGORY', payload: { domain, categoryId } });
  }, []);

  const toggleDomainExpand = useCallback((domain: DomainType) => {
    dispatch({ type: 'TOGGLE_DOMAIN_EXPAND', payload: domain });
  }, []);

  const openChat = useCallback((domain?: DomainType) => {
    dispatch({ type: 'OPEN_CHAT', payload: domain });
  }, []);

  const closeChat = useCallback(() => {
    dispatch({ type: 'CLOSE_CHAT' });
  }, []);

  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  const setMobileTab = useCallback((tab: MobileTab) => {
    dispatch({ type: 'SET_MOBILE_TAB', payload: tab });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  // Helpers
  const getTopicsForDomain = useCallback(
    (domain: DomainType) => {
      const topics = DOMAIN_TOPICS[domain] || [];
      const dp = progressState.domainProgress[domain];
      return topics.map((t) => ({
        id: t.id,
        label: t.label,
        covered: dp.coveredTopics.includes(t.id),
      }));
    },
    [progressState]
  );

  const getDomainInputCount = useCallback(
    (domain: DomainType) => {
      const topics = DOMAIN_TOPICS[domain] || [];
      const dp = progressState.domainProgress[domain];
      return { current: dp.coveredTopics.length, total: topics.length };
    },
    [progressState]
  );

  const value: WorkspaceContextValue = {
    ...state,
    selectDomain,
    selectCategory,
    toggleDomainExpand,
    openChat,
    closeChat,
    toggleChat,
    setMobileTab,
    toggleSidebar,
    progressState,
    getTopicsForDomain,
    getDomainInputCount,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
