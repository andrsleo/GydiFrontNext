/**
 * Subscription management action buttons
 */

'use client';

import Link from 'next/link';
import { Settings, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserSubscriptionResponse } from '../types';

interface SubscriptionActionsProps {
  subscription: UserSubscriptionResponse;
  onChangePlan: () => void;
  onCancel: () => void;
}

export function SubscriptionActions({
  subscription,
  onChangePlan,
  onCancel,
}: SubscriptionActionsProps) {
  const canCancel =
    subscription.status === 'ACTIVE' &&
    !subscription.canceledAt &&
    subscription.planCode !== 'FREE';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Manage Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full"
          variant="default"
          onClick={onChangePlan}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Change Plan
        </Button>

        <Button className="w-full" variant="outline" asChild>
          <Link href="/dashboard/subscription/plans">View All Plans</Link>
        </Button>

        {canCancel && (
          <Button
            className="w-full"
            variant="destructive"
            onClick={onCancel}
          >
            Cancel Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
