'use client';

import { Badge } from '@/components/ui/badge';
import { PropertyStatus } from '../types';
import { useTranslation } from '@/hooks/use-translation';

// Available badge variants: default | secondary | destructive | outline | success | warning
const STATUS_VARIANT: Record<PropertyStatus, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  [PropertyStatus.DRAFT]: 'secondary',
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
  const { t } = useTranslation('properties');
  const variant = STATUS_VARIANT[status] ?? 'secondary';
  const label = t(`card.status.${status}`);
  return <Badge variant={variant}>{label}</Badge>;
}
