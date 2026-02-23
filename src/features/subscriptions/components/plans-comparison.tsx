/**
 * PlansComparison Component
 *
 * Side-by-side comparison of all subscription plans
 * with role-specific commission rates and benefits.
 */

'use client';

import { PlanCardDetailed } from './plan-card-detailed';
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/constants/plans';

interface PlansComparisonProps {
  currentPlan?: SubscriptionPlan;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

export function PlansComparison({
  currentPlan,
  onSelectPlan,
  isLoading = false,
}: PlansComparisonProps) {
  // PRO_ELITE_DISABLED: Descomentar PRO y ELITE para reactivar planes pagos
  const plans: SubscriptionPlan[] = [
    SUBSCRIPTION_PLANS.FREE,
    // SUBSCRIPTION_PLANS.PRO,
    // SUBSCRIPTION_PLANS.ELITE,
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Elige tu plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Selecciona el plan que mejor se adapte a tus necesidades. Puedes ser{' '}
          <span className="font-semibold text-blue-600">afiliado</span>,{' '}
          <span className="font-semibold text-green-600">anfitrión</span>, o{' '}
          <span className="font-semibold">ambos</span>.
        </p>
      </div>

      {/* Plans Grid */}
      {/* PRO_ELITE_DISABLED: Cambiar a md:grid-cols-3 max-w-7xl cuando se reactiven PRO y ELITE */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8 max-w-md mx-auto">
        {plans.map((plan) => (
          <PlanCardDetailed
            key={plan}
            plan={plan}
            currentPlan={currentPlan}
            onSelect={onSelectPlan}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Todos los planes incluyen{' '}
          <span className="font-semibold">referidos ilimitados</span> y{' '}
          <span className="font-semibold">sin exclusividad</span>.
          <br />
          Cancela cuando quieras sin penalizaciones.
        </p>
      </div>
    </div>
  );
}
