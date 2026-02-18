/**
 * Booking Status Badge Component
 *
 * Server Component - Display booking status with appropriate styling
 */

import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS_CONFIG, type BookingStatus } from '../../types';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = BOOKING_STATUS_CONFIG[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
