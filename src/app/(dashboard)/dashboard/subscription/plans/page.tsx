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
import { usePlans } from '@/features/subscriptions/hooks/use-plans';
import { useSubscription, useSubscribeToPlan, useChangePlan } from '@/features/subscriptions/hooks/use-subscription';
import { usePaymentMethods } from '@/features/subscriptions/hooks/use-payment-methods';
import { toast } from 'sonner';

export default function SubscriptionPlansPage() {
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: subscription } = useSubscription();
  const { data: paymentMethods } = usePaymentMethods();
  const { mutate: subscribe, isPending: isSubscribing } = useSubscribeToPlan();
  const { mutate: changePlan, isPending: isChangingPlan } = useChangePlan();

  const handleSelectPlan = (planCode: string) => {
    setSelectedPlanCode(planCode);

    const plan = plans?.find((p) => p.planCode === planCode);

    if (!plan) return;

    // Check if user has an active subscription
    const hasActiveSubscription = subscription && subscription.status === 'ACTIVE';

    // Check if plan requires payment
    if (plan.monthlyPrice > 0) {
      // Check if user has payment methods
      if (!paymentMethods || paymentMethods.length === 0) {
        toast.info('Add a payment method', {
          description: 'You need to add a payment method before upgrading to a paid plan.',
        });
        setShowAddPaymentDialog(true);
        return;
      }

      // Find default payment method
      const defaultPaymentMethod = paymentMethods.find((pm) => pm.isDefault);

      if (!defaultPaymentMethod) {
        toast.error('No default payment method', {
          description: 'Please set a default payment method first.',
        });
        return;
      }

      if (hasActiveSubscription) {
        // Change Plan
        changePlan({
          newPlanCode: planCode,
          paymentMethodId: defaultPaymentMethod.id,
        });
      } else {
        // New Subscription
        subscribe({
          planCode,
          paymentMethodId: defaultPaymentMethod.id,
          autoRenew: true,
        });
      }
    } else {
      // Free plan
      if (hasActiveSubscription) {
        // Change Plan (Downgrade)
        changePlan({
          newPlanCode: planCode,
          paymentMethodId: null,
        });
      } else {
        // New Subscription
        subscribe({
          planCode,
          paymentMethodId: null,
          autoRenew: true,
        });
      }
    }
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
        <h1 className="text-4xl font-bold tracking-tight mb-4">
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
            isLoading={(isSubscribing || isChangingPlan) && selectedPlanCode === plan.planCode}
            recommended={index === 1} // Middle plan (PRO) is recommended
          />
        ))}
      </div>

      {/* Features Comparison (Optional) */}
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

      {/* Add Payment Method Dialog */}
      <AddPaymentMethodDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
      />
    </div>
  );
}
