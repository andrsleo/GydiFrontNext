'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeCheck } from 'lucide-react';
import type { CreatorProfile } from '../types';
import { CreatorTierBadge } from './creator-tier-badge';
import { FollowButton } from '@/features/social/components/follow-button';
import { useTranslation } from '@/hooks/use-translation';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

interface CreatorProfileHeaderProps {
  profile: CreatorProfile;
  showFollow?: boolean;
  currentUserId?: number;
}

export function CreatorProfileHeader({
  profile,
  showFollow = true,
  currentUserId,
}: CreatorProfileHeaderProps) {
  const { t } = useTranslation('creator');

  const initials =
    profile.displayName
      ?.split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?';

  const isOwnProfile = currentUserId === profile.userId;

  return (
    <div className="flex flex-col gap-6">
      {/* Cover gradient */}
      <div className="h-28 w-full rounded-2xl bg-gradient-to-r from-[hsl(252,100%,64%)] via-[hsl(255,89%,72%)] to-[hsl(177,100%,42%)] sm:h-36 md:h-48" />

      {/* Avatar + info row */}
      <div className="-mt-16 flex flex-col items-center gap-4 px-4 sm:flex-row sm:items-end sm:gap-6">
        <Avatar className="h-20 w-20 ring-4 ring-background sm:h-28 sm:w-28">
          <AvatarImage src={profile.avatarUrl} />
          <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold sm:text-2xl">
              {profile.displayName ?? `Creator ${profile.userId}`}
            </h1>
            {profile.isVerified && (
              <BadgeCheck className="h-5 w-5 text-[hsl(var(--gydi-primary))]" />
            )}
          </div>
          <CreatorTierBadge tier={profile.tier} />
          {profile.bio && (
            <p className="max-w-lg text-center text-sm text-muted-foreground sm:text-left">
              {profile.bio}
            </p>
          )}
        </div>

        {showFollow && !isOwnProfile && (
          <FollowButton targetUserId={profile.userId} className="min-h-11 shrink-0" />
        )}
      </div>

      {/* Stats row — grid on mobile so all 4 fit without overflow */}
      <div className="grid grid-cols-4 gap-2 border-t pt-4 sm:flex sm:items-center sm:gap-8 sm:px-4">
        <div className="text-center">
          <p className="text-base font-bold sm:text-lg">{fmt(profile.contentCount)}</p>
          <p className="text-xs text-muted-foreground">{t('stats.posts')}</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold sm:text-lg">{fmt(profile.followerCount)}</p>
          <p className="text-xs text-muted-foreground">{t('stats.followers')}</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold sm:text-lg">{fmt(profile.followingCount)}</p>
          <p className="text-xs text-muted-foreground">{t('stats.following')}</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold sm:text-lg">{fmt(profile.totalViews)}</p>
          <p className="text-xs text-muted-foreground">{t('stats.views')}</p>
        </div>
      </div>
    </div>
  );
}
