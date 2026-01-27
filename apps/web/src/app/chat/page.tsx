'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/context/assessment-context';
import { ProgressProvider, useProgress } from '@/lib/context/progress-context';
import { ProgressHeader } from '@/components/progress/progress-header';
import { ReadinessPanel } from '@/components/progress/readiness-panel';
import { NotificationStack } from '@/components/progress/notification-stack';
import { MessageList } from '@/components/chat/message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { QuickResponses } from '@/components/chat/quick-responses';
import { Loader2 } from 'lucide-react';

function ChatContent() {
  const router = useRouter();
  const {
    session,
    messages,
    inputs,
    streamingMessage,
    isLoading,
    error,
    sendMessage,
    generateSnapshot,
  } = useAssessment();

  const {
    progressState,
    isPanelOpen,
    scrollToDomain,
    notifications,
    openPanel,
    closePanel,
    addNotification,
    dismissNotification,
  } = useProgress();

  // Track input count to detect new inputs and trigger notifications
  const prevInputCountRef = useRef(inputs.length);

  useEffect(() => {
    if (inputs.length > prevInputCountRef.current) {
      // New input(s) were added - notify for each new one
      const newInputs = inputs.slice(prevInputCountRef.current);
      for (const input of newInputs) {
        addNotification(input);
      }
    }
    prevInputCountRef.current = inputs.length;
  }, [inputs, addNotification]);

  // Handle send message
  const handleSendMessage = useCallback(
    async (content: string) => {
      try {
        await sendMessage(content);
      } catch (err) {
        console.error('Failed to send message:', err);
      }
    },
    [sendMessage]
  );

  // Handle snapshot generation
  const handleGenerateSnapshot = useCallback(async () => {
    closePanel();
    try {
      await generateSnapshot();
      router.push('/snapshot');
    } catch (err) {
      console.error('Failed to generate snapshot:', err);
    }
  }, [generateSnapshot, closePanel, router]);

  // Handle domain click - opens panel scrolled to that domain
  const handleDomainClick = useCallback(
    (domain: Parameters<typeof openPanel>[0]) => {
      openPanel(domain);
    },
    [openPanel]
  );

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

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Enhanced Progress Header */}
      <ProgressHeader
        progressState={progressState}
        currentDomain={session.current_domain}
        onViewDetails={() => openPanel()}
        onDomainClick={handleDomainClick}
      />

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

      {/* Input capture notifications */}
      <NotificationStack
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      {/* Readiness Panel (slide-out) */}
      <ReadinessPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        progressState={progressState}
        currentDomain={session.current_domain}
        inputs={inputs}
        onGenerateSnapshot={handleGenerateSnapshot}
        scrollToDomain={scrollToDomain}
      />
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const initRef = useRef(false);
  const {
    session,
    messages,
    inputs,
    isLoading,
    initChat,
    recoverSession,
    hasStoredSession,
  } = useAssessment();

  // Redirect if no session
  useEffect(() => {
    if (!session && !hasStoredSession) {
      router.push('/start');
    } else if (!session && hasStoredSession) {
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
    <ProgressProvider inputs={inputs} currentDomain={session.current_domain}>
      <ChatContent />
    </ProgressProvider>
  );
}
