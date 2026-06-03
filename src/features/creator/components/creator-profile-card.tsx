'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import type { CreatorProfile } from '../types';
import { CreatorTierBadge } from './creator-tier-badge';
import { FollowButton } from '@/features/social/components/follow-button';
import { useTranslation } from '@/hooks/use-translation';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

interface CreatorProfileCardProps {
  profile: CreatorProfile;
  showFollow?: boolean;
}

export function CreatorProfileCard({
  profile,
  showFollow = true,
}: CreatorProfileCardProps) {
  const { t } = useTranslation('creator');

  const initials = profile.displayName
    ?.split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col items-center gap-3 px-4 pb-4 pt-6 text-center">
        <Link href={`/creators/${String(profile.userId)}`}>
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatarUrl} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col items-center gap-1">
          <Link
            href={`/creators/${String(profile.userId)}`}
            className="flex items-center gap-1 font-semibold hover:underline"
          >
            {profile.displayName ?? `Creator ${profile.userId}`}
            {profile.isVerified && (
              <BadgeCheck className="h-4 w-4 text-[hsl(var(--gydi-primary))]" />
            )}
          </Link>
          <CreatorTierBadge tier={profile.tier} />
        </div>

        {profile.bio && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{profile.bio}</p>
        )}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col items-center">
            <span className="font-semibold">{fmt(profile.contentCount)}</span>
            <span className="text-xs text-muted-foreground">{t('stats.posts')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold">{fmt(profile.followerCount)}</span>
            <span className="text-xs text-muted-foreground">{t('stats.followers')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold">{fmt(profile.totalViews)}</span>
            <span className="text-xs text-muted-foreground">{t('stats.views')}</span>
          </div>
        </div>

        {showFollow && (
          <FollowButton targetUserId={profile.userId} className="min-h-11 w-full" />
        )}
      </CardContent>
    </Card>
  );
}
