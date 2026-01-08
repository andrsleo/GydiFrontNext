/**
 * Subscription Management Page
 *
 * Main page for managing user subscription and payment methods.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, CreditCard, Settings, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubscriptionStatus } from '@/features/subscriptions/components/subscription-status';
import { PaymentMethodCard } from '@/features/subscriptions/components/payment-method-card';
import { ChangePlanDialog } from '@/features/subscriptions/components/change-plan-dialog';
import { CancelSubscriptionDialog } from '@/features/subscriptions/components/cancel-subscription-dialog';
import { AddPaymentMethodDialog } from '@/features/subscriptions/components/add-payment-method-dialog';
import { useSubscription } from '@/features/subscriptions/hooks/use-subscription';
import { usePaymentMethods } from '@/features/subscriptions/hooks/use-payment-methods';

export default function SubscriptionPage() {
  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  const {
    data: subscription,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription();

  const {
    data: paymentMethods,
    isLoading: paymentMethodsLoading,
  } = usePaymentMethods();

  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (subscriptionError || !subscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            You don&apos;t have an active subscription yet.{' '}
            <Link
              href="/dashboard/subscription/plans"
              className="font-medium underline"
            >
              Choose a plan
            </Link>{' '}
            to get started.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Subscription Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription plan and payment methods
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Subscription Status */}
        <div className="space-y-6">
          <SubscriptionStatus subscription={subscription} />

          {/* Quick Actions */}
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
                onClick={() => setShowChangePlanDialog(true)}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Change Plan
              </Button>

              <Button
                className="w-full"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/subscription/plans">
                  View All Plans
                </Link>
              </Button>

              {subscription.status === 'ACTIVE' && !subscription.canceledAt && subscription.planCode !== 'FREE' && (
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Subscription
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Methods */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowAddPaymentDialog(true)}
                >
                  Add Card
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethodsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : paymentMethods && paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    paymentMethod={method}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    No payment methods added yet
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setShowAddPaymentDialog(true)}
                  >
                    Add Your First Card
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Info */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-medium">#{subscription.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subscription ID</span>
                <span className="font-medium">#{subscription.id}</span>
              </div>
              {subscription.stripeCustomerId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stripe Customer</span>
                  <span className="font-mono text-xs">
                    {subscription.stripeCustomerId}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <ChangePlanDialog
        open={showChangePlanDialog}
        onOpenChange={setShowChangePlanDialog}
        currentPlanCode={subscription.planCode}
      />

      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        planName={subscription.planName}
      />

      <AddPaymentMethodDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
      />
    </div>
  );
}
