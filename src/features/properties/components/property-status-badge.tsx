import { Badge } from '@/components/ui/badge';
import { PropertyStatus, PROPERTY_STATUS_LABELS } from '../types';

// Available badge variants: default | secondary | destructive | outline | success | warning
const STATUS_VARIANT: Record<PropertyStatus, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  [PropertyStatus.DRAFT]: 'secondary',
  [PropertyStatus.SEND_GYDI_COHOST]: 'warning',
  [PropertyStatus.PENDING_APPROVAL]: 'default',
  [PropertyStatus.PUBLISHED]: 'success',
  [PropertyStatus.INACTIVE]: 'warning',
  [PropertyStatus.DENY]: 'destructive',
  [PropertyStatus.DELETED]: 'secondary',
};

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
}

export function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  const variant = STATUS_VARIANT[status] ?? 'secondary';
  const label = PROPERTY_STATUS_LABELS[status] ?? status;
  return <Badge variant={variant}>{label}</Badge>;
}
