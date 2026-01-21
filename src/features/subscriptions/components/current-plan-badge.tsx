/**
 * Current Plan Badge Component
 *
 * Displays a badge showing the user's current subscription plan.
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CurrentPlanBadgeProps {
  planCode: string;
  className?: string;
}

const PLAN_STYLES = {
  FREE: {
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  },
  PRO: {
    variant: 'default' as const,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
  ELITE: {
    variant: 'default' as const,
    className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
  },
};

export function CurrentPlanBadge({ planCode, className }: CurrentPlanBadgeProps) {
  const style = PLAN_STYLES[planCode as keyof typeof PLAN_STYLES] || PLAN_STYLES.FREE;

  return (
    <Badge
      variant={style.variant}
      className={cn(style.className, 'font-semibold', className)}
    >
      {planCode} Plan
    </Badge>
  );
}
