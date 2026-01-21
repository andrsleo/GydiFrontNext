/**
 * Change Plan Dialog Component
 *
 * S.O.L.I.D Principles applied:
 * - Single Responsibility: Broken down into sub-components
 * - Interface Segregation: Props specifically typed
 */

'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight, CreditCard, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { changePlanSchema, type ChangePlanFormData, type PlanCode } from '../schemas/subscription.schema';
import { useChangePlan, useSubscribeToPlan, useSubscription } from '../hooks/use-subscription';
import { usePlans } from '../hooks/use-plans';
import { usePaymentMethods, useDefaultPaymentMethod } from '../hooks/use-payment-methods';
import type { PlanResponse, PaymentMethodResponse } from '../types';

// Constants
const POPUP_Z_INDEX = "z-[20000]";

interface ChangePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanCode: string;
  initialPlanCode?: PlanCode;
}

export function ChangePlanDialog({
  open,
  onOpenChange,
  currentPlanCode,
  initialPlanCode,
}: ChangePlanDialogProps) {
  const { data: plans, isLoading: isLoadingPlans } = usePlans();
  const { data: paymentMethods } = usePaymentMethods();
  const defaultPaymentMethod = useDefaultPaymentMethod();
  const { data: subscription } = useSubscription();

  const { mutate: changePlan, isPending: isChanging } = useChangePlan();
  const { mutate: subscribe, isPending: isSubscribing } = useSubscribeToPlan();

  const isPending = isChanging || isSubscribing;
  const hasActiveSubscription = subscription && subscription.status === 'ACTIVE';

  const form = useForm<ChangePlanFormData>({
    resolver: zodResolver(changePlanSchema),
    defaultValues: {
      newPlanCode: initialPlanCode,
      paymentMethodId: defaultPaymentMethod?.id || null,
    },
  });

  const selectedPlanCode = form.watch('newPlanCode');
  const selectedPlan = plans?.find((p) => p.planCode === selectedPlanCode);
  const currentPlan = plans?.find((p) => p.planCode === currentPlanCode);

  const isUpgrade = getIsUpgrade(selectedPlan, currentPlan);
  const requiresPayment = selectedPlan && selectedPlan.monthlyPrice > 0;

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = (data: ChangePlanFormData) => {
    const onSuccess = () => handleClose();

    if (hasActiveSubscription) {
      changePlan(data, { onSuccess });
    } else {
      subscribe({
        planCode: data.newPlanCode,
        paymentMethodId: data.paymentMethodId,
        autoRenew: true,
      }, { onSuccess });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl">
            {!hasActiveSubscription ? 'Subscribe to a Plan' : 'Change Subscription Plan'}
          </DialogTitle>
          <DialogDescription>
            {!hasActiveSubscription
              ? 'Choose the plan that best fits your needs.'
              : 'Modify your current subscription preferences.'}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 py-4 max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <CurrentPlanCard
                currentPlanCode={currentPlanCode}
                currentPlan={currentPlan}
              />

              <div className="space-y-4">
                <PlanSelectField
                  form={form}
                  plans={plans}
                  isLoading={isLoadingPlans}
                  currentPlanCode={currentPlanCode}
                  isPending={isPending}
                />

                <PlanComparison
                  currentPlan={currentPlan}
                  selectedPlan={selectedPlan}
                />
              </div>

              {requiresPayment && (
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Payment Details
                    </h4>
                    <PaymentMethodSelectField
                      form={form}
                      paymentMethods={paymentMethods}
                      isPending={isPending}
                    />
                  </div>

                  {!paymentMethods?.length && (
                    <Alert variant="destructive">
                      <AlertTitle>Payment Required</AlertTitle>
                      <AlertDescription>
                        Please add a payment method in your billing settings to proceed.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !selectedPlanCode || (requiresPayment && !paymentMethods?.length)}
                  className="min-w-[140px]"
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {getButtonText(hasActiveSubscription, isUpgrade)}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Sub-components & Helpers ---

function getIsUpgrade(selected?: PlanResponse, current?: PlanResponse) {
  if (!selected || !current) return false;
  return selected.monthlyPrice > current.monthlyPrice;
}

function getButtonText(hasActiveSubscription: boolean | undefined, isUpgrade: boolean) {
  if (!hasActiveSubscription) return 'Subscribe Now';
  return isUpgrade ? 'Confirm Upgrade' : 'Confirm Downgrade';
}

function CurrentPlanCard({ currentPlanCode, currentPlan }: { currentPlanCode: string, currentPlan?: PlanResponse }) {
  return (
    <div className="rounded-lg bg-slate-50 border p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Current Plan</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-bold text-slate-900">{currentPlanCode}</h3>
          {currentPlan && <span className="text-sm text-slate-600 font-medium">${currentPlan.monthlyPrice}/mo</span>}
        </div>
      </div>
      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
      </div>
    </div>
  );
}

interface PlanSelectFieldProps {
  form: UseFormReturn<ChangePlanFormData>;
  plans?: PlanResponse[];
  isLoading: boolean;
  currentPlanCode: string;
  isPending: boolean;
}

function PlanSelectField({ form, plans, isLoading, currentPlanCode, isPending }: PlanSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name="newPlanCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select New Plan</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isPending}
          >
            <FormControl>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={isLoading ? "Loading plans..." : "Choose a plan..."} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={POPUP_Z_INDEX}>
              {isLoading && <SelectItem value="loading" disabled>Loading plans...</SelectItem>}

              {!isLoading && (!plans || plans.length === 0) && (
                <SelectItem value="empty" disabled>No plans available</SelectItem>
              )}

              {plans?.map((plan) => (
                <SelectItem
                  key={plan.id}
                  value={plan.planCode}
                  disabled={plan.planCode === currentPlanCode}
                  className="py-3"
                >
                  <div className="flex flex-col text-left">
                    <span className="font-medium">{plan.planName}</span>
                    <span className="text-xs text-muted-foreground">
                      ${plan.monthlyPrice}/month • {Math.round(plan.commissionRate * 100)}% commission
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PlanComparison({ currentPlan, selectedPlan }: { currentPlan?: PlanResponse, selectedPlan?: PlanResponse }) {
  if (!selectedPlan || !currentPlan || selectedPlan.planCode === currentPlan.planCode) return null;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm mt-4 p-4 rounded-md border bg-slate-50/50">
      <ComparisonItem
        label="Monthly Price"
        from={currentPlan.monthlyPrice}
        to={selectedPlan.monthlyPrice}
        prefix="$"
      />
      <ComparisonItem
        label="Commission"
        from={Math.round(currentPlan.commissionRate * 100)}
        to={Math.round(selectedPlan.commissionRate * 100)}
        suffix="%"
      />
    </div>
  );
}

function ComparisonItem({ label, from, to, prefix = '', suffix = '' }: { label: string, from: number, to: number, prefix?: string, suffix?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs mb-1">{label}</span>
      <div className="flex items-center gap-2 font-medium">
        <span className="text-slate-500 line-through decoration-slate-400">{prefix}{from}{suffix}</span>
        <ArrowRight className="h-3 w-3 text-slate-400" />
        <span className={to > from ? "text-blue-600" : "text-green-600"}>
          {prefix}{to}{suffix}
        </span>
      </div>
    </div>
  );
}

interface PaymentMethodSelectFieldProps {
  form: UseFormReturn<ChangePlanFormData>;
  paymentMethods?: PaymentMethodResponse[];
  isPending: boolean;
}

function PaymentMethodSelectField({ form, paymentMethods, isPending }: PaymentMethodSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name="paymentMethodId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Card</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(value ? Number(value) : null)}
            value={field.value?.toString()}
            disabled={isPending || !paymentMethods?.length}
          >
            <FormControl>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={POPUP_Z_INDEX}>
              {paymentMethods?.map((method) => (
                <SelectItem key={method.id} value={method.id.toString()} className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-medium">{method.cardBrand}</span>
                    <span className="text-muted-foreground">•••• {method.cardLastFour}</span>
                    {method.isDefault && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Default</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
