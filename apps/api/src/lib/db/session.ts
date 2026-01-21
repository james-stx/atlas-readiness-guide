import { supabase } from './supabase';
import {
  ValidationError,
  SessionNotFoundError,
  SessionExpiredError,
} from '../errors';
import type { Session, SessionStatus, DomainType } from '@atlas/types';

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates a session ID format
 */
export function validateSessionId(sessionId: string): void {
  if (!UUID_REGEX.test(sessionId)) {
    throw new ValidationError('Invalid session ID format');
  }
}

/**
 * Fetches and validates a session, ensuring it exists and hasn't expired
 */
export async function getValidSession(sessionId: string): Promise<Session> {
  validateSessionId(sessionId);

  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error || !session) {
    throw new SessionNotFoundError(sessionId);
  }

  if (new Date(session.expires_at) < new Date()) {
    throw new SessionExpiredError();
  }

  if (session.status === 'abandoned') {
    throw new ValidationError('This session has been abandoned');
  }

  return session as Session;
}

/**
 * Updates session status
 */
export async function updateSessionStatus(
  sessionId: string,
  status: SessionStatus
): Promise<Session> {
  const { data: session, error } = await supabase
    .from('sessions')
    .update({ status })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update session status: ${error.message}`);
  }

  return session as Session;
}

/**
 * Updates session domain
 */
export async function updateSessionDomain(
  sessionId: string,
  domain: DomainType
): Promise<Session> {
  const { data: session, error } = await supabase
    .from('sessions')
    .update({ current_domain: domain, status: 'in_progress' })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update session domain: ${error.message}`);
  }

  return session as Session;
}

/**
 * Marks a session as completed
 */
export async function completeSession(sessionId: string): Promise<Session> {
  return updateSessionStatus(sessionId, 'completed');
}

/**
 * Marks a session as abandoned
 */
export async function abandonSession(sessionId: string): Promise<Session> {
  return updateSessionStatus(sessionId, 'abandoned');
}

/**
 * Gets session progress information
 */
export async function getSessionProgress(sessionId: string): Promise<{
  currentDomain: DomainType;
  domainsCompleted: DomainType[];
  totalInputs: number;
  inputsByDomain: Record<DomainType, number>;
}> {
  const { data: inputs, error } = await supabase
    .from('inputs')
    .select('domain')
    .eq('session_id', sessionId);

  if (error) {
    throw new Error(`Failed to get session progress: ${error.message}`);
  }

  const { data: session } = await supabase
    .from('sessions')
    .select('current_domain')
    .eq('id', sessionId)
    .single();

  const domains: DomainType[] = [
    'market',
    'product',
    'gtm',
    'operations',
    'financials',
  ];
  const inputsByDomain: Record<DomainType, number> = {
    market: 0,
    product: 0,
    gtm: 0,
    operations: 0,
    financials: 0,
  };

  for (const input of inputs || []) {
    inputsByDomain[input.domain as DomainType]++;
  }

  // A domain is considered completed if it has at least 1 input
  // and we've moved past it
  const currentDomainIndex = domains.indexOf(
    session?.current_domain as DomainType
  );
  const domainsCompleted = domains.filter((domain, index) => {
    return index < currentDomainIndex && inputsByDomain[domain] > 0;
  });

  return {
    currentDomain: session?.current_domain as DomainType,
    domainsCompleted,
    totalInputs: inputs?.length || 0,
    inputsByDomain,
  };
}
