/**
 * Affiliate Connect Onboarding Modal
 *
 * Modal dialog for initiating Stripe Connect onboarding process.
 * Explains the process and redirects users to Stripe onboarding form.
 *
 * ATOMIC DESIGN: Organism
 */

'use client';

import { Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInitiateAffiliateOnboarding } from '../hooks/use-initiate-affiliate-onboarding';
import { useConnectAccountStatus } from '../hooks/use-connect-account-status';

export interface AffiliateConnectOnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal for Stripe Connect onboarding
 *
 * Guides affiliates through connecting their bank account to receive payouts.
 *
 * @example
 * ```typescript
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <AffiliateConnectOnboardingModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export function AffiliateConnectOnboardingModal({
  open,
  onClose,
}: AffiliateConnectOnboardingModalProps) {
  // Hooks
  const { mutate: initiateOnboarding, isPending } = useInitiateAffiliateOnboarding();
  const { data: accountStatus } = useConnectAccountStatus();

  // Handlers
  const handleConnectAccount = () => {
    initiateOnboarding(undefined, {
      onSuccess: (data) => {
        // Redirect to Stripe onboarding URL
        window.location.href = data.url;
      },
      onError: (error) => {
        console.error('Onboarding error:', error);
        toast.error('Error al iniciar onboarding. Por favor intenta de nuevo.');
      },
    });
  };

  // Check if already onboarded
  const isAlreadyOnboarded = accountStatus?.onboardingCompleted;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Conecta tu cuenta bancaria</DialogTitle>
          <DialogDescription>
            Para recibir pagos de comisiones, necesitas conectar tu cuenta bancaria
            a través de Stripe Connect.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Already onboarded message */}
          {isAlreadyOnboarded ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Ya completaste el proceso de onboarding. Tu cuenta está conectada
                y lista para recibir pagos.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Process explanation */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  El proceso toma aproximadamente <strong>5 minutos</strong> y requiere:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Información personal (nombre, dirección, fecha de nacimiento)</li>
                  <li>Número de seguro social o Tax ID</li>
                  <li>Información bancaria (routing number, account number)</li>
                </ul>
              </div>

              {/* Required information alert */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Información requerida:</strong> SSN/Tax ID, routing number,
                  account number
                </AlertDescription>
              </Alert>

              {/* Payout schedule info */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">
                  Calendario de pagos
                </p>
                <p className="text-sm text-muted-foreground">
                  Los pagos se procesan automáticamente los días <strong>1 y 15</strong> de
                  cada mes. Mínimo acumulado: <strong>$50 USD</strong>.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          {!isAlreadyOnboarded && (
            <Button
              type="button"
              onClick={handleConnectAccount}
              disabled={isPending}
            >
              {isPending ? 'Conectando...' : 'Conectar cuenta bancaria'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
