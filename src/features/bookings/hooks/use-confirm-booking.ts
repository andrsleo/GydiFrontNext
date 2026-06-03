'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingsApi } from '../api/bookings.api';
import type { BookingDto } from '../types';

/**
 * Hook for host to confirm a booking request.
 * Invalidates host-bookings and the specific booking query on success.
 */
export function useConfirmBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: number) => bookingsApi.confirm(bookingId),
    onSuccess: (data: BookingDto) => {
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'host'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
      toast.success('Reserva confirmada', {
        description: `${data.guestName} — ${data.checkInDate}`,
      });
    },
    onError: (error: Error) => {
      toast.error('Error al confirmar reserva', { description: error.message });
    },
  });
}

/**
 * Hook for host to reject a booking request with a reason.
 * Invalidates host-bookings queries on success.
 */
export function useRejectBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: number; reason: string }) =>
      bookingsApi.reject(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'host'] });
      toast.success('Reserva rechazada');
    },
    onError: (error: Error) => {
      toast.error('Error al rechazar reserva', { description: error.message });
    },
  });
}
