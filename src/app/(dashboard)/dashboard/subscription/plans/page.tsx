/**
 * Subscription Plans Page
 *
 * Page for browsing and comparing subscription plans.
 */

'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PlanCard } from '@/features/subscriptions/components/plan-card';
import { AddPaymentMethodDialog } from '@/features/subscriptions/components/add-payment-method-dialog';
import { ChangePlanDialog } from '@/features/subscriptions/components/change-plan-dialog';
import { type PlanCode } from '@/features/subscriptions/schemas/subscription.schema';
import { usePlans } from '@/features/subscriptions/hooks/use-plans';
import { useSubscription, useSubscribeToPlan, useChangePlan } from '@/features/subscriptions/hooks/use-subscription';
import { usePaymentMethods } from '@/features/subscriptions/hooks/use-payment-methods';
import { toast } from 'sonner';

export default function SubscriptionPlansPage() {
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);
  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: subscription } = useSubscription();
  const { data: paymentMethods } = usePaymentMethods();

  const handleSelectPlan = (planCode: string) => {
    // If the user already has this plan, do nothing
    if (subscription?.planCode === planCode) return;

    setSelectedPlanCode(planCode);

    const plan = plans?.find((p) => p.planCode === planCode);

    // If plan is paid and user has no payment methods, prompt to add one
    if (plan && plan.monthlyPrice > 0 && (!paymentMethods || paymentMethods.length === 0)) {
      toast.info('Add a payment method', {
        description: 'You need to add a payment method before upgrading to a paid plan.',
      });
      setShowAddPaymentDialog(true);
      return;
    }

    setShowChangePlanDialog(true);
  };

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No plans available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your affiliate business. Upgrade or downgrade
          at any time.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlanCode={subscription?.planCode}
            onSelect={handleSelectPlan}
            isLoading={false} // Loading state is now handled in the dialog
            recommended={index === 1} // Middle plan (PRO) is recommended
          />
        ))}
      </div>

      {/* Features Comparison */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Compare Features
        </h2>

        <div className="rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center p-4 font-semibold">
                    {plan.planName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-4">Commission Rate</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {(plan.commissionRate * 100).toFixed(0)}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4">Max Properties</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {plan.maxProperties}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4">Referrals per Month</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {plan.maxReferralsPerMonth === -1
                      ? 'Unlimited'
                      : plan.maxReferralsPerMonth}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4">Support Level</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {plan.supportLevel}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
      <AddPaymentMethodDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
      />

      {selectedPlanCode && (
        <ChangePlanDialog
          open={showChangePlanDialog}
          onOpenChange={setShowChangePlanDialog}
          currentPlanCode={subscription?.planCode || 'FREE'}
          initialPlanCode={selectedPlanCode as PlanCode}
        />
      )}
    </div>
  );
}
