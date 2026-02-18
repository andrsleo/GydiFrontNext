/**
 * Cancel Subscription Dialog Component
 *
 * Dialog for canceling a subscription with reason.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertTriangle } from 'lucide-react';
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
  FormDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  cancelSubscriptionSchema,
  type CancelSubscriptionFormData,
  CANCELLATION_REASONS,
} from '../schemas/subscription.schema';
import { useCancelSubscription } from '../hooks/use-subscription';

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  planName,
}: CancelSubscriptionDialogProps) {
  const { mutate: cancelSubscription, isPending } = useCancelSubscription();

  const form = useForm<CancelSubscriptionFormData>({
    resolver: zodResolver(cancelSubscriptionSchema),
    defaultValues: {
      reason: '',
      cancelImmediately: false,
    },
  });

  const cancelImmediately = form.watch('cancelImmediately');
  const reason = form.watch('reason');

  // Enable button when reason has at least 10 characters
  const isFormValid = reason.trim().length >= 10;

  const onSubmit = (data: CancelSubscriptionFormData) => {
    cancelSubscription(data, {
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
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            We&apos;re sorry to see you go. Please let us know why you&apos;re canceling.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Warning */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Are you sure?</AlertTitle>
              <AlertDescription>
                You&apos;re about to cancel your <strong>{planName}</strong> subscription.
                {!cancelImmediately &&
                  ' You can continue using your plan until the end of your billing period.'}
              </AlertDescription>
            </Alert>

            {/* Cancellation Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why are you canceling?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us why you're leaving..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Your feedback helps us improve our service (minimum 10 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Common Reasons (optional helper) */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Common reasons:</p>
              <div className="flex flex-wrap gap-2">
                {CANCELLATION_REASONS.map((reason) => (
                  <Button
                    key={reason}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => form.setValue('reason', reason)}
                    disabled={isPending}
                  >
                    {reason}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cancel Immediately Option */}
            <FormField
              control={form.control}
              name="cancelImmediately"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Cancel immediately</FormLabel>
                    <FormDescription>
                      If unchecked, your subscription will remain active until the end of
                      your current billing period.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Immediate Cancellation Warning */}
            {cancelImmediately && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your subscription will be canceled immediately and you will lose access
                  to all premium features.
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
                Keep Subscription
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending || !isFormValid}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cancel Subscription
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
