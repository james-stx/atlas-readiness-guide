import { supabase } from './supabase';
import type { ChatMessage, MessageRole } from '@atlas/types';

/**
 * Saves a chat message to the database
 */
export async function saveMessage({
  sessionId,
  role,
  content,
  metadata = {},
}: {
  sessionId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
}): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role,
      content,
      metadata,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save message: ${error.message}`);
  }

  return data as ChatMessage;
}

/**
 * Gets all messages for a session
 */
export async function getSessionMessages(
  sessionId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to get messages: ${error.message}`);
  }

  return (data || []) as ChatMessage[];
}

/**
 * Gets the last N messages for context window
 */
export async function getRecentMessages(
  sessionId: string,
  limit: number = 20
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to get recent messages: ${error.message}`);
  }

  // Reverse to get chronological order
  return ((data || []) as ChatMessage[]).reverse();
}

/**
 * Formats messages for LLM context
 */
export function formatMessagesForLLM(
  messages: ChatMessage[]
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
}
