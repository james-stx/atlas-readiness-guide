import { supabase } from './supabase';
import type { Input, DomainType, ConfidenceLevel } from '@atlas/types';

/**
 * Saves a captured input to the database
 */
export async function saveInput({
  sessionId,
  domain,
  questionId,
  userResponse,
  extractedData = {},
  confidenceLevel,
  confidenceRationale,
}: {
  sessionId: string;
  domain: DomainType;
  questionId: string;
  userResponse: string;
  extractedData?: Record<string, unknown>;
  confidenceLevel: ConfidenceLevel;
  confidenceRationale?: string;
}): Promise<Input> {
  // Upsert to handle re-answering the same question
  const { data, error } = await supabase
    .from('inputs')
    .upsert(
      {
        session_id: sessionId,
        domain,
        question_id: questionId,
        user_response: userResponse,
        extracted_data: extractedData,
        confidence_level: confidenceLevel,
        confidence_rationale: confidenceRationale,
      },
      {
        onConflict: 'session_id,question_id',
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save input: ${error.message}`);
  }

  return data as Input;
}

/**
 * Gets all inputs for a session
 */
export async function getSessionInputs(sessionId: string): Promise<Input[]> {
  const { data, error } = await supabase
    .from('inputs')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to get inputs: ${error.message}`);
  }

  return (data || []) as Input[];
}

/**
 * Gets inputs for a specific domain
 */
export async function getDomainInputs(
  sessionId: string,
  domain: DomainType
): Promise<Input[]> {
  const { data, error } = await supabase
    .from('inputs')
    .select('*')
    .eq('session_id', sessionId)
    .eq('domain', domain)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to get domain inputs: ${error.message}`);
  }

  return (data || []) as Input[];
}

/**
 * Gets inputs grouped by confidence level
 */
export async function getInputsByConfidence(sessionId: string): Promise<{
  high: Input[];
  medium: Input[];
  low: Input[];
}> {
  const inputs = await getSessionInputs(sessionId);

  return {
    high: inputs.filter((i) => i.confidence_level === 'high'),
    medium: inputs.filter((i) => i.confidence_level === 'medium'),
    low: inputs.filter((i) => i.confidence_level === 'low'),
  };
}

/**
 * Gets a summary of inputs by domain and confidence
 */
export async function getInputsSummary(sessionId: string): Promise<{
  totalInputs: number;
  byDomain: Record<
    DomainType,
    {
      total: number;
      high: number;
      medium: number;
      low: number;
    }
  >;
  byConfidence: {
    high: number;
    medium: number;
    low: number;
  };
}> {
  const inputs = await getSessionInputs(sessionId);

  const domains: DomainType[] = [
    'market',
    'product',
    'gtm',
    'operations',
    'financials',
  ];

  const byDomain = {} as Record<
    DomainType,
    { total: number; high: number; medium: number; low: number }
  >;

  for (const domain of domains) {
    const domainInputs = inputs.filter((i) => i.domain === domain);
    byDomain[domain] = {
      total: domainInputs.length,
      high: domainInputs.filter((i) => i.confidence_level === 'high').length,
      medium: domainInputs.filter((i) => i.confidence_level === 'medium')
        .length,
      low: domainInputs.filter((i) => i.confidence_level === 'low').length,
    };
  }

  return {
    totalInputs: inputs.length,
    byDomain,
    byConfidence: {
      high: inputs.filter((i) => i.confidence_level === 'high').length,
      medium: inputs.filter((i) => i.confidence_level === 'medium').length,
      low: inputs.filter((i) => i.confidence_level === 'low').length,
    },
  };
}
