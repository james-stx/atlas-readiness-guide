'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type {
  AssessmentState,
  AssessmentAction,
  Session,
  ChatMessage,
  Input,
  Snapshot,
  DomainType,
  SessionStatus,
} from '@atlas/types';
import * as api from '../api-client';
import {
  saveSessionToStorage,
  getSessionFromStorage,
  clearSessionFromStorage,
} from '../storage';

// ============================================
// Initial State
// ============================================

const initialState: AssessmentState = {
  session: null,
  messages: [],
  inputs: [],
  snapshot: null,
  isLoading: false,
  error: null,
  streamingMessage: '',
};

// ============================================
// Reducer
// ============================================

function assessmentReducer(
  state: AssessmentState,
  action: AssessmentAction
): AssessmentState {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.payload, error: null };

    case 'CLEAR_SESSION':
      return { ...initialState };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };

    case 'ADD_INPUT':
      // Replace existing input for same question_id or add new
      const existingIndex = state.inputs.findIndex(
        (i) => i.question_id === action.payload.question_id
      );
      if (existingIndex >= 0) {
        const newInputs = [...state.inputs];
        newInputs[existingIndex] = action.payload;
        return { ...state, inputs: newInputs };
      }
      return { ...state, inputs: [...state.inputs, action.payload] };

    case 'SET_INPUTS':
      return { ...state, inputs: action.payload };

    case 'SET_SNAPSHOT':
      return { ...state, snapshot: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_STREAMING_MESSAGE':
      return { ...state, streamingMessage: action.payload };

    case 'APPEND_STREAMING_MESSAGE':
      return {
        ...state,
        streamingMessage: state.streamingMessage + action.payload,
      };

    case 'CLEAR_STREAMING_MESSAGE':
      return { ...state, streamingMessage: '' };

    case 'UPDATE_DOMAIN':
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, current_domain: action.payload },
      };

    case 'UPDATE_STATUS':
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, status: action.payload },
      };

    default:
      return state;
  }
}

// ============================================
// Context
// ============================================

interface AssessmentContextValue extends AssessmentState {
  // Session actions
  startSession: (email: string) => Promise<void>;
  recoverSession: () => Promise<boolean>;
  clearSession: () => void;

  // Chat actions
  initChat: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;

  // Input actions
  addInput: (input: Input) => void;

  // Snapshot actions
  generateSnapshot: () => Promise<void>;

  // Domain navigation
  updateDomain: (domain: DomainType) => void;
  updateStatus: (status: SessionStatus) => void;

  // Utility
  hasStoredSession: boolean;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

// ============================================
// Provider
// ============================================

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  // Check for stored session on mount
  const hasStoredSession =
    typeof window !== 'undefined' && !!getSessionFromStorage().recoveryToken;

  // Start a new session
  const startSession = useCallback(async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const { session, recoveryToken } = await api.createSession(email);

      // Save to localStorage for recovery
      saveSessionToStorage({
        sessionId: session.id,
        recoveryToken,
        email: session.email,
      });

      dispatch({
        type: 'SET_SESSION',
        payload: {
          id: session.id,
          email: session.email,
          status: session.status,
          current_domain: session.currentDomain,
          created_at: session.createdAt,
          updated_at: session.updatedAt || session.createdAt,
          expires_at: session.expiresAt,
          metadata: session.metadata || {},
          recovery_token_hash: null,
        } as Session,
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error ? error.message : 'Failed to start session',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Recover an existing session
  const recoverSessionAction = useCallback(async (): Promise<boolean> => {
    const { recoveryToken } = getSessionFromStorage();
    if (!recoveryToken) return false;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const { session, messages, inputs } =
        await api.recoverSession(recoveryToken);

      dispatch({
        type: 'SET_SESSION',
        payload: {
          id: session.id,
          email: session.email,
          status: session.status,
          current_domain: session.currentDomain,
          created_at: session.createdAt,
          updated_at: session.updatedAt || session.createdAt,
          expires_at: session.expiresAt,
          metadata: session.metadata || {},
          recovery_token_hash: null,
        } as Session,
      });
      dispatch({ type: 'SET_MESSAGES', payload: messages });
      dispatch({ type: 'SET_INPUTS', payload: inputs });

      return true;
    } catch (error) {
      // Clear invalid session from storage
      clearSessionFromStorage();
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error
            ? error.message
            : 'Failed to recover session',
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Clear session
  const clearSession = useCallback(() => {
    clearSessionFromStorage();
    dispatch({ type: 'CLEAR_SESSION' });
  }, []);

  // Initialize chat with welcome message
  const initChatAction = useCallback(async () => {
    if (!state.session) {
      throw new Error('No active session');
    }

    // Skip if we already have messages
    if (state.messages.length > 0) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const { messages } = await api.initChat(state.session.id);
      dispatch({ type: 'SET_MESSAGES', payload: messages });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error ? error.message : 'Failed to initialize chat',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.session, state.messages.length]);

  // Send a message
  const sendMessageAction = useCallback(
    async (content: string) => {
      if (!state.session) {
        throw new Error('No active session');
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'CLEAR_STREAMING_MESSAGE' });

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        session_id: state.session.id,
        role: 'user',
        content,
        metadata: {},
        created_at: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // Create AbortController with 90 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 90000);

      try {
        const response = await api.sendMessage(state.session.id, content, controller.signal);

        // Handle SSE streaming
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let assistantContent = '';
        let buffer = '';
        let receivedComplete = false;
        let eventCount = 0;

        console.log('[Atlas] Starting SSE stream read...');

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('[Atlas] Stream done. Events received:', eventCount, 'Content length:', assistantContent.length);
            break;
          }

          // Append to buffer to handle JSON split across chunks
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          // Keep the last (potentially incomplete) line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
            if (data === '[DONE]') {
              console.log('[Atlas] Received [DONE] marker');
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              eventCount++;
              console.log('[Atlas] Event:', parsed.type);

              if (parsed.type === 'text') {
                assistantContent += parsed.content;
                dispatch({
                  type: 'SET_STREAMING_MESSAGE',
                  payload: assistantContent,
                });
              } else if (parsed.type === 'input' && parsed.input) {
                dispatch({ type: 'ADD_INPUT', payload: parsed.input });
              } else if (parsed.type === 'domain_change' && parsed.domain) {
                dispatch({
                  type: 'UPDATE_DOMAIN',
                  payload: parsed.domain,
                });
              } else if (parsed.type === 'complete') {
                receivedComplete = true;
                // Add final assistant message
                const message = parsed.data?.message || parsed.message;
                if (message) {
                  dispatch({
                    type: 'ADD_MESSAGE',
                    payload: message,
                  });
                }
                dispatch({ type: 'CLEAR_STREAMING_MESSAGE' });
              } else if (parsed.type === 'error') {
                console.error('[Atlas] Stream error event:', parsed.content);
                dispatch({
                  type: 'SET_ERROR',
                  payload: parsed.content || 'A streaming error occurred',
                });
              }
            } catch (parseErr) {
              // Log parse errors (might help debug)
              console.warn('[Atlas] JSON parse issue:', data.slice(0, 100));
            }
          }
        }

        // Handle stream ending without complete event
        if (!receivedComplete) {
          console.warn('[Atlas] Stream ended without complete event');
          if (assistantContent) {
            // Save partial content as a message
            dispatch({
              type: 'ADD_MESSAGE',
              payload: {
                id: `partial-${Date.now()}`,
                session_id: state.session.id,
                role: 'assistant',
                content: assistantContent,
                metadata: { partial: true },
                created_at: new Date().toISOString(),
              },
            });
          } else {
            // No content at all - something went wrong
            dispatch({
              type: 'SET_ERROR',
              payload: 'No response received. Please try again.',
            });
          }
        }
      } catch (error) {
        // Handle abort/timeout errors specially
        if (error instanceof Error && error.name === 'AbortError') {
          dispatch({
            type: 'SET_ERROR',
            payload: 'Request timed out. The service may be busy — please try again.',
          });
        } else {
          dispatch({
            type: 'SET_ERROR',
            payload:
              error instanceof Error ? error.message : 'Failed to send message',
          });
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'CLEAR_STREAMING_MESSAGE' });
      }
    },
    [state.session]
  );

  // Add message directly
  const addMessage = useCallback((message: ChatMessage) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  }, []);

  // Add input
  const addInput = useCallback((input: Input) => {
    dispatch({ type: 'ADD_INPUT', payload: input });
  }, []);

  // Generate snapshot
  const generateSnapshotAction = useCallback(async () => {
    if (!state.session) {
      throw new Error('No active session');
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'UPDATE_STATUS', payload: 'synthesizing' });

    try {
      const { snapshot } = await api.generateSnapshot(state.session.id);
      dispatch({ type: 'SET_SNAPSHOT', payload: snapshot });
      dispatch({ type: 'UPDATE_STATUS', payload: 'completed' });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error
            ? error.message
            : 'Failed to generate snapshot',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.session]);

  // Update domain
  const updateDomain = useCallback((domain: DomainType) => {
    dispatch({ type: 'UPDATE_DOMAIN', payload: domain });
  }, []);

  // Update status
  const updateStatus = useCallback((status: SessionStatus) => {
    dispatch({ type: 'UPDATE_STATUS', payload: status });
  }, []);

  const value: AssessmentContextValue = {
    ...state,
    startSession,
    recoverSession: recoverSessionAction,
    clearSession,
    initChat: initChatAction,
    sendMessage: sendMessageAction,
    addMessage,
    addInput,
    generateSnapshot: generateSnapshotAction,
    updateDomain,
    updateStatus,
    hasStoredSession,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useAssessment(): AssessmentContextValue {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
