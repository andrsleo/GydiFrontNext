'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../api/calendar.api';
import { calendarKeys } from '@/lib/constants/query-keys';

export function useBlockDates(propertyId: number, year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { dates: string[]; notes?: string }) =>
      calendarApi.blockDates(propertyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.month(propertyId, year, month) });
    },
  });
}
