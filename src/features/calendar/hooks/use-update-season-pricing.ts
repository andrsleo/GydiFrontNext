'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../api/calendar.api';
import { calendarKeys } from '@/lib/constants/query-keys';
import type { UpdateSeasonPricingPayload } from '../types';

export function useUpdateSeasonPricing(propertyId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSeasonPricingPayload) =>
      calendarApi.updateSeasonPricing(propertyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.seasonPricing(propertyId) });
    },
  });
}
