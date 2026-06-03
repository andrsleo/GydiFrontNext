import { cn } from '@/lib/utils/cn';
import type { CreatorTier } from '../types';
import { CREATOR_TIER_LABELS } from '../types';

const TIER_CLASSES: Record<CreatorTier, string> = {
  EMERGING: 'bg-slate-100 text-slate-600',
  RISING: 'bg-amber-100 text-amber-700',
  ESTABLISHED: 'bg-teal-100 text-teal-700',
  ELITE: 'bg-violet-100 text-violet-700',
};

interface CreatorTierBadgeProps {
  tier: CreatorTier;
  className?: string;
}

export function CreatorTierBadge({ tier, className }: CreatorTierBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        TIER_CLASSES[tier],
        className
      )}
    >
      {CREATOR_TIER_LABELS[tier]}
    </span>
  );
}
