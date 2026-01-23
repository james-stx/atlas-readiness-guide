'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/context/assessment-context';
import { ProgressBar } from '@/components/chat/progress-bar';
import { MessageList } from '@/components/chat/message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { QuickResponses } from '@/components/chat/quick-responses';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const initRef = useRef(false);
  const {
    session,
    messages,
    inputs,
    streamingMessage,
    isLoading,
    error,
    initChat,
    sendMessage,
    recoverSession,
    hasStoredSession,
  } = useAssessment();

  // Redirect if no session
  useEffect(() => {
    if (!session && !hasStoredSession) {
      router.push('/start');
    } else if (!session && hasStoredSession) {
      // Try to recover session
      recoverSession().then((recovered) => {
        if (!recovered) {
          router.push('/start');
        }
      });
    }
  }, [session, hasStoredSession, router, recoverSession]);

  // Initialize chat when session is ready
  useEffect(() => {
    if (session && !initRef.current && messages.length === 0) {
      initRef.current = true;
      initChat().catch(console.error);
    }
  }, [session, messages.length, initChat]);

  // Redirect to snapshot when completed
  useEffect(() => {
    if (session?.status === 'completed') {
      router.push('/snapshot');
    }
  }, [session?.status, router]);

  // Handle send message
  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Get quick responses from the last assistant message metadata
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m && m.role === 'assistant');
  const quickResponses =
    (lastAssistantMessage?.metadata?.quickResponses as Array<{
      id: string;
      label: string;
      value: string;
    }>) || [];

  // Loading state while recovering session
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed progress bar */}
      <ProgressBar currentDomain={session.current_domain} />

      {/* Chat area */}
      <MessageList
        messages={messages}
        inputs={inputs}
        streamingMessage={streamingMessage}
        isLoading={isLoading}
        className="flex-1"
      />

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* Quick responses */}
      {quickResponses.length > 0 && !isLoading && (
        <div className="px-4 py-3 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <QuickResponses
              responses={quickResponses}
              onSelect={handleSendMessage}
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* Chat input */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
