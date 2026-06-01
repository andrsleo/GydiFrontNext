import { Badge } from '@/components/ui/badge';
import type { PitchStatus } from '../../types';

interface PitchStatusBadgeProps {
  status: PitchStatus;
}

const STATUS_CONFIG: Record<
  PitchStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Pendiente', variant: 'secondary' },
  COUNTERED: { label: 'Contraoferta', variant: 'default' },
  ACCEPTED: { label: 'Aceptado', variant: 'default' },
  DECLINED: { label: 'Rechazado', variant: 'destructive' },
  EXPIRED: { label: 'Expirado', variant: 'outline' },
  CANCELLED: { label: 'Cancelado', variant: 'outline' },
  COMPLETED: { label: 'Completado', variant: 'default' },
};

export function PitchStatusBadge({ status }: PitchStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: 'outline' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
