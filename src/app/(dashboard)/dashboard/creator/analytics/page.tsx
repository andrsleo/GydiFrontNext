'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart2, Eye, Heart, Bookmark, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCreatorContentAnalytics,
  useCreatorTopContent,
} from '@/features/creator/hooks/use-creator-analytics';
import type { CreatorContentAnalytics } from '@/features/creator/types';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-translation';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-w-[48px] flex-col items-center gap-0.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

function ContentAnalyticsRow({ item, t }: { item: CreatorContentAnalytics; t: (k: string) => string }) {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'es';

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3 sm:gap-4 sm:p-4">
      {item.thumbnailUrl ? (
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg sm:h-14 sm:w-14">
          <Image
            src={item.thumbnailUrl}
            alt={item.caption ?? t('analytics.noCaption')}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted sm:h-14 sm:w-14">
          <BarChart2 className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {item.caption ?? t('analytics.noCaption')}
        </p>
        <p className="text-xs text-muted-foreground">
          {item.publishedAt
            ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
                new Date(item.publishedAt)
              )
            : t('analytics.draft')}
        </p>
      </div>

      <div className="hidden items-center gap-4 sm:flex sm:gap-5">
        <Stat icon={Eye} value={fmt(item.views)} label={t('analytics.stat.views')} />
        <Stat icon={Heart} value={fmt(item.likes)} label={t('analytics.stat.likes')} />
        <Stat icon={Bookmark} value={fmt(item.saves)} label={t('analytics.stat.saves')} />
        <Stat icon={ShoppingBag} value={String(item.bookingsGenerated)} label={t('analytics.stat.bookings')} />
      </div>

      {/* Mobile: compact stats row */}
      <div className="flex items-center gap-3 sm:hidden">
        <Stat icon={Eye} value={fmt(item.views)} label={t('analytics.stat.views')} />
        <Stat icon={Heart} value={fmt(item.likes)} label={t('analytics.stat.likes')} />
      </div>
    </div>
  );
}

export default function CreatorAnalyticsPage() {
  const [page, setPage] = useState(0);
  const { data: content, isLoading } = useCreatorContentAnalytics(page);
  const { data: topContent, isLoading: isLoadingTop } = useCreatorTopContent(5);
  const { t } = useTranslation('creator');

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/creator">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{t('analytics.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('analytics.subtitle')}</p>
        </div>
      </div>

      {/* Top 5 */}
      <section>
        <h2 className="mb-3 font-semibold">{t('analytics.topPerforming')}</h2>
        {isLoadingTop ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(topContent ?? []).map((item) => (
              <ContentAnalyticsRow key={item.contentPostId} item={item} t={t} />
            ))}
            {!topContent?.length && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t('analytics.noPosts')}
              </p>
            )}
          </div>
        )}
      </section>

      {/* All content */}
      <section>
        <h2 className="mb-3 font-semibold">{t('analytics.allPosts')}</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(content ?? []).map((item) => (
              <ContentAnalyticsRow key={item.contentPostId} item={item} t={t} />
            ))}
            {!content?.length && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t('analytics.noPostsAll')}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="min-h-11"
          >
            {t('analytics.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!content || content.length < 20}
            onClick={() => setPage((p) => p + 1)}
            className="min-h-11"
          >
            {t('analytics.next')}
          </Button>
        </div>
      </section>
    </div>
  );
}
