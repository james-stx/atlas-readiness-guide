-- Migration 001: Add guest session support
-- Run this in the Supabase SQL editor before deploying F1 code.

-- 1. Add is_guest flag and guest expiry timestamp
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS is_guest BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS guest_expires_at TIMESTAMPTZ;

-- 2. Automatically set a 24-hour expiry for guest sessions on INSERT
CREATE OR REPLACE FUNCTION set_guest_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_guest THEN
    NEW.guest_expires_at := NOW() + INTERVAL '24 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sessions_guest_expiry ON sessions;
CREATE TRIGGER sessions_guest_expiry
  BEFORE INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION set_guest_expiry();

-- 3. Purge expired guest sessions daily (requires pg_cron extension)
-- Enable pg_cron in Supabase dashboard → Database → Extensions first.
-- SELECT cron.schedule(
--   'purge-guest-sessions',
--   '0 2 * * *',
--   $$ DELETE FROM sessions WHERE is_guest = true AND guest_expires_at < NOW(); $$
-- );
