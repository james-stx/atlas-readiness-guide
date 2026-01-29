import type {
  CreateSessionRequest,
  CreateSessionResponse,
  Session,
  ChatMessage,
  Input,
  Snapshot,
} from '@atlas/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.error || 'An error occurred',
      response.status,
      error.code
    );
  }
  return response.json();
}

// ============================================
// Session API
// ============================================

export async function createSession(
  email: string
): Promise<CreateSessionResponse> {
  const response = await fetch(`${API_URL}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email } as CreateSessionRequest),
  });
  return handleResponse<CreateSessionResponse>(response);
}

export async function getSession(
  sessionId: string
): Promise<{ session: Session }> {
  const response = await fetch(`${API_URL}/api/session/${sessionId}`);
  return handleResponse<{ session: Session }>(response);
}

export async function recoverSession(recoveryToken: string): Promise<{
  session: Session;
  messages: ChatMessage[];
  inputs: Input[];
}> {
  const response = await fetch(`${API_URL}/api/session/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recoveryToken }),
  });
  return handleResponse<{
    session: Session;
    messages: ChatMessage[];
    inputs: Input[];
  }>(response);
}

export async function updateSession(
  sessionId: string,
  updates: {
    status?: Session['status'];
    currentDomain?: Session['current_domain'];
    metadata?: Record<string, unknown>;
  }
): Promise<{ session: Session }> {
  const response = await fetch(`${API_URL}/api/session/${sessionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<{ session: Session }>(response);
}

// ============================================
// Chat API
// ============================================

export async function initChat(sessionId: string): Promise<{
  initialized: boolean;
  messages: ChatMessage[];
  isExisting: boolean;
}> {
  const response = await fetch(`${API_URL}/api/chat/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  return handleResponse<{
    initialized: boolean;
    messages: ChatMessage[];
    isExisting: boolean;
  }>(response);
}

export async function sendMessage(
  sessionId: string,
  content: string,
  signal?: AbortSignal
): Promise<Response> {
  // Returns raw response for SSE streaming
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, content }),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.error || 'Failed to send message',
      response.status,
      error.code
    );
  }

  return response;
}

// ============================================
// Snapshot API
// ============================================

export async function generateSnapshot(
  sessionId: string
): Promise<{ snapshot: Snapshot }> {
  const response = await fetch(`${API_URL}/api/snapshot/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  return handleResponse<{ snapshot: Snapshot }>(response);
}

export async function getSnapshot(
  sessionId: string
): Promise<{ snapshot: Snapshot | null }> {
  const response = await fetch(`${API_URL}/api/snapshot/${sessionId}`);
  return handleResponse<{ snapshot: Snapshot | null }>(response);
}

// ============================================
// Export API
// ============================================

export function getPdfDownloadUrl(sessionId: string): string {
  return `${API_URL}/api/export/pdf/${sessionId}`;
}

export async function sendSnapshotEmail(
  sessionId: string
): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${API_URL}/api/export/send/${sessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<{ success: boolean; message?: string }>(response);
}

// ============================================
// Utilities
// ============================================

export { ApiError };
