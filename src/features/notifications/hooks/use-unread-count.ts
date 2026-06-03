'use client';

import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';
import { useAuthStore } from '@/store/auth-store';

export const UNREAD_COUNT_QUERY_KEY = ['notifications', 'unread-count'];

export function useUnreadCount() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: UNREAD_COUNT_QUERY_KEY,
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30_000, // poll every 30 seconds
    select: (data) => data.count,
  });
}
