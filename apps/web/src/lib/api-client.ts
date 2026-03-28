import type {
  CreateSessionRequest,
  CreateSessionResponse,
  Session,
  ChatMessage,
  Input,
  Snapshot,
  SessionFile,
  FileTopicMapping,
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
  email: string,
  options?: { isGuest?: boolean }
): Promise<CreateSessionResponse> {
  const body: CreateSessionRequest = options?.isGuest
    ? { isGuest: true }
    : { email };
  const response = await fetch(`${API_URL}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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

export async function claimGuestSession(
  sessionId: string,
  email: string
): Promise<CreateSessionResponse> {
  const response = await fetch(`${API_URL}/api/session/${sessionId}/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse<CreateSessionResponse>(response);
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
    signal: AbortSignal.timeout(120_000), // 2-min ceiling for AI synthesis
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
// Domain API
// ============================================

export interface DomainSummary {
  domain: string;
  topicsCovered: number;
  totalTopics: number;
  confidenceBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  keyThemes: string[];
  suggestedFocus: string | null;
  overallAssessment: string;
}

export async function getDomainSummary(
  sessionId: string,
  domain: string
): Promise<{ summary: DomainSummary }> {
  const response = await fetch(`${API_URL}/api/domain/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, domain }),
  });
  return handleResponse<{ summary: DomainSummary }>(response);
}

// ============================================
// Auth API
// ============================================

export async function sendOtp(email: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse<{ success: boolean }>(response);
}

export async function verifyOtp(
  email: string,
  code: string
): Promise<{ verified: boolean; email: string }> {
  const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  return handleResponse<{ verified: boolean; email: string }>(response);
}

// ============================================
// Files API
// ============================================

export async function uploadFiles(
  sessionId: string,
  files: File[]
): Promise<{ files: Pick<SessionFile, 'id' | 'filename' | 'status'>[] }> {
  const formData = new FormData();
  formData.append('sessionId', sessionId);
  for (const file of files) {
    formData.append('files', file);
  }
  const response = await fetch(`${API_URL}/api/files/upload`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<{ files: Pick<SessionFile, 'id' | 'filename' | 'status'>[] }>(response);
}

export async function processFile(
  fileId: string
): Promise<{ file: SessionFile; mappings: FileTopicMapping[]; inputs: Input[] }> {
  const response = await fetch(`${API_URL}/api/files/${fileId}/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(140_000), // 140s — backend can take up to ~125s total
  });
  return handleResponse<{ file: SessionFile; mappings: FileTopicMapping[]; inputs: Input[] }>(response);
}

export async function getSessionInputs(
  sessionId: string
): Promise<{ inputs: Input[] }> {
  const response = await fetch(`${API_URL}/api/session/${sessionId}/inputs`);
  return handleResponse<{ inputs: Input[] }>(response);
}

export async function getSessionFiles(
  sessionId: string
): Promise<{ files: SessionFile[]; mappings: FileTopicMapping[] }> {
  const response = await fetch(`${API_URL}/api/files/session/${sessionId}`);
  return handleResponse<{ files: SessionFile[]; mappings: FileTopicMapping[] }>(response);
}

export async function deleteFile(fileId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/files/${fileId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.error || 'Failed to delete file', response.status);
  }
}

// ============================================
// Utilities
// ============================================

export { ApiError };
