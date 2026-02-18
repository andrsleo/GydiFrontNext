/**
 * Booking types for vacation rental bookings
 * Aligned with backend BookingDto and BookingStatus
 */

/**
 * Booking Status - Matches backend BookingStatus enum
 */
export type BookingStatus =
  | 'REQUEST'
  | 'RESERVED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'CANCELLED'
  | 'DISPUTED';

/**
 * Status labels for display
 */
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  REQUEST: 'Solicitud',
  RESERVED: 'Confirmada',
  IN_PROGRESS: 'En curso',
  FINISHED: 'Finalizada',
  CANCELLED: 'Cancelada',
  DISPUTED: 'En disputa',
};

/**
 * Booking DTO - Matches backend BookingDto
 */
export interface BookingDto {
  id: number;
  referralLinkId: number;
  propertyId: number;
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
  currency: string;
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

  // Relations (populated from backend)
  propertyTitle?: string;
  hostName?: string;
  affiliateName?: string;
}

/**
 * Booking Filters
 */
export interface BookingFilters {
  status?: BookingStatus;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  page?: number;
  size?: number;
}

/**
 * Booking Stats
 */
export interface BookingStats {
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  currency: string;
}

/**
 * Create Booking Request (from public booking form)
 *
 * ✅ UPDATED: Field names match backend CreateBookingRequest DTO
 */
export interface CreateBookingRequest {
  referralLinkId: string;
  propertyId: string;
  checkInDate: string; // YYYY-MM-DD (was startDate)
  checkOutDate: string; // YYYY-MM-DD (was endDate)
  guestName: string; // Full name (was clientFirstName + clientLastName)
  guestEmail: string; // (was clientEmail)
  guestPhone: string; // (was clientPhone)
  guestsCount: number; // Number of guests (NEW field)
}

/**
 * Create Booking Response
 */
export interface CreateBookingResponse {
  bookingId: string;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  createdAt: string;
}

/**
 * Booking Quote
 */
export interface BookingQuote {
  propertyId: string;
  startDate: string;
  endDate: string;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  currency: string;
}

/**
 * Status variant helper for Badge component
 */
export function getStatusVariant(
  status: BookingStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<BookingStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    REQUEST: 'secondary',
    RESERVED: 'default',
    IN_PROGRESS: 'default',
    FINISHED: 'default',
    CANCELLED: 'destructive',
    DISPUTED: 'destructive',
  };
  return variants[status];
}

/**
 * Status label helper
 */
export function getStatusLabel(status: BookingStatus): string {
  return BOOKING_STATUS_LABELS[status] || status;
}
