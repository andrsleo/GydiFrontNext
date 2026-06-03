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
  guestName: string;
  guestEmail: string;
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

  // Fase 1 — Host confirmation/rejection
  termsAcceptedAt?: string;       // ISO timestamp
  confirmedByHostAt?: string;     // ISO timestamp
  rejectedByHostAt?: string;      // ISO timestamp
  rejectionReason?: string;

  // Fase 2 — Stripe payment fields
  stripeBookingIntentId?: string;
  stripeDepositIntentId?: string;
  depositAmount?: number;
  depositCurrency?: string;
  depositCapturedAt?: string;
  depositCaptureAmount?: number;
  paymentReleasedAt?: string;
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
  termsAccepted: boolean;           // Fase 1: T&C acceptance required
  stripePaymentMethodId?: string;   // Fase 2: optional in Fase 1
  contentPostId?: number;           // Phase 4: social commerce attribution (optional)
}

/**
 * Reject Booking Request — for host to reject a booking with a reason
 */
export interface RejectBookingRequest {
  reason: string;
}

/**
 * Block Dates Request — host blocks unavailable dates manually
 */
export interface BlockDatesRequest {
  dates: string[]; // ['YYYY-MM-DD', ...]
}

/**
 * Capture Damage Deposit Request — host captures partial or full damage deposit
 */
export interface CaptureDamageDepositRequest {
  damageAmountCents?: number; // null = full capture
  description: string;
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
