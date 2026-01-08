/**
 * Subscription Status Component
 *
 * Displays the user's current subscription status with key information.
 */

'use client';

import { Calendar, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import type { UserSubscriptionResponse } from '../types';
import { CurrentPlanBadge } from './current-plan-badge';

interface SubscriptionStatusProps {
  subscription: UserSubscriptionResponse;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const isActive = subscription.status === 'ACTIVE';
  const isCanceled = subscription.status === 'CANCELED';
  const willCancelAtPeriodEnd = subscription.canceledAt && !isCanceled;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Subscription</CardTitle>
          <CurrentPlanBadge planCode={subscription.planCode} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Cancellation Notice */}
        {willCancelAtPeriodEnd && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your subscription will cancel on{' '}
              {subscription.expiresAt &&
                format(new Date(subscription.expiresAt), 'MMMM dd, yyyy')}
              . You can continue using your plan until then.
            </AlertDescription>
          </Alert>
        )}

        {/* Status */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Status</span>
            </div>
            <div>
              <Badge
                variant={isActive ? 'default' : 'secondary'}
                className={
                  isActive
                    ? 'bg-green-500'
                    : isCanceled
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }
              >
                {subscription.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>Auto-Renew</span>
            </div>
            <div>
              <Badge variant={subscription.autoRenew ? 'default' : 'outline'}>
                {subscription.autoRenew ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Started</span>
            </div>
            <p className="text-sm font-medium">
              {format(new Date(subscription.startedAt), 'MMMM dd, yyyy')}
            </p>
          </div>

          {subscription.nextBillingDate && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Next Billing</span>
              </div>
              <p className="text-sm font-medium">
                {format(new Date(subscription.nextBillingDate), 'MMMM dd, yyyy')}
              </p>
            </div>
          )}
        </div>

        {/* Cancellation Info */}
        {subscription.canceledAt && (
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">Canceled on</p>
            <p className="text-sm font-medium">
              {format(new Date(subscription.canceledAt), 'MMMM dd, yyyy')}
            </p>
            {subscription.cancelationReason && (
              <>
                <p className="text-sm text-muted-foreground mt-3">Reason</p>
                <p className="text-sm">{subscription.cancelationReason}</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
