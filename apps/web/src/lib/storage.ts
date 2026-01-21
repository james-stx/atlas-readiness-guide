const STORAGE_KEYS = {
  SESSION_ID: 'atlas_session_id',
  RECOVERY_TOKEN: 'atlas_recovery_token',
  SESSION_EMAIL: 'atlas_session_email',
} as const;

/**
 * Saves session data to localStorage for recovery
 */
export function saveSessionToStorage(data: {
  sessionId: string;
  recoveryToken: string;
  email: string;
}): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, data.sessionId);
    localStorage.setItem(STORAGE_KEYS.RECOVERY_TOKEN, data.recoveryToken);
    localStorage.setItem(STORAGE_KEYS.SESSION_EMAIL, data.email);
  } catch (error) {
    console.error('Failed to save session to storage:', error);
  }
}

/**
 * Gets session data from localStorage
 */
export function getSessionFromStorage(): {
  sessionId: string | null;
  recoveryToken: string | null;
  email: string | null;
} {
  if (typeof window === 'undefined') {
    return { sessionId: null, recoveryToken: null, email: null };
  }

  try {
    return {
      sessionId: localStorage.getItem(STORAGE_KEYS.SESSION_ID),
      recoveryToken: localStorage.getItem(STORAGE_KEYS.RECOVERY_TOKEN),
      email: localStorage.getItem(STORAGE_KEYS.SESSION_EMAIL),
    };
  } catch (error) {
    console.error('Failed to get session from storage:', error);
    return { sessionId: null, recoveryToken: null, email: null };
  }
}

/**
 * Clears session data from localStorage
 */
export function clearSessionFromStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.RECOVERY_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EMAIL);
  } catch (error) {
    console.error('Failed to clear session from storage:', error);
  }
}

/**
 * Checks if there's a recoverable session in storage
 */
export function hasStoredSession(): boolean {
  const { recoveryToken } = getSessionFromStorage();
  return !!recoveryToken;
}
