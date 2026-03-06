/**
 * Billing Information Display Component
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserSubscriptionResponse } from '../types';

interface BillingInfoProps {
  subscription: UserSubscriptionResponse;
}

export function BillingInfo({ subscription }: BillingInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <InfoRow label="User ID" value={`#${subscription.userId}`} />
        <InfoRow label="Subscription ID" value={`#${subscription.id}`} />
      </CardContent>
    </Card>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function InfoRow({ label, value, valueClassName }: InfoRowProps) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={valueClassName || 'font-medium'}>{value}</span>
    </div>
  );
}
