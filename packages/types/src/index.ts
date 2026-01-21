// ============================================
// Database Types (Supabase)
// ============================================

export type SessionStatus =
  | 'started'
  | 'in_progress'
  | 'validating'
  | 'synthesizing'
  | 'completed'
  | 'abandoned';

export type DomainType =
  | 'market'
  | 'product'
  | 'gtm'
  | 'operations'
  | 'financials';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type MessageRole = 'system' | 'assistant' | 'user';

export type GapImportance = 'critical' | 'important' | 'nice-to-have';

// ============================================
// Database Row Types
// ============================================

export interface Session {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  status: SessionStatus;
  current_domain: DomainType;
  metadata: Record<string, unknown>;
  expires_at: string;
  recovery_token_hash: string | null;
}

export interface Input {
  id: string;
  session_id: string;
  domain: DomainType;
  question_id: string;
  user_response: string;
  extracted_data: Record<string, unknown>;
  confidence_level: ConfidenceLevel;
  confidence_rationale: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Snapshot {
  id: string;
  session_id: string;
  created_at: string;
  coverage_summary: CoverageSummary;
  key_findings: KeyFinding[];
  strengths: Strength[];
  assumptions: Assumption[];
  gaps: Gap[];
  next_steps: NextStep[];
  raw_output: string | null;
}

// ============================================
// Snapshot Sub-Types
// ============================================

export interface DomainCoverage {
  questions_answered: number;
  high_confidence: number;
  medium_confidence: number;
  low_confidence: number;
}

export interface CoverageSummary {
  market: DomainCoverage;
  product: DomainCoverage;
  gtm: DomainCoverage;
  operations: DomainCoverage;
  financials: DomainCoverage;
}

export interface KeyFinding {
  domain: DomainType;
  finding: string;
  confidence: ConfidenceLevel;
}

export interface Strength {
  domain: DomainType;
  item: string;
  evidence: string;
}

export interface Assumption {
  domain: DomainType;
  item: string;
  risk: string;
  validation_suggestion: string;
}

export interface Gap {
  domain: DomainType;
  item: string;
  importance: GapImportance;
  recommendation: string;
}

export interface NextStep {
  priority: number;
  action: string;
  domain: DomainType;
  rationale: string;
}

// ============================================
// API Request/Response Types
// ============================================

export interface CreateSessionRequest {
  email: string;
}

export interface CreateSessionResponse {
  session: {
    id: string;
    email: string;
    status: SessionStatus;
    currentDomain: DomainType;
    createdAt: string;
    expiresAt: string;
  };
  recoveryToken: string;
}

export interface SendMessageRequest {
  sessionId: string;
  content: string;
}

export interface RecoverSessionRequest {
  recoveryToken: string;
}

export interface GenerateSnapshotRequest {
  sessionId: string;
}

// ============================================
// Frontend State Types
// ============================================

export interface AssessmentState {
  session: Session | null;
  messages: ChatMessage[];
  inputs: Input[];
  snapshot: Snapshot | null;
  isLoading: boolean;
  error: string | null;
  streamingMessage: string;
}

export type AssessmentAction =
  | { type: 'SET_SESSION'; payload: Session }
  | { type: 'CLEAR_SESSION' }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_INPUT'; payload: Input }
  | { type: 'SET_INPUTS'; payload: Input[] }
  | { type: 'SET_SNAPSHOT'; payload: Snapshot }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STREAMING_MESSAGE'; payload: string }
  | { type: 'APPEND_STREAMING_MESSAGE'; payload: string }
  | { type: 'CLEAR_STREAMING_MESSAGE' }
  | { type: 'UPDATE_DOMAIN'; payload: DomainType }
  | { type: 'UPDATE_STATUS'; payload: SessionStatus };

// ============================================
// AI/Agent Types
// ============================================

export interface ConfidenceAssessment {
  level: ConfidenceLevel;
  rationale: string;
  extractedData: Record<string, unknown>;
}

export interface QuickResponse {
  id: string;
  label: string;
  value: string;
}

export interface DomainQuestion {
  id: string;
  domain: DomainType;
  question: string;
  followUpPrompt?: string;
  quickResponses?: QuickResponse[];
}

// ============================================
// Supabase Database Type (for client)
// ============================================

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Session, 'id'>>;
      };
      inputs: {
        Row: Input;
        Insert: Omit<Input, 'id' | 'created_at'>;
        Update: Partial<Omit<Input, 'id'>>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<ChatMessage, 'id'>>;
      };
      snapshots: {
        Row: Snapshot;
        Insert: Omit<Snapshot, 'id' | 'created_at'>;
        Update: Partial<Omit<Snapshot, 'id'>>;
      };
    };
    Enums: {
      session_status: SessionStatus;
      domain_type: DomainType;
      confidence_level: ConfidenceLevel;
      message_role: MessageRole;
    };
  };
}
