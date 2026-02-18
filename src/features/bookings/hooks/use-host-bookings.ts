/**
 * Host Bookings Hooks
 *
 * React Query hooks for fetching bookings on host's properties.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings.api';
import type { BookingFilters } from '../types';

/**
 * Hook to fetch host bookings
 *
 * Returns bookings on the user's properties.
 * User must have canPublish capability.
 */
export function useHostBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ['bookings', 'host', filters],
    queryFn: () => bookingsApi.getHostBookings(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch host booking stats
 *
 * Returns summary statistics (total, active, revenue).
 */
export function useHostBookingStats() {
  return useQuery({
    queryKey: ['bookings', 'host', 'stats'],
    queryFn: () => bookingsApi.getHostStats(),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000,
  });
}
