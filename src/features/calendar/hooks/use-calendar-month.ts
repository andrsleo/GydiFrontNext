'use client';
import { useQuery } from '@tanstack/react-query';
import { calendarApi } from '../api/calendar.api';
import { calendarKeys } from '@/lib/constants/query-keys';

export function useCalendarMonth(propertyId: number, year: number, month: number) {
  return useQuery({
    queryKey: calendarKeys.month(propertyId, year, month),
    queryFn: () => calendarApi.getMonth(propertyId, year, month),
    staleTime: 2 * 60 * 1000,
    enabled: !!propertyId,
  });
}
