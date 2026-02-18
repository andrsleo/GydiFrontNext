/**
 * Bookings Query Hooks
 *
 * TanStack Query hooks for fetching bookings data
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { bookingsAdminApi } from '../api';
import type { BookingDto, BookingFilters } from '../types';

/**
 * Query keys for bookings
 */
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters?: BookingFilters) => [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: number) => [...bookingKeys.details(), id] as const,
};

/**
 * Hook to fetch a single booking by ID
 */
export function useBooking(id: number, options?: { enabled?: boolean }) {
  return useQuery<BookingDto>({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingsAdminApi.getBooking(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch list of bookings with filters
 */
export function useBookings(filters?: BookingFilters) {
  return useQuery<BookingDto[]>({
    queryKey: bookingKeys.list(filters),
    queryFn: () => bookingsAdminApi.listBookings(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
