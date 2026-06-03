'use client';

import type { UrlObject } from 'url';
import { useUser } from '@/features/auth/hooks/use-auth';
import { useCreatorProfile } from '@/features/creator/hooks/use-creator-profile';
import { useCreatorAnalyticsOverview } from '@/features/creator/hooks/use-creator-analytics';
import { CreatorStatsGrid } from '@/features/creator/components/creator-stats-grid';
import { CreatorTierBadge } from '@/features/creator/components/creator-tier-badge';
import { CreatorUpgradeModal } from '@/features/creator/components/creator-upgrade-modal';
import { CreatorReferralCard } from '@/features/creator/components/creator-referral-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, BarChart2, FileVideo, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { useCurrencyFormat } from '@/hooks/use-currency-format';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function KpiCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  accent?: string;
}) {
  const content = (
    <div className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: accent ? `${accent}/10` : undefined }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </div>
        <span className="text-xs text-muted-foreground sm:text-sm">{label}</span>
      </div>
      <p className="text-xl font-bold sm:text-2xl">{value}</p>
    </div>
  );

  if (href) {
    return <Link href={href as unknown as UrlObject}>{content}</Link>;
  }
  return content;
}

function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export default function CreatorDashboardPage() {
  const user = useUser();
  const userId = user?.id ? Number(user.id) : 0;
  const { t } = useTranslation('creator');
  const { formatAmount } = useCurrencyFormat();

  const { data: profile, isLoading: isLoadingProfile } = useCreatorProfile(userId);
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useCreatorAnalyticsOverview();

  const isLoading = isLoadingProfile || isLoadingAnalytics;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl sm:h-28" />
          ))}
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--gydi-primary))]/10">
          <Sparkles className="h-8 w-8 text-[hsl(var(--gydi-primary))]" />
        </div>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{t('dashboard.becomeCreator')}</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
            {t('dashboard.becomeCreatorDesc')}
          </p>
        </div>
        <CreatorUpgradeModal />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{t('dashboard.title')}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <CreatorTierBadge tier={profile.tier} />
            <span className="text-sm text-muted-foreground">
              {t('dashboard.subtitle', {
                count: profile.contentCount,
                followers: fmt(profile.followerCount),
              })}
            </span>
          </div>
        </div>
        <Button asChild className="min-h-11 w-full sm:w-auto">
          <Link href="/dashboard/content/new">{t('dashboard.newPost')}</Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <KpiCard
          icon={TrendingUp}
          label={t('dashboard.kpi.totalViews')}
          value={fmt(analytics?.totalViews ?? profile.totalViews)}
          accent="hsl(var(--gydi-primary))"
        />
        <KpiCard
          icon={FileVideo}
          label={t('dashboard.kpi.posts')}
          value={String(analytics?.contentCount ?? profile.contentCount)}
          href="/dashboard/creator/analytics"
          accent="hsl(var(--gydi-teal))"
        />
        <KpiCard
          icon={ShoppingBagIcon}
          label={t('dashboard.kpi.bookings')}
          value={String(analytics?.totalBookings ?? 0)}
          href="/dashboard/creator/analytics"
          accent="hsl(var(--gydi-gold))"
        />
        <KpiCard
          icon={BarChart2}
          label={t('dashboard.kpi.earnings')}
          value={formatAmount(analytics?.totalEarnings ?? 0, 'USD')}
          href="/dashboard/creator/earnings"
          accent="hsl(var(--gydi-teal))"
        />
      </div>

      {/* Stats grid */}
      <div className="rounded-2xl border bg-card p-4 sm:p-6">
        <h2 className="mb-4 font-semibold">{t('dashboard.profileStats')}</h2>
        <CreatorStatsGrid profile={profile} />
      </div>

      {/* Referral card */}
      <CreatorReferralCard />

      {/* Navigation cards */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <Link
          href="/dashboard/content"
          className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md sm:p-6"
        >
          <FileVideo className="mb-2 h-6 w-6 text-[hsl(var(--gydi-teal))]" />
          <h3 className="font-semibold">{t('dashboard.sections.myContent')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('dashboard.sections.myContentDesc')}
          </p>
          <p className="mt-3 text-xl font-bold sm:text-2xl">{profile.contentCount}</p>
        </Link>

        <Link
          href={{ pathname: '/dashboard/creator/analytics' }}
          className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md sm:p-6"
        >
          <BarChart2 className="mb-2 h-6 w-6 text-[hsl(var(--gydi-primary))]" />
          <h3 className="font-semibold">{t('dashboard.sections.analytics')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('dashboard.sections.analyticsDesc')}
          </p>
          <p className="mt-3 text-sm text-[hsl(var(--gydi-primary))]">
            {t('dashboard.sections.analyticsLink')}
          </p>
        </Link>

        <Link
          href={{ pathname: '/dashboard/creator/earnings' }}
          className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md sm:p-6"
        >
          <BarChart2 className="mb-2 h-6 w-6 text-[hsl(var(--gydi-teal))]" />
          <h3 className="font-semibold">{t('dashboard.sections.earnings')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('dashboard.sections.earningsDesc')}
          </p>
          <p className="mt-3 text-xl font-bold sm:text-2xl">
            {`${(profile.avgEngagementRate * 100).toFixed(1)}%`}
          </p>
        </Link>
      </div>
    </div>
  );
}
