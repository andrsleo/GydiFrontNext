'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReferPropertiesTab } from '@/features/properties/components';
import { useConnectAccountStatus } from '@/features/commissions/hooks/use-connect-account-status';
import { AffiliateConnectOnboardingModal } from '@/features/commissions/components/affiliate-connect-onboarding-modal';

export default function ReferPropertiesPage() {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const { data: connectStatus } = useConnectAccountStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Referir Propiedades</h1>
        <p className="text-muted-foreground">
          Refiere propiedades y gana comisiones
        </p>
      </div>

      {/* Banner: Stripe Connect requerido para cobrar comisiones de afiliado */}
      {connectStatus && !connectStatus.onboardingCompleted && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-medium">Conecta tu cuenta bancaria para recibir tus comisiones</p>
            <p className="mt-1 text-xs leading-relaxed">
              Para recibir tus comisiones de afiliado cuando tus referidos reserven,
              debes completar el proceso de Stripe Connect. Es rápido y seguro.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 border-amber-400 text-amber-800 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-200 dark:hover:bg-amber-900"
            onClick={() => setIsConnectModalOpen(true)}
          >
            Conectar cuenta
          </Button>
        </div>
      )}

      <AffiliateConnectOnboardingModal
        open={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />

      {/* Content */}
      <ReferPropertiesTab />
    </div>
  );
}
