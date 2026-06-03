'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'];

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: ({ pageParam = 0 }) => notificationsApi.getNotifications(pageParam as number, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
  });
}
