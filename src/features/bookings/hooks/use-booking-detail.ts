/**
 * Booking Detail Hook
 *
 * React Query hook for fetching a single booking by ID.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings.api';

/**
 * Hook to fetch booking by ID
 *
 * User must have permission to view this booking (owner, affiliate, or admin).
 */
export function useBookingDetail(bookingId: number) {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => bookingsApi.getBookingById(bookingId),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000,
    enabled: !!bookingId && bookingId > 0,
  });
}
