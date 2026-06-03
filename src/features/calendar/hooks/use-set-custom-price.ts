'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../api/calendar.api';
import { calendarKeys } from '@/lib/constants/query-keys';
import type { SetCustomPricePayload } from '../types';

export function useSetCustomPrice(propertyId: number, year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetCustomPricePayload) =>
      calendarApi.setCustomPrice(propertyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.month(propertyId, year, month) });
    },
  });
}
