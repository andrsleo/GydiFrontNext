'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { calendarApi } from '../api/calendar.api';

/**
 * Fetch blocked dates for a property in a given date range.
 * Public — used in both the guest booking calendar and the host calendar manager.
 *
 * @param propertyId - property ID (string)
 * @param from       - start of range, YYYY-MM-DD
 * @param to         - end of range, YYYY-MM-DD
 */
export function usePropertyCalendar(propertyId: string, from: string, to: string) {
  return useQuery({
    queryKey: ['property-calendar', propertyId, from, to],
    queryFn: () => calendarApi.getBlockedDates(propertyId, from, to),
    staleTime: 5 * 60 * 1000, // 5 min
    enabled: !!propertyId && !!from && !!to,
  });
}

/**
 * Block a list of dates for a property (HOST only).
 */
export function useBlockDates(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dates: string[]) => calendarApi.blockDates(propertyId, dates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-calendar', propertyId] });
      toast.success('Fechas bloqueadas');
    },
    onError: (error: Error) => {
      toast.error('Error al bloquear fechas', { description: error.message });
    },
  });
}

/**
 * Unblock a single date for a property (HOST only).
 */
export function useUnblockDate(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (date: string) => calendarApi.unblockDate(propertyId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-calendar', propertyId] });
      toast.success('Fecha desbloqueada');
    },
    onError: (error: Error) => {
      toast.error('Error al desbloquear fecha', { description: error.message });
    },
  });
}
