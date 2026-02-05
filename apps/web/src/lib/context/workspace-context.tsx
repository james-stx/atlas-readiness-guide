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

type WorkspaceStage = 'chat-first' | 'full';
type MobileTab = 'domains' | 'content' | 'chat';

interface WorkspaceState {
  // Navigation
  selectedDomain: DomainType | null;
  expandedDomains: DomainType[];
  selectedCategory: string | null;

  // Chat panel
  isChatOpen: boolean;
  chatDomain: DomainType | null;

  // First-run
  hasSeenWorkspace: boolean;
  contentPanelRevealed: boolean;
  workspaceStage: WorkspaceStage;
  showOnboardingTooltip: boolean;

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
  | { type: 'REVEAL_CONTENT_PANEL' }
  | { type: 'DISMISS_ONBOARDING_TOOLTIP' }
  | { type: 'SET_MOBILE_TAB'; payload: MobileTab }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'RESTORE_STATE'; payload: Partial<WorkspaceState> };

// ============================================
// Initial State
// ============================================

const STORAGE_KEY = 'atlas-workspace-state';

function getInitialState(): WorkspaceState {
  const hasSeenWorkspace =
    typeof window !== 'undefined' &&
    localStorage.getItem(STORAGE_KEY) !== null;

  return {
    selectedDomain: 'market',
    expandedDomains: ['market'],
    selectedCategory: null,
    isChatOpen: true,
    chatDomain: 'market',
    hasSeenWorkspace,
    contentPanelRevealed: hasSeenWorkspace,
    workspaceStage: hasSeenWorkspace ? 'full' : 'chat-first',
    showOnboardingTooltip: false,
    mobileTab: hasSeenWorkspace ? 'content' : 'chat',
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
        chatDomain: domain,
        isChatOpen: true,
      };
    }

    case 'SELECT_CATEGORY':
      return {
        ...state,
        selectedDomain: action.payload.domain,
        selectedCategory: action.payload.categoryId,
        chatDomain: action.payload.domain,
        isChatOpen: true,
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

    case 'REVEAL_CONTENT_PANEL':
      return {
        ...state,
        contentPanelRevealed: true,
        workspaceStage: 'full',
        showOnboardingTooltip: true,
        hasSeenWorkspace: true,
      };

    case 'DISMISS_ONBOARDING_TOOLTIP':
      return { ...state, showOnboardingTooltip: false };

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

  // First-run
  revealContentPanel: () => void;
  dismissOnboardingTooltip: () => void;

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
    if (state.hasSeenWorkspace) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedDomain: state.selectedDomain,
        expandedDomains: state.expandedDomains,
      }));
    }
  }, [state.hasSeenWorkspace, state.selectedDomain, state.expandedDomains]);

  // Auto-dismiss onboarding tooltip
  useEffect(() => {
    if (state.showOnboardingTooltip) {
      const timer = setTimeout(() => {
        dispatch({ type: 'DISMISS_ONBOARDING_TOOLTIP' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.showOnboardingTooltip]);

  // Auto-reveal content panel on first input
  useEffect(() => {
    if (!state.contentPanelRevealed && inputs.length > 0) {
      dispatch({ type: 'REVEAL_CONTENT_PANEL' });
    }
  }, [inputs.length, state.contentPanelRevealed]);

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

  const revealContentPanel = useCallback(() => {
    dispatch({ type: 'REVEAL_CONTENT_PANEL' });
  }, []);

  const dismissOnboardingTooltip = useCallback(() => {
    dispatch({ type: 'DISMISS_ONBOARDING_TOOLTIP' });
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
    revealContentPanel,
    dismissOnboardingTooltip,
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
