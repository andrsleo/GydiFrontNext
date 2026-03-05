/**
 * EarningsSummary - Display earnings breakdown
 */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { useEarnings, useNextPayout, useEarningsByStatus } from '../hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { getAffiliateBadgeInfo } from '@/lib/constants/plans';

const MINIMUM_PAYOUT = 50;

export function EarningsSummary() {
  const { data: earnings, isLoading } = useEarnings();
  const nextPayout = useNextPayout();
  const earningsByStatus = useEarningsByStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!earnings) {
    return null;
  }

  const progressToMinimum = Math.min((earnings.approvedAmount / MINIMUM_PAYOUT) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Total Earnings</CardTitle>
            <CardDescription>View your earnings breakdown and payout status</CardDescription>
            {(() => {
              const badgeInfo = getAffiliateBadgeInfo(earnings.currentCommissionRate);
              return (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Plan:</span>
                    <Badge variant="outline">{earnings.currentPlan}</Badge>
                    <Badge variant={badgeInfo.boosted ? 'default' : 'secondary'}>
                      {badgeInfo.rate} comisión
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{badgeInfo.tip}</p>
                </div>
              );
            })()}
          </div>
          <DollarSign className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Total Earnings */}
        <div>
          <p className="text-4xl font-bold text-green-600">
            ${earnings.totalEarnings.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">All-time earnings</p>
        </div>

        {/* Breakdown by Status */}
        <div className="space-y-3">
          {earningsByStatus.map((item) => (
            <div key={item.status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full bg-${item.color}-500`} />
                <span className="text-sm">{item.status}</span>
                <Badge variant="secondary" className="text-xs">
                  {item.count}
                </Badge>
              </div>
              <span className="font-medium">${item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Progress to Minimum Payout */}
        {earnings.approvedAmount < MINIMUM_PAYOUT && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to minimum payout</span>
              <span className="font-medium">
                ${earnings.approvedAmount.toFixed(2)} / ${MINIMUM_PAYOUT}
              </span>
            </div>
            <Progress value={progressToMinimum} />
            <p className="text-xs text-muted-foreground">
              ${(MINIMUM_PAYOUT - earnings.approvedAmount).toFixed(2)} more needed for payout
            </p>
          </div>
        )}

        {/* Next Payout */}
        {nextPayout && (
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Next Payout</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ${nextPayout.amount.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {nextPayout.date.toLocaleDateString()} ({nextPayout.daysUntil} days)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}