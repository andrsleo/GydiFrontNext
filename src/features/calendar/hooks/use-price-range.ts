'use client';
import { useQuery } from '@tanstack/react-query';
import { calendarApi } from '../api/calendar.api';
import { calendarKeys } from '@/lib/constants/query-keys';

export function usePriceRange(
  propertyId: number,
  checkIn: string | null,
  checkOut: string | null,
) {
  return useQuery({
    queryKey: calendarKeys.priceRange(propertyId, checkIn ?? '', checkOut ?? ''),
    queryFn: () => calendarApi.getPriceRange(propertyId, checkIn!, checkOut!),
    enabled: !!propertyId && !!checkIn && !!checkOut,
    staleTime: 60 * 1000,
  });
}
