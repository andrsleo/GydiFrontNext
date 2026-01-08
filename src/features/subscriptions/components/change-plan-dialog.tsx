/**
 * Change Plan Dialog Component
 *
 * Dialog for changing subscription plan (upgrade or downgrade).
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { changePlanSchema, type ChangePlanFormData } from '../schemas/subscription.schema';
import { useChangePlan } from '../hooks/use-subscription';
import { usePlans } from '../hooks/use-plans';
import { usePaymentMethods, useDefaultPaymentMethod } from '../hooks/use-payment-methods';

interface ChangePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanCode: string;
}

export function ChangePlanDialog({
  open,
  onOpenChange,
  currentPlanCode,
}: ChangePlanDialogProps) {
  const { data: plans } = usePlans();
  const { data: paymentMethods } = usePaymentMethods();
  const defaultPaymentMethod = useDefaultPaymentMethod();
  const { mutate: changePlan, isPending } = useChangePlan();

  const form = useForm<ChangePlanFormData>({
    resolver: zodResolver(changePlanSchema),
    defaultValues: {
      newPlanCode: undefined,
      paymentMethodId: defaultPaymentMethod?.id || null,
    },
  });

  const selectedPlanCode = form.watch('newPlanCode');
  const selectedPlan = plans?.find((p) => p.planCode === selectedPlanCode);
  const currentPlan = plans?.find((p) => p.planCode === currentPlanCode);

  const isUpgrade =
    selectedPlan && currentPlan
      ? selectedPlan.monthlyPrice > currentPlan.monthlyPrice
      : false;

  const requiresPayment = selectedPlan && selectedPlan.monthlyPrice > 0;

  const onSubmit = (data: ChangePlanFormData) => {
    changePlan(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Subscription Plan</DialogTitle>
          <DialogDescription>
            {isUpgrade
              ? 'Upgrade your plan to unlock more features. Changes are applied immediately.'
              : 'Downgrade your plan. Changes will take effect at the end of your current billing period.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Plan */}
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Current Plan</p>
              <p className="text-2xl font-bold mt-1">{currentPlanCode}</p>
              {currentPlan && (
                <p className="text-sm text-muted-foreground mt-1">
                  ${currentPlan.monthlyPrice}/month •{' '}
                  {(currentPlan.commissionRate * 100).toFixed(0)}% commission
                </p>
              )}
            </div>

            {/* New Plan Selection */}
            <FormField
              control={form.control}
              name="newPlanCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Plan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plans
                        ?.filter((p) => p.planCode !== currentPlanCode)
                        .map((plan) => (
                          <SelectItem key={plan.id} value={plan.planCode}>
                            {plan.planName} - ${plan.monthlyPrice}/month
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plan Comparison */}
            {selectedPlan && currentPlan && (
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Price Change</span>
                  <div className="flex items-center gap-2">
                    <span>${currentPlan.monthlyPrice}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold">${selectedPlan.monthlyPrice}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Commission Rate</span>
                  <div className="flex items-center gap-2">
                    <span>{(currentPlan.commissionRate * 100).toFixed(0)}%</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold">
                      {(selectedPlan.commissionRate * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Selection (for paid plans) */}
            {requiresPayment && (
              <FormField
                control={form.control}
                name="paymentMethodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value ? Number(value) : null)
                      }
                      defaultValue={field.value?.toString()}
                      disabled={isPending || !paymentMethods?.length}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethods?.map((method) => (
                          <SelectItem key={method.id} value={method.id.toString()}>
                            {method.cardBrand} •••• {method.cardLastFour}
                            {method.isDefault && ' (Default)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* No Payment Method Warning */}
            {requiresPayment && !paymentMethods?.length && (
              <Alert>
                <AlertDescription>
                  You need to add a payment method before upgrading to a paid plan.
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !selectedPlanCode ||
                  (requiresPayment && !paymentMethods?.length)
                }
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUpgrade ? 'Upgrade Plan' : 'Downgrade Plan'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
