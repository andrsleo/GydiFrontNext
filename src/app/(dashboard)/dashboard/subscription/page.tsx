/**
 * Medios de Pago Page
 *
 * Gestión de método de cobro (PayPal) para referidos y tarjetas de crédito para anfitriones.
 *
 * MEMBERSHIPS_DISABLED — La sección de membresías/suscripción está
 * deshabilitada temporalmente. Para re-habilitarla, busca el tag
 * MEMBERSHIPS_DISABLED en este archivo y descomenta los bloques marcados.
 */

'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { PayPalEmailSetup } from '@/features/commissions/components/paypal-email-setup';
import { PaymentMethodsSection } from '@/features/subscriptions/components/payment-methods-section';
import { AddPaymentMethodDialog } from '@/features/subscriptions/components/add-payment-method-dialog';
import {
  usePaymentMethods,
  useDeletePaymentMethod,
  useSetDefaultPaymentMethod,
} from '@/features/subscriptions/hooks/use-payment-methods';

/* MEMBERSHIPS_DISABLED — descomentar cuando se reactiven membresías
import { useSubscriptionPage } from '@/features/subscriptions/hooks/use-subscription-page';
import { SubscriptionStatus } from '@/features/subscriptions/components/subscription-status';
import { SubscriptionActions } from '@/features/subscriptions/components/subscription-actions';
import { BillingInfo } from '@/features/subscriptions/components/billing-info';
import { ChangePlanDialog } from '@/features/subscriptions/components/change-plan-dialog';
import { CancelSubscriptionDialog } from '@/features/subscriptions/components/cancel-subscription-dialog';
import { getRecommendedUpgradePlan } from '@/lib/utils/subscription';
*/

export default function SubscriptionPage() {
  const { t } = useTranslation('subscription');
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [deletingMethodId, setDeletingMethodId] = useState<number | undefined>();
  const [settingDefaultMethodId, setSettingDefaultMethodId] = useState<number | undefined>();
  const { data: paymentMethods, isLoading: isLoadingMethods } = usePaymentMethods();
  const { mutate: deleteMethod, isPending: isDeleting } = useDeletePaymentMethod();
  const { mutate: setDefault, isPending: isSettingDefault } = useSetDefaultPaymentMethod();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('paymentMethods.title')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Gestiona tu metodo de pago para comisiones y cobros de plataforma.
          </p>
        </div>
      </div>

      {/* ── Comisiones como referido (PayPal) ── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Recibir comisiones como referido</h2>
          <p className="text-sm text-muted-foreground">
            Configura tu PayPal para recibir automáticamente tu comisión cada vez que alguien reserve usando tu enlace de referido.
          </p>
        </div>
        <PayPalEmailSetup />
      </div>

      {/* MEMBERSHIPS_DISABLED — cuando se reactiven membresías, agregar aquí SubscriptionStatus, etc. */}

      {/* ── Método de cobro (anfitriones) ── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Metodo de cobro</h2>
          <p className="text-sm text-muted-foreground">
            Tarjeta que GYDI utiliza para cobrar la comisión de plataforma por cada reserva de alguna de tus propiedades publicadas.
          </p>
        </div>
        <PaymentMethodsSection
          paymentMethods={paymentMethods}
          isLoading={isLoadingMethods}
          onAdd={() => setIsAddCardOpen(true)}
          onDelete={(id) => {
            setDeletingMethodId(id);
            deleteMethod(id, { onSettled: () => setDeletingMethodId(undefined) });
          }}
          onSetDefault={(id) => {
            setSettingDefaultMethodId(id);
            setDefault(id, { onSettled: () => setSettingDefaultMethodId(undefined) });
          }}
          deletingMethodId={deletingMethodId}
          settingDefaultMethodId={settingDefaultMethodId}
          isDeleting={isDeleting}
          isSettingDefault={isSettingDefault}
        />
      </div>

      <AddPaymentMethodDialog
        open={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
        description="Agrega una tarjeta de credito o debito para que GYDI pueda cobrar la comision de plataforma por tus reservas."
      />
    </div>
  );
}
