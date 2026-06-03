/**
 * ContentStatusBadge — displays content moderation status
 */

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ContentStatus } from '../types';

interface ContentStatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  ContentStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: 'Borrador',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  },
  PROCESSING: {
    label: 'Procesando',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  },
  PUBLISHED: {
    label: 'Publicado',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  REJECTED: {
    label: 'Rechazado',
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
  ARCHIVED: {
    label: 'Archivado',
    className: 'bg-gray-700 text-gray-100 hover:bg-gray-800',
  },
  HIDDEN: {
    label: 'Oculto',
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  },
};

export function ContentStatusBadge({
  status,
  className,
}: ContentStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;

  return (
    <Badge
      variant="secondary"
      className={cn('text-xs font-semibold', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
