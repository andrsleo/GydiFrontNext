'use client';

import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings.api';

interface UseBookingQuoteParams {
  propertyId: string;
  startDate: string | null;
  endDate: string | null;
}

/**
 * Hook to get a booking quote (calculate total price)
 */
export function useBookingQuote({ propertyId, startDate, endDate }: UseBookingQuoteParams) {
  return useQuery({
    queryKey: ['booking-quote', propertyId, startDate, endDate],
    queryFn: () => {
      if (!startDate || !endDate) {
        throw new Error('Start and end dates are required');
      }
      return bookingsApi.getQuote(propertyId, startDate, endDate);
    },
    enabled: !!propertyId && !!startDate && !!endDate,
    staleTime: 60 * 1000, // 1 minute
  });
}
