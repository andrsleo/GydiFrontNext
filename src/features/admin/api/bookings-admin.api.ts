/**
 * Admin Bookings API Client
 *
 * API functions for admin booking management
 */

import { apiClient } from '@/lib/api/client';
import type {
  BookingDto,
  CreateBookingRequest,
  ReserveBookingRequest,
  CancelBookingRequest,
  DisputeBookingRequest,
  BookingFilters,
} from '../types';

/**
 * Admin bookings API
 */
export const bookingsAdminApi = {
  /**
   * Get booking by ID
   */
  async getBooking(id: number): Promise<BookingDto> {
    const { data } = await apiClient.get<BookingDto>(`/api/v1/bookings/${id}`);
    return data;
  },

  /**
   * List all bookings with filters (paginated)
   */
  async listBookings(filters?: BookingFilters): Promise<BookingDto[]> {
    const { data } = await apiClient.get<BookingDto[]>('/api/v1/bookings', {
      params: filters,
    });
    return data;
  },

  /**
   * Create a new booking
   */
  async createBooking(request: CreateBookingRequest): Promise<BookingDto> {
    const { data } = await apiClient.post<BookingDto>('/api/v1/bookings', request);
    return data;
  },

  /**
   * Reserve booking (confirm with Airbnb)
   */
  async reserveBooking(id: number, request: ReserveBookingRequest): Promise<BookingDto> {
    const { data } = await apiClient.put<BookingDto>(
      `/api/v1/bookings/${id}/reserve`,
      request
    );
    return data;
  },

  /**
   * Cancel booking
   */
  async cancelBooking(id: number, request: CancelBookingRequest): Promise<BookingDto> {
    const { data } = await apiClient.put<BookingDto>(
      `/api/v1/bookings/${id}/cancel`,
      request
    );
    return data;
  },

  /**
   * Mark booking as in progress (guest checked in)
   */
  async startBooking(id: number): Promise<BookingDto> {
    const { data } = await apiClient.put<BookingDto>(`/api/v1/bookings/${id}/start`);
    return data;
  },

  /**
   * Mark booking as finished (guest checked out)
   */
  async finishBooking(id: number): Promise<BookingDto> {
    const { data } = await apiClient.put<BookingDto>(`/api/v1/bookings/${id}/finish`);
    return data;
  },

  /**
   * Mark booking as disputed (FINISHED → DISPUTED)
   * Requires a reason and the ID of the user raising the dispute.
   */
  async disputeBooking(id: number, request: DisputeBookingRequest): Promise<BookingDto> {
    const { data } = await apiClient.put<BookingDto>(`/api/v1/bookings/${id}/dispute`, request);
    return data;
  },
};
