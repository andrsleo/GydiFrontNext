/**
 * Commission Status Badge Component
 *
 * Server Component - Display commission status with appropriate styling
 */

import { Badge } from '@/components/ui/badge';
import {
  HOST_COMMISSION_STATUS_CONFIG,
  AFFILIATE_COMMISSION_STATUS_CONFIG,
  type HostCommissionStatus,
  type AffiliateCommissionStatus,
} from '../../types';

interface HostCommissionStatusBadgeProps {
  status: HostCommissionStatus;
  type: 'host';
}

interface AffiliateCommissionStatusBadgeProps {
  status: AffiliateCommissionStatus;
  type: 'affiliate';
}

type CommissionStatusBadgeProps =
  | HostCommissionStatusBadgeProps
  | AffiliateCommissionStatusBadgeProps;

export function CommissionStatusBadge(props: CommissionStatusBadgeProps) {
  if (props.type === 'host') {
    const config = HOST_COMMISSION_STATUS_CONFIG[props.status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  } else {
    const config = AFFILIATE_COMMISSION_STATUS_CONFIG[props.status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }
}
