/**
 * Medios de Pago Page
 *
 * Gestión de cuenta bancaria vía Stripe Connect.
 * Las tarjetas de crédito ya no se gestionan desde la plataforma —
 * todo se maneja dentro del dashboard de Stripe Express.
 *
 * MEMBERSHIPS_DISABLED — La sección de membresías/suscripción está
 * deshabilitada temporalmente. Para re-habilitarla, busca el tag
 * MEMBERSHIPS_DISABLED en este archivo y descomenta los bloques marcados.
 */

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  Banknote,
  ReceiptText,
  Loader2,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useConnectAccountStatus } from '@/features/commissions/hooks/use-connect-account-status';
import { AffiliateConnectOnboardingModal } from '@/features/commissions/components/affiliate-connect-onboarding-modal';
import { commissionsApi } from '@/features/commissions/api/commissions.api';
import { useTranslation } from '@/hooks/use-translation';
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
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [deletingMethodId, setDeletingMethodId] = useState<number | undefined>();
  const [settingDefaultMethodId, setSettingDefaultMethodId] = useState<number | undefined>();
  const { data: connectStatus, isLoading: isLoadingStatus } = useConnectAccountStatus();
  const { data: paymentMethods, isLoading: isLoadingMethods } = usePaymentMethods();
  const { mutate: deleteMethod, isPending: isDeleting } = useDeletePaymentMethod();
  const { mutate: setDefault, isPending: isSettingDefault } = useSetDefaultPaymentMethod();

  const { mutate: openDashboard, isPending: isOpeningDashboard } = useMutation({
    mutationFn: () => commissionsApi.getDashboardLink(),
    onSuccess: (data) => {
      window.open(data.url, '_blank', 'noopener,noreferrer');
    },
    onError: () => {
      toast.error('No se pudo abrir el dashboard de Stripe. Intenta de nuevo.');
    },
  });

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
            Gestiona tu cuenta bancaria y pagos a través de Stripe Connect
          </p>
        </div>
      </div>

      {/* ── Estado de Stripe Connect ── */}
      {isLoadingStatus ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Verificando estado de tu cuenta...
        </div>
      ) : !connectStatus?.onboardingCompleted ? (
        /* No onboarded — banner de acción */
        <Alert className="border-orange-200 bg-orange-50">
          <CreditCard className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Activa tu cuenta para recibir comisiones de afiliado</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span className="text-orange-700">
              Si quieres referir propiedades y cobrar tus comisiones cuando tus referidos reserven, debes completar el proceso de Stripe Connect. Es rápido y seguro.
            </span>
            <Button
              size="sm"
              onClick={() => setIsConnectModalOpen(true)}
              className="shrink-0"
            >
              Conectar cuenta
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        /* Onboarding completo — tarjeta de gestión */
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base text-green-800">
                  Cuenta bancaria conectada
                </CardTitle>
              </div>
              <Badge variant="success" className="text-xs">
                Activa
              </Badge>
            </div>
            <CardDescription>
              Tu cuenta de Stripe Connect está verificada y lista para recibir y enviar pagos.
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-4 space-y-4">
            {/* Qué puedes hacer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1.5 rounded-lg bg-muted/50 p-3 text-center">
                <Banknote className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium">Recibir comisiones</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-lg bg-muted/50 p-3 text-center">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium">Gestionar cuenta bancaria</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-lg bg-muted/50 p-3 text-center">
                <ReceiptText className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium">Ver historial de pagos</span>
              </div>
            </div>

            {/* Botón principal al dashboard de Stripe */}
            <Button
              className="w-full gap-2"
              onClick={() => openDashboard()}
              disabled={isOpeningDashboard}
            >
              {isOpeningDashboard ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Abriendo dashboard...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Ir al Dashboard de Stripe
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Acceso seguro y de un solo uso. El enlace expira en 5 minutos.
            </p>
          </CardContent>
        </Card>
      )}

      {/* MEMBERSHIPS_DISABLED — cuando se reactiven membresías, agregar aquí SubscriptionStatus, etc. */}

      {/* ── Método de cobro (anfitriones) ── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Método de cobro</h2>
          <p className="text-sm text-muted-foreground">
            Tarjeta que GYDI utiliza para cobrar la comisión de plataforma por cada reserva.
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
        description="Agrega una tarjeta de crédito o débito para que GYDI pueda cobrar la comisión de plataforma por tus reservas."
      />

      <AffiliateConnectOnboardingModal
        open={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}
