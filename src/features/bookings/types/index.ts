/**
 * Booking types for vacation rental bookings
 */

export interface Booking {
  id: string;
  bookingId: string;
  referralLinkId: string;
  propertyId: string;
  propertyTitle: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  clientEmail: string;
  clientPhone: string;
  clientFirstName: string;
  clientLastName: string;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'Pendiente',
  [BookingStatus.CONFIRMED]: 'Confirmada',
  [BookingStatus.CHECKED_IN]: 'Check-in',
  [BookingStatus.CHECKED_OUT]: 'Check-out',
  [BookingStatus.FINISHED]: 'Finalizada',
  [BookingStatus.CANCELED]: 'Cancelada',
};

export interface CreateBookingRequest {
  referralLinkId: string;
  propertyId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  clientEmail: string;
  clientPhone: string;
  clientFirstName: string;
  clientLastName: string;
  totalAmount: number;
  currency: string;
}

export interface CreateBookingResponse {
  bookingId: string;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  createdAt: string;
}

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
