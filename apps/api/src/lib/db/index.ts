// Database utilities
export { supabase, getSupabaseClient } from './supabase';

// Session utilities
export {
  validateSessionId,
  getValidSession,
  updateSessionStatus,
  updateSessionDomain,
  completeSession,
  abandonSession,
  getSessionProgress,
} from './session';

// Message utilities
export {
  saveMessage,
  getSessionMessages,
  getRecentMessages,
  formatMessagesForLLM,
} from './messages';

// Input utilities
export {
  saveInput,
  getSessionInputs,
  getDomainInputs,
  getInputsByConfidence,
  getInputsSummary,
} from './inputs';
