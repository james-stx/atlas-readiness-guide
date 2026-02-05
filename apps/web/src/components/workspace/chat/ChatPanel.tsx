'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { ChatHeader } from './ChatHeader';
import { InputCapturedIndicator } from './InputCapturedIndicator';
import { Compass, Send, Loader2 } from 'lucide-react';
import type { ChatMessage, Input } from '@atlas/types';

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

export function ChatPanel() {
  const { isChatOpen, closeChat, chatDomain, selectCategory } = useWorkspace();
  const {
    messages,
    inputs,
    streamingMessage,
    isLoading,
    sendMessage,
    initChat,
    session,
    error,
  } = useAssessment();

  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize chat on mount
  useEffect(() => {
    if (session && messages.length === 0) {
      initChat().catch(() => {});
    }
  }, [session, messages.length, initChat]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed && !isLoading) {
      sendMessage(trimmed).catch(() => {});
      setInputValue('');
    }
  }, [inputValue, isLoading, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+Enter to send
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
    // Escape to close
    if (e.key === 'Escape') {
      closeChat();
    }
  };

  // Recent inputs (for in-chat indicators)
  const recentInputIds = new Set(
    inputs
      .filter((i) => Date.now() - new Date(i.created_at).getTime() < 5000)
      .map((i) => i.id)
  );

  if (!isChatOpen) return null;

  return (
    <div
      className={cn(
        'flex flex-col border-l border-warm-200 bg-white workspace-panel',
        'w-chat shrink-0'
      )}
      role="complementary"
      aria-label="AI Chat"
    >
      {/* Header */}
      <ChatHeader domain={chatDomain} onClose={closeChat} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4" role="log" aria-live="polite">
        <div className="space-y-3">
          {messages.map((message, index) => {
            const inputsAfterMessage = getInputsAfterMessage(
              message,
              index,
              messages,
              inputs
            );

            return (
              <div key={message.id}>
                <ChatBubble message={message} />

                {/* Input captured indicators */}
                {message.role === 'assistant' &&
                  inputsAfterMessage.map((input) => (
                    <div key={input.id} className="mt-2 ml-9">
                      <InputCapturedIndicator
                        questionId={input.question_id}
                        confidenceLevel={input.confidence_level}
                        onClick={() =>
                          selectCategory(input.domain, input.question_id)
                        }
                      />
                    </div>
                  ))}
              </div>
            );
          })}

          {/* Streaming */}
          {streamingMessage && (
            <ChatBubble
              message={{
                id: 'streaming',
                role: 'assistant',
                content: streamingMessage,
                session_id: '',
                metadata: {},
                created_at: '',
              }}
              isStreaming
            />
          )}

          {/* Typing indicator */}
          {isLoading && !streamingMessage && <TypingDots />}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-body-sm text-red-700">
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="sticky bottom-0 border-t border-warm-200 bg-white px-4 py-3">
        {/* Quick responses could go here */}

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.slice(0, 2000))}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className={cn(
              'w-full resize-none rounded-lg bg-warm-50 px-3 py-2.5 pr-10',
              'text-ws-body text-warm-900 placeholder:text-warm-400',
              'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-fast'
            )}
            aria-label="Message Atlas"
            aria-multiline="true"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className={cn(
              'absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-full',
              'bg-accent text-white transition-all duration-fast',
              'hover:bg-accent-700',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <p className="mt-1 text-right text-ws-caption text-warm-400">
          {isMac ? '⌘' : 'Ctrl'}+Enter to send
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ───

function ChatBubble({
  message,
  isStreaming = false,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
}) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-2.5 animate-slide-up',
        isAssistant ? 'justify-start' : 'justify-end'
      )}
    >
      {isAssistant && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent">
          <Compass className="h-3 w-3 text-white" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[85%] rounded-xl px-3.5 py-2.5',
          isAssistant
            ? 'rounded-tl-sm bg-warm-50 text-warm-900'
            : 'rounded-tr-sm bg-accent text-white'
        )}
      >
        <p className="whitespace-pre-wrap text-ws-body leading-relaxed">
          {message.content}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-3.5 w-1 animate-pulse-subtle bg-current" />
          )}
        </p>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-2.5 justify-start">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent">
        <Compass className="h-3 w-3 text-white" />
      </div>
      <div className="rounded-xl rounded-tl-sm bg-warm-50 px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-warm-400 animate-typing-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function getInputsAfterMessage(
  message: ChatMessage,
  index: number,
  messages: ChatMessage[],
  inputs: Input[]
): Input[] {
  return inputs.filter((input) => {
    const inputTime = new Date(input.created_at).getTime();
    const messageTime = new Date(message.created_at).getTime();
    const nextMessage = messages[index + 1];
    const nextMessageTime = nextMessage
      ? new Date(nextMessage.created_at).getTime()
      : Date.now();

    return inputTime >= messageTime && inputTime < nextMessageTime;
  });
}
