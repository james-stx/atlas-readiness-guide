-- Migration 002: Document upload tables
-- Run in Supabase SQL editor

-- session_files: metadata about uploaded documents
CREATE TABLE session_files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  filename      TEXT NOT NULL,
  storage_path  TEXT NOT NULL,
  mime_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL,
  detected_type TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',
  topics_found  INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at  TIMESTAMPTZ
);

-- file_topic_mappings: individual topic extractions from documents
CREATE TABLE file_topic_mappings (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id              UUID NOT NULL REFERENCES session_files(id) ON DELETE CASCADE,
  session_id           UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  domain               TEXT NOT NULL,
  question_id          TEXT NOT NULL,
  extracted_content    TEXT NOT NULL,
  confidence_level     TEXT NOT NULL,
  confidence_rationale TEXT,
  page_reference       TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add source attribution to inputs
ALTER TABLE inputs ADD COLUMN IF NOT EXISTS source_file_id UUID REFERENCES session_files(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX idx_session_files_session_id ON session_files(session_id);
CREATE INDEX idx_file_topic_mappings_file_id ON file_topic_mappings(file_id);
CREATE INDEX idx_file_topic_mappings_session_id ON file_topic_mappings(session_id);
