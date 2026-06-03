'use client';

import { useTranslation } from '@/hooks/use-translation';
import type { CreatorProfile } from '../types';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

interface CreatorStatsGridProps {
  profile: CreatorProfile;
}

export function CreatorStatsGrid({ profile }: CreatorStatsGridProps) {
  const { t } = useTranslation('creator');

  const stats = [
    { label: t('stats.posts'), value: fmt(profile.contentCount) },
    { label: t('stats.followers'), value: fmt(profile.followerCount) },
    { label: t('stats.following'), value: fmt(profile.followingCount) },
    { label: t('stats.views'), value: fmt(profile.totalViews) },
    {
      label: t('stats.engagement'),
      value: `${(profile.avgEngagementRate * 100).toFixed(1)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {stats.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center gap-0.5">
          <span className="text-base font-semibold sm:text-lg">{value}</span>
          <span className="text-center text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
