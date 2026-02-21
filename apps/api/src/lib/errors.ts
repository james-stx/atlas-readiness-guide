import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class SessionNotFoundError extends AppError {
  constructor(sessionId: string) {
    super(`Session ${sessionId} not found`, 404, 'SESSION_NOT_FOUND');
  }
}

export class SessionExpiredError extends AppError {
  constructor() {
    super('Session has expired', 410, 'SESSION_EXPIRED');
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super('Too many requests', 429, 'RATE_LIMITED');
  }
}

export class AIError extends AppError {
  constructor(message: string) {
    super(message, 503, 'AI_ERROR');
  }
}

// Error handler for API routes
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  // AI SDK rate limit errors
  if (error instanceof Error && error.message.includes('rate_limit')) {
    return NextResponse.json(
      { error: 'AI service temporarily unavailable', code: 'AI_RATE_LIMITED' },
      { status: 503 }
    );
  }

  // Generic error
  return NextResponse.json(
    { error: 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  );
}
