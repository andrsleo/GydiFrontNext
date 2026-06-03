'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings.api';
import type { CreateBookingRequest } from '../types';
import { toast } from 'sonner';

/**
 * Hook to create a new booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateBookingRequest) => bookingsApi.create(request),
    onSuccess: (data) => {
      toast.success('¡Reserva creada exitosamente!', {
        description: `Tu reserva #${data.id} ha sido confirmada.`,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear la reserva';
      toast.error('Error', {
        description: message,
      });
    },
  });
}
