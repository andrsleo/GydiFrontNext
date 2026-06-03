'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../api/calendar.api';
import { calendarKeys } from '@/lib/constants/query-keys';

export function useRemoveCustomPrice(propertyId: number, year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (date: string) => calendarApi.removeCustomPrice(propertyId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.month(propertyId, year, month) });
    },
  });
}
