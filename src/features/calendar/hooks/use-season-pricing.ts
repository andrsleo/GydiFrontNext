'use client';
import { useQuery } from '@tanstack/react-query';
import { calendarApi } from '../api/calendar.api';
import { calendarKeys } from '@/lib/constants/query-keys';

export function useSeasonPricing(propertyId: number) {
  return useQuery({
    queryKey: calendarKeys.seasonPricing(propertyId),
    queryFn: () => calendarApi.getSeasonPricing(propertyId),
    staleTime: 5 * 60 * 1000,
    enabled: !!propertyId,
  });
}
