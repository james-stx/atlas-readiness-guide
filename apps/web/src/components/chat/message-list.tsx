'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { CapturedInputCard } from './captured-input-card';
import type { ChatMessage, Input } from '@atlas/types';

interface MessageListProps {
  messages: ChatMessage[];
  inputs: Input[];
  streamingMessage: string;
  isLoading: boolean;
  className?: string;
}

export function MessageList({
  messages,
  inputs,
  streamingMessage,
  isLoading,
  className,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Find newly captured inputs (within last 5 seconds)
  const recentInputIds = new Set(
    inputs
      .filter((i) => Date.now() - new Date(i.created_at).getTime() < 5000)
      .map((i) => i.id)
  );

  return (
    <div
      ref={containerRef}
      className={cn('flex-1 overflow-y-auto px-4 py-6', className)}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message, index) => {
          // Find any inputs that were captured after this message
          const inputsAfterMessage = inputs.filter((input) => {
            const inputTime = new Date(input.created_at).getTime();
            const messageTime = new Date(message.created_at).getTime();
            const nextMessage = messages[index + 1];
            const nextMessageTime = nextMessage
              ? new Date(nextMessage.created_at).getTime()
              : Date.now();

            return inputTime >= messageTime && inputTime < nextMessageTime;
          });

          return (
            <div key={message.id}>
              <MessageBubble role={message.role} content={message.content} />

              {/* Show captured inputs after assistant messages */}
              {message.role === 'assistant' && inputsAfterMessage.length > 0 && (
                <div className="ml-11 mt-2 space-y-2">
                  {inputsAfterMessage.map((input) => (
                    <CapturedInputCard
                      key={input.id}
                      label={input.question_id.replace(/_/g, ' ')}
                      value={
                        typeof input.extracted_data === 'object' &&
                        input.extracted_data !== null
                          ? Object.values(input.extracted_data)[0]?.toString() ||
                            input.user_response.slice(0, 100)
                          : input.user_response.slice(0, 100)
                      }
                      confidence={input.confidence_level}
                      isNew={recentInputIds.has(input.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Streaming message */}
        {streamingMessage && (
          <MessageBubble
            role="assistant"
            content={streamingMessage}
            isStreaming={true}
          />
        )}

        {/* Typing indicator when loading but no streaming yet */}
        {isLoading && !streamingMessage && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
