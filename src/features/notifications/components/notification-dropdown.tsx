'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';
import { useUnreadCount } from '../hooks/use-unread-count';
import { useMarkRead } from '../hooks/use-mark-read';
import { NotificationItem } from './notification-item';
import { cn } from '@/lib/utils';

export function NotificationDropdown() {
  const { data, isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { markOne, markAll } = useMarkRead();

  const notifications = data?.pages.flatMap((p) => p.content) ?? [];
  const hasUnread = unreadCount > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notificaciones${hasUnread ? `, ${unreadCount} sin leer` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-sm font-semibold">Notificaciones</h3>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-0 py-0 text-xs text-primary hover:bg-transparent hover:text-primary/80"
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>
        <Separator />

        {/* Notification list */}
        <div className="max-h-[400px] overflow-y-auto py-1">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Cargando...</span>
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-1 py-8">
              <Bell className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Sin notificaciones</p>
            </div>
          )}

          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onRead={(id) => markOne.mutate(id)}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
