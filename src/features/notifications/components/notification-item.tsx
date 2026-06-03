'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Notification } from '../types';
import { NOTIFICATION_TYPE_ICONS } from '../types';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: number) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const icon = NOTIFICATION_TYPE_ICONS[notification.type];
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent/60',
        !notification.isRead && 'bg-primary/5'
      )}
      onClick={() => {
        if (!notification.isRead) onRead(notification.id);
      }}
    >
      <span className="mt-0.5 text-xl leading-none" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm leading-snug', !notification.isRead && 'font-semibold')}>
          {notification.title}
        </p>
        {notification.body && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {notification.body}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground/70">{timeAgo}</p>
      </div>
      {!notification.isRead && (
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
      )}
    </button>
  );
}
