/**
 * Admin Booking Types
 *
 * Types for admin booking management matching backend DTOs
 */

/**
 * Booking status enum matching backend
 */
export type BookingStatus =
  | 'REQUEST'
  | 'RESERVED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'CANCELLED'
  | 'DISPUTED';

/**
 * Currency codes
 */
export type Currency = 'USD' | 'EUR' | 'GBP' | 'MXN';

/**
 * Booking DTO from backend
 */
export interface BookingDto {
  id: number;
  referralLinkId: number;
  propertyId: number;

  // Dates
  checkInDate: string; // ISO date
  checkOutDate: string; // ISO date

  // Guest info
  guestEmail: string;
  guestFirstName: string;
  guestLastName: string;
  guestPhone?: string;
  guestsCount: number;

  // Booking details
  totalAmount?: number;
  currency: Currency;
  airbnbConfirmationCode?: string;

  // Status
  status: BookingStatus;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  reservedAt?: string;
  startedAt?: string;
  finishedAt?: string;
  cancelledAt?: string;
}

/**
 * Create booking request
 */
export interface CreateBookingRequest {
  referralLinkId: number;
  propertyId: number;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guestEmail: string;
  guestFirstName: string;
  guestLastName: string;
  guestPhone?: string;
  guestsCount: number;
}

/**
 * Reserve booking request (confirm with Airbnb)
 */
export interface ReserveBookingRequest {
  airbnbConfirmationCode: string;
  totalAmount: number;
  currency: Currency;
  adminId: number;
  checkInDate?: string; // Optional - to modify dates
  checkOutDate?: string; // Optional - to modify dates
}

/**
 * Cancel booking request
 */
export interface CancelBookingRequest {
  cancelledBy: number;
  reason: string;
}

/**
 * Dispute booking request
 */
export interface DisputeBookingRequest {
  disputedBy: number;
  reason: string;
}

/**
 * Booking filters for list
 */
export interface BookingFilters {
  status?: BookingStatus;
  propertyId?: number;
  page?: number;
  size?: number;
}

/**
 * Status configuration for UI
 */
export const BOOKING_STATUS_CONFIG: Record<BookingStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'success';
}> = {
  REQUEST: { label: 'Solicitud', variant: 'secondary' },
  RESERVED: { label: 'Confirmada', variant: 'default' },
  IN_PROGRESS: { label: 'En curso', variant: 'default' },
  FINISHED: { label: 'Finalizada', variant: 'success' },
  CANCELLED: { label: 'Cancelada', variant: 'destructive' },
  DISPUTED: { label: 'En disputa', variant: 'warning' },
};
