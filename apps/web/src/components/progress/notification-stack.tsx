'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { InputNotification, type CapturedInputNotification } from './input-notification';

interface NotificationStackProps {
  notifications: CapturedInputNotification[];
  onDismiss: (id: string) => void;
  maxVisible?: number;
  className?: string;
}

export function NotificationStack({
  notifications,
  onDismiss,
  maxVisible = 3,
  className,
}: NotificationStackProps) {
  // Only show the most recent notifications up to maxVisible
  const visibleNotifications = notifications.slice(-maxVisible);

  const handleDismiss = useCallback(
    (id: string) => {
      onDismiss(id);
    },
    [onDismiss]
  );

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex flex-col gap-2',
        // On mobile, center the notifications
        'max-sm:left-4 max-sm:right-4 max-sm:items-center',
        className
      )}
      aria-label="Input capture notifications"
    >
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            // Stagger animation delay for multiple rapid captures
            animationDelay: `${index * 50}ms`,
          }}
        >
          <InputNotification
            notification={notification}
            onDismiss={handleDismiss}
          />
        </div>
      ))}
    </div>
  );
}
