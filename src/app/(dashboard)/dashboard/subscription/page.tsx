/**
 * Subscription Management Page
 *
 * Main page for managing user subscription and payment methods.
 */

'use client';

import Link from 'next/link';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubscriptionStatus } from '@/features/subscriptions/components/subscription-status';
import { SubscriptionActions } from '@/features/subscriptions/components/subscription-actions';
import { PaymentMethodsSection } from '@/features/subscriptions/components/payment-methods-section';
import { BillingInfo } from '@/features/subscriptions/components/billing-info';
import { ChangePlanDialog } from '@/features/subscriptions/components/change-plan-dialog';
import { CancelSubscriptionDialog } from '@/features/subscriptions/components/cancel-subscription-dialog';
import { AddPaymentMethodDialog } from '@/features/subscriptions/components/add-payment-method-dialog';
import { DeletePaymentMethodDialog } from '@/features/subscriptions/components/delete-payment-method-dialog';
import { useSubscriptionPage } from '@/features/subscriptions/hooks/use-subscription-page';
import { getRecommendedUpgradePlan } from '@/lib/utils/subscription';

export default function SubscriptionPage() {
  const {
    dialogs,
    methodToDelete,
    methodIdToSetDefault,
    subscription,
    subscriptionLoading,
    subscriptionError,
    paymentMethods,
    paymentMethodsLoading,
    plans,
    isDeleting,
    isSettingDefault,
    openDialog,
    closeDialog,
    handleDeleteClick,
    handleConfirmDelete,
    handleSetDefault,
  } = useSubscriptionPage();

  if (subscriptionLoading) {
    return <LoadingSpinner size="lg" variant="centered" />;
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

  const recommendedPlan = plans
    ? getRecommendedUpgradePlan(plans, subscription.planCode)
    : undefined;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <PageHeader />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Subscription Status & Actions */}
        <div className="space-y-6">
          <SubscriptionStatus subscription={subscription} />
          <SubscriptionActions
            subscription={subscription}
            onChangePlan={() => openDialog('changePlan')}
            onCancel={() => openDialog('cancel')}
          />
        </div>

        {/* Right Column - Payment Methods & Billing Info */}
        <div className="space-y-6">
          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            isLoading={paymentMethodsLoading}
            onAdd={() => openDialog('addPayment')}
            onDelete={handleDeleteClick}
            onSetDefault={handleSetDefault}
            deletingMethodId={methodToDelete?.id}
            settingDefaultMethodId={methodIdToSetDefault ?? undefined}
            isDeleting={isDeleting}
            isSettingDefault={isSettingDefault}
          />
          <BillingInfo subscription={subscription} />
        </div>
      </div>

      {/* Dialogs */}
      {dialogs.changePlan && (
        <ChangePlanDialog
          open={dialogs.changePlan}
          onOpenChange={(open) => !open && closeDialog('changePlan')}
          currentPlanCode={subscription.planCode}
          initialPlanCode={recommendedPlan}
        />
      )}

      <CancelSubscriptionDialog
        open={dialogs.cancel}
        onOpenChange={(open) => !open && closeDialog('cancel')}
        planName={subscription.planName}
      />

      <AddPaymentMethodDialog
        open={dialogs.addPayment}
        onOpenChange={(open) => !open && closeDialog('addPayment')}
      />

      <DeletePaymentMethodDialog
        paymentMethod={methodToDelete}
        open={dialogs.deletePayment}
        onOpenChange={(open) => !open && closeDialog('deletePayment')}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        Subscription Management
      </h1>
      <p className="text-muted-foreground mt-2">
        Manage your subscription plan and payment methods
      </p>
    </div>
  );
}
