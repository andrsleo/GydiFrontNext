/**
 * Booking Mutation Hooks
 *
 * TanStack Query hooks for booking mutations
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingsAdminApi } from '../api';
import { bookingKeys } from './use-bookings';
import type {
  CreateBookingRequest,
  ReserveBookingRequest,
  CancelBookingRequest,
  DisputeBookingRequest,
} from '../types';

/**
 * Hook to create a new booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateBookingRequest) => bookingsAdminApi.createBooking(request),
    onSuccess: (data) => {
      // Invalidate bookings list
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });

      toast.success('Reserva creada', {
        description: `Reserva #${data.id} creada exitosamente`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear la reserva';
      toast.error('Error', { description: message });
    },
  });
}

/**
 * Hook to reserve booking (confirm with Airbnb)
 */
export function useReserveBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReserveBookingRequest }) =>
      bookingsAdminApi.reserveBooking(id, data),
    onSuccess: (data, variables) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });

      toast.success('Reserva confirmada', {
        description: `Reserva #${data.id} confirmada en Airbnb`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al confirmar la reserva';
      toast.error('Error', { description: message });
    },
  });
}

/**
 * Hook to cancel booking
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CancelBookingRequest }) =>
      bookingsAdminApi.cancelBooking(id, data),
    onSuccess: (data, variables) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });

      toast.success('Reserva cancelada', {
        description: `Reserva #${data.id} cancelada`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al cancelar la reserva';
      toast.error('Error', { description: message });
    },
  });
}

/**
 * Hook to start booking (check-in)
 */
export function useStartBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookingsAdminApi.startBooking(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });

      toast.success('Check-in realizado', {
        description: `Reserva #${data.id} en curso`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al realizar check-in';
      toast.error('Error', { description: message });
    },
  });
}

/**
 * Hook to finish booking (check-out)
 */
export function useFinishBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookingsAdminApi.finishBooking(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });

      toast.success('Check-out realizado', {
        description: `Reserva #${data.id} finalizada`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al realizar check-out';
      toast.error('Error', { description: message });
    },
  });
}

/**
 * Hook to dispute booking
 */
export function useDisputeBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DisputeBookingRequest }) =>
      bookingsAdminApi.disputeBooking(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });

      toast.warning('Reserva en disputa', {
        description: `Reserva #${data.id} marcada como disputada`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al marcar como disputada';
      toast.error('Error', { description: message });
    },
  });
}
