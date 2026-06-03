'use client';

import { useParams } from 'next/navigation';
import { useCreatorProfile } from '@/features/creator/hooks/use-creator-profile';
import { CreatorStatsGrid } from '@/features/creator/components/creator-stats-grid';
import { CreatorTierBadge } from '@/features/creator/components/creator-tier-badge';
import { FollowButton } from '@/features/social/components/follow-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyContent } from '@/features/content/hooks/use-my-content';
import { ContentCard } from '@/features/content/components/content-card';
import { useTranslation } from '@/hooks/use-translation';

export default function CreatorProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const id = Number(userId);
  const { t } = useTranslation('creator');

  const { data: profile, isLoading } = useCreatorProfile(id);
  const { data: contentData } = useMyContent();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8 sm:py-10">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="w-full space-y-2 sm:flex-1">
            <Skeleton className="mx-auto h-6 w-48 sm:mx-0" />
            <Skeleton className="mx-auto h-4 w-32 sm:mx-0" />
          </div>
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-20">
        <p className="text-sm text-muted-foreground">{t('profile.notFound')}</p>
      </div>
    );
  }

  const initials =
    profile.displayName
      ?.split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?';

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8 sm:space-y-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatarUrl} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
            <h1 className="text-xl font-bold sm:text-2xl">
              {profile.displayName ?? `Creator ${profile.userId}`}
            </h1>
            {profile.isVerified && (
              <BadgeCheck className="h-5 w-5 text-[hsl(var(--gydi-primary))]" />
            )}
          </div>
          <CreatorTierBadge tier={profile.tier} className="mt-1" />
          {profile.bio && (
            <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>
          )}
        </div>
        <FollowButton targetUserId={profile.userId} className="min-h-11 w-full shrink-0 sm:w-auto" />
      </div>

      {/* Stats */}
      <div className="rounded-2xl border bg-card p-4 sm:p-6">
        <CreatorStatsGrid profile={profile} />
      </div>

      {/* Content */}
      <div>
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">{t('profile.posts')}</h2>
        {contentData?.content.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('profile.noPostsYet')}</p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {contentData?.content.map((post) => (
              <ContentCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
