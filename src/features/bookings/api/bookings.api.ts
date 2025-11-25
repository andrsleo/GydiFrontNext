import { apiClient } from '@/lib/api/client';
import type {
  CreateBookingRequest,
  CreateBookingResponse,
  BookingQuote,
} from '../types';

/**
 * Bookings API client
 */
export const bookingsApi = {
  /**
   * Create a new booking
   */
  async create(request: CreateBookingRequest): Promise<CreateBookingResponse> {
    const { data } = await apiClient.post<CreateBookingResponse>(
      '/api/public/bookings',
      request
    );
    return data;
  },

  /**
   * Get a quote for a booking (calculate total price)
   */
  async getQuote(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<BookingQuote> {
    const { data } = await apiClient.get<BookingQuote>('/api/public/bookings/quote', {
      params: {
        propertyId,
        startDate,
        endDate,
      },
    });
    return data;
  },

  /**
   * Check availability for a property
   */
  async checkAvailability(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<boolean> {
    try {
      await apiClient.get('/api/public/bookings/check-availability', {
        params: {
          propertyId,
          startDate,
          endDate,
        },
      });
      return true; // Available
    } catch (error) {
      return false; // Not available
    }
  },
};
