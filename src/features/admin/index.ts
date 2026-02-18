/**
 * Admin Feature Module
 *
 * Bounded Context: Admin Management
 * Responsibility: Admin dashboards for booking and commission management
 */

// Types
export type {
  BookingDto,
  BookingStatus,
  Currency,
  CreateBookingRequest,
  ReserveBookingRequest,
  CancelBookingRequest,
  BookingFilters,
  HostCommissionDto,
  AffiliateCommissionDto,
  HostCommissionStatus,
  AffiliateCommissionStatus,
  SubscriptionPlan,
  CommissionFilters,
  CommissionStats,
} from './types';

export {
  BOOKING_STATUS_CONFIG,
  HOST_COMMISSION_STATUS_CONFIG,
  AFFILIATE_COMMISSION_STATUS_CONFIG,
} from './types';

// Schemas
export {
  reserveBookingSchema,
  cancelBookingSchema,
  createBookingSchema,
  type ReserveBookingFormData,
  type CancelBookingFormData,
  type CreateBookingFormData,
} from './schemas';

// API
export { bookingsAdminApi, commissionsAdminApi } from './api';

// Hooks
export {
  useBooking,
  useBookings,
  bookingKeys,
  useCreateBooking,
  useReserveBooking,
  useCancelBooking,
  useStartBooking,
  useFinishBooking,
  useDisputeBooking,
  useHostCommissions,
  useHostCommission,
  useAffiliateCommissions,
  useAffiliateCommission,
  useCommissionStats,
  commissionKeys,
  useRetryHostCommission,
  useRetryAffiliateCommission,
  useApproveAffiliateCommission,
  useCancelAffiliateCommission,
} from './hooks';

// Components
export {
  BookingStatusBadge,
  BookingActionsDropdown,
  BookingsTable,
  ReserveBookingDialog,
  CancelBookingDialog,
  CommissionStatusBadge,
  HostCommissionsTable,
  AffiliateCommissionsTable,
  CommissionStatsCards,
} from './components';
