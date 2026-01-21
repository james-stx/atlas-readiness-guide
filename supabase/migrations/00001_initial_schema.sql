-- Atlas Readiness Guide - Initial Schema
-- Migration: 00001_initial_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ===========================================
-- Enum Types
-- ===========================================

CREATE TYPE session_status AS ENUM (
  'started',
  'in_progress',
  'validating',
  'synthesizing',
  'completed',
  'abandoned'
);

CREATE TYPE domain_type AS ENUM (
  'market',
  'product',
  'gtm',
  'operations',
  'financials'
);

CREATE TYPE confidence_level AS ENUM (
  'high',
  'medium',
  'low'
);

CREATE TYPE message_role AS ENUM (
  'system',
  'assistant',
  'user'
);

CREATE TYPE knowledge_category AS ENUM (
  'market_intelligence',
  'regulatory',
  'competitive',
  'operational',
  'financial'
);

-- ===========================================
-- Sessions Table
-- ===========================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status session_status DEFAULT 'started',
  current_domain domain_type DEFAULT 'market',
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  recovery_token_hash TEXT UNIQUE
);

-- Indexes for sessions
CREATE INDEX idx_sessions_email ON sessions(email);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_recovery_token ON sessions(recovery_token_hash);

-- ===========================================
-- Inputs Table
-- ===========================================

CREATE TABLE inputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  domain domain_type NOT NULL,
  question_id TEXT NOT NULL,
  user_response TEXT NOT NULL,
  extracted_data JSONB DEFAULT '{}',
  confidence_level confidence_level NOT NULL,
  confidence_rationale TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

-- Indexes for inputs
CREATE INDEX idx_inputs_session_id ON inputs(session_id);
CREATE INDEX idx_inputs_domain ON inputs(domain);
CREATE INDEX idx_inputs_confidence ON inputs(confidence_level);

-- ===========================================
-- Chat Messages Table
-- ===========================================

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for chat messages
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- ===========================================
-- Snapshots Table
-- ===========================================

CREATE TABLE snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  coverage_summary JSONB NOT NULL,
  key_findings JSONB NOT NULL,
  strengths JSONB NOT NULL,
  assumptions JSONB NOT NULL,
  gaps JSONB NOT NULL,
  next_steps JSONB NOT NULL,
  raw_output TEXT
);

-- Indexes for snapshots
CREATE INDEX idx_snapshots_session_id ON snapshots(session_id);

-- ===========================================
-- Knowledge Base Table (for RAG)
-- ===========================================

CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category knowledge_category NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for vector similarity search
CREATE INDEX idx_knowledge_base_embedding ON knowledge_base
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);

-- ===========================================
-- Updated At Trigger
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for API)
CREATE POLICY "Service role full access to sessions" ON sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to inputs" ON inputs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to chat_messages" ON chat_messages
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to snapshots" ON snapshots
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to knowledge_base" ON knowledge_base
  FOR ALL USING (auth.role() = 'service_role');

-- Anon role can read knowledge base (for RAG queries if needed client-side)
CREATE POLICY "Anon can read knowledge base" ON knowledge_base
  FOR SELECT USING (true);

-- ===========================================
-- Comments
-- ===========================================

COMMENT ON TABLE sessions IS 'User assessment sessions with 30-day expiry';
COMMENT ON TABLE inputs IS 'Captured user inputs with confidence classification';
COMMENT ON TABLE chat_messages IS 'Conversation history for each session';
COMMENT ON TABLE snapshots IS 'Generated readiness snapshots';
COMMENT ON TABLE knowledge_base IS 'RAG knowledge base with vector embeddings';

COMMENT ON COLUMN sessions.recovery_token_hash IS 'SHA256 hash of recovery token for session resumption';
COMMENT ON COLUMN inputs.extracted_data IS 'Structured data extracted from user response';
COMMENT ON COLUMN inputs.confidence_rationale IS 'Explanation for confidence classification';
