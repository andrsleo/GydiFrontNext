/**
 * Upgrade Modal Component
 *
 * Simplified modal for upgrading from landing page.
 * Pre-selects the target plan and shows comparison with current plan.
 */

'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Sparkles, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PLAN_FEATURES } from '@/lib/constants/plans';
import type { PlanCode } from '@/lib/utils/plan-selection';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanCode: string;
  targetPlanCode: PlanCode;
}

export function UpgradeModal({
  open,
  onOpenChange,
  currentPlanCode,
  targetPlanCode,
}: UpgradeModalProps) {
  const router = useRouter();

  const currentPlan = PLAN_FEATURES[currentPlanCode as PlanCode];
  const targetPlan = PLAN_FEATURES[targetPlanCode];

  if (!currentPlan || !targetPlan) {
    return null;
  }

  const handleUpgrade = () => {
    // Close modal
    onOpenChange(false);

    // Redirect to payment wizard with target plan
    router.push(`/onboarding/payment?plan=${targetPlanCode}`);
  };

  const commissionIncrease = (targetPlan.affiliate.commission - currentPlan.affiliate.commission) * 100;
  const priceDifference = targetPlan.price - currentPlan.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </button>

        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            ¡Actualiza a {targetPlan.name}!
          </DialogTitle>
          <DialogDescription className="text-center">
            Desbloquea más funciones y aumenta tus comisiones
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Plan Comparison */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Current Plan */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 text-sm font-medium text-gray-600">Tu plan actual</div>
              <div className="text-2xl font-bold text-gray-900">{currentPlan.name}</div>
              <div className="mt-1 text-sm text-gray-600">
                {currentPlan.priceDisplay} • Comisión: {currentPlan.affiliate.commissionDisplay}
              </div>
            </div>

            {/* Target Plan */}
            <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-primary">Plan nuevo</span>
                {targetPlan.badge && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                    {targetPlan.badge}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900">{targetPlan.name}</div>
              <div className="mt-1 text-sm text-gray-600">
                {targetPlan.priceDisplay} • Comisión: {targetPlan.affiliate.commissionDisplay}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h3 className="mb-3 font-semibold text-gray-900">
              Lo que ganarás con {targetPlan.name}:
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>
                  <span className="font-semibold">+{commissionIncrease.toFixed(0)}%</span> más de
                  comisión por referido
                </span>
              </div>
              {targetPlan.affiliate.benefits.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Info */}
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-blue-900">Costo adicional</p>
                <p className="text-sm text-blue-700">
                  Solo ${priceDifference.toFixed(2)} más al mes
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">
                  {targetPlan.priceDisplay}
                </p>
                <p className="text-xs text-blue-700">facturado mensualmente</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Quizás más tarde
            </Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={handleUpgrade}
            >
              Actualizar a {targetPlan.name}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500">
            Puedes cancelar o cambiar de plan en cualquier momento desde configuración
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
