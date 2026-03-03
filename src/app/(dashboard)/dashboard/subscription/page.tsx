/**
 * Medios de Pago Page
 *
 * Gestión de tarjetas de crédito y débito del usuario.
 *
 * MEMBERSHIPS_DISABLED — La sección de membresías/suscripción está
 * deshabilitada temporalmente. Para re-habilitarla, busca el tag
 * MEMBERSHIPS_DISABLED en este archivo y descomenta los bloques marcados.
 * Componentes a re-habilitar:
 *   - SubscriptionStatus
 *   - SubscriptionActions
 *   - BillingInfo
 *   - ChangePlanDialog
 *   - CancelSubscriptionDialog
 *   - getRecommendedUpgradePlan
 *   - Layout grid de 2 columnas
 */

'use client';

import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { PaymentMethodsSection } from '@/features/subscriptions/components/payment-methods-section';
import { AddPaymentMethodDialog } from '@/features/subscriptions/components/add-payment-method-dialog';
import { DeletePaymentMethodDialog } from '@/features/subscriptions/components/delete-payment-method-dialog';
import { useSubscriptionPage } from '@/features/subscriptions/hooks/use-subscription-page';
import { useTranslation } from '@/hooks/use-translation';
import { CreditCard } from 'lucide-react';

/* MEMBERSHIPS_DISABLED — descomentar cuando se reactiven membresías
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubscriptionStatus } from '@/features/subscriptions/components/subscription-status';
import { SubscriptionActions } from '@/features/subscriptions/components/subscription-actions';
import { BillingInfo } from '@/features/subscriptions/components/billing-info';
import { ChangePlanDialog } from '@/features/subscriptions/components/change-plan-dialog';
import { CancelSubscriptionDialog } from '@/features/subscriptions/components/cancel-subscription-dialog';
import { getRecommendedUpgradePlan } from '@/lib/utils/subscription';
*/

export default function SubscriptionPage() {
  const { t } = useTranslation('subscription');
  const {
    dialogs,
    methodToDelete,
    methodIdToSetDefault,
    /* MEMBERSHIPS_DISABLED — descomentar cuando se reactiven membresías
    subscription,
    subscriptionLoading,
    subscriptionError,
    plans,
    */
    paymentMethods,
    paymentMethodsLoading,
    isDeleting,
    isSettingDefault,
    openDialog,
    closeDialog,
    handleDeleteClick,
    handleConfirmDelete,
    handleSetDefault,
  } = useSubscriptionPage();

  if (paymentMethodsLoading) {
    return <LoadingSpinner size="lg" variant="centered" />;
  }

  /* MEMBERSHIPS_DISABLED — bloque de error de suscripción
  if (subscriptionError || !subscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            No tienes una suscripción activa.{' '}
            <Link href="/dashboard/subscription/plans" className="font-medium underline">
              Elige un plan
            </Link>{' '}
            para empezar.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const recommendedPlan = plans
    ? getRecommendedUpgradePlan(plans, subscription.planCode)
    : undefined;
  */

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
      {/* Header */}
      <PageHeader t={t} />

      {/* MEMBERSHIPS_DISABLED — cuando se reactiven, volver a grid de 2 columnas:
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <SubscriptionStatus subscription={subscription} />
          <SubscriptionActions
            subscription={subscription}
            onChangePlan={() => openDialog('changePlan')}
            onCancel={() => openDialog('cancel')}
          />
        </div>
        <div className="space-y-6">
          <PaymentMethodsSection ... />
        </div>
      </div>
      */}

      {/* Tarjetas — columna única */}
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

      {/* Dialogs de tarjetas */}
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

      {/* MEMBERSHIPS_DISABLED — diálogos de membresía
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
      */}
    </div>
  );
}

function PageHeader({ t }: { t: (key: string) => string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <CreditCard className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t('paymentMethods.title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {t('paymentMethods.subtitle')}
        </p>
      </div>
    </div>
  );
}
