'use client';

import Link from 'next/link';
import { ArrowLeft, DollarSign, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useCreatorEarnings } from '@/features/creator/hooks/use-creator-analytics';
import type { CreatorEarnings } from '@/features/creator/types';
import { useTranslation } from '@/hooks/use-translation';
import { useCurrencyFormat } from '@/hooks/use-currency-format';

function EarningsRow({
  item,
  t,
  formatAmount,
}: {
  item: CreatorEarnings;
  t: (k: string, p?: Record<string, string | number>) => string;
  formatAmount: (amount: number | null | undefined, originalCurrency?: 'USD') => string;
}) {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'es';

  const ATTRIBUTION_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
    DIRECT_VIEW: 'default',
    SHARED_LINK: 'secondary',
    CREATOR_LINK: 'outline',
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3 sm:gap-4 sm:p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--gydi-teal))]/10">
        <DollarSign className="h-5 w-5 text-[hsl(var(--gydi-teal))]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {item.contentCaption || t('earnings.noCaption')}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          <Badge
            variant={ATTRIBUTION_VARIANTS[item.attributionType] ?? 'default'}
            className="text-[10px]"
          >
            {t(`earnings.attribution.${item.attributionType}` as Parameters<typeof t>[0])}
          </Badge>
          {item.bookingId && (
            <span className="text-xs text-muted-foreground">
              {t('earnings.booking', { id: item.bookingId })}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-semibold text-[hsl(var(--gydi-teal))]">
          {item.amount > 0 ? formatAmount(item.amount, 'USD') : t('earnings.pending')}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
            new Date(item.earnedAt)
          )}
        </span>
      </div>
    </div>
  );
}

export default function CreatorEarningsPage() {
  const { data: earnings, isLoading } = useCreatorEarnings();
  const { t } = useTranslation('creator');
  const { formatAmount } = useCurrencyFormat();

  const total = (earnings ?? []).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/creator">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{t('earnings.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('earnings.subtitle')}</p>
        </div>
      </div>

      {/* Total card */}
      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">{t('earnings.totalAccumulated')}</p>
        <div className="mt-1 text-2xl font-bold text-[hsl(var(--gydi-teal))] sm:text-3xl">
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            formatAmount(total, 'USD')
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('earnings.attributions', { count: earnings?.length ?? 0 })}
        </p>
      </div>

      {/* Earnings list */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">{t('earnings.breakdown')}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={{ pathname: '/dashboard/creator/analytics' }}>
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              {t('earnings.viewAnalytics')}
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(earnings ?? []).map((item, idx) => (
              <EarningsRow
                key={`${item.contentPostId}-${idx}`}
                item={item}
                t={t}
                formatAmount={formatAmount}
              />
            ))}
            {!earnings?.length && (
              <div className="rounded-xl border bg-muted/30 p-6 text-center sm:p-8">
                <DollarSign className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t('earnings.noEarnings')}</p>
                <Button variant="outline" size="sm" className="mt-4 min-h-11" asChild>
                  <Link href="/dashboard/content/new">{t('earnings.createContent')}</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
