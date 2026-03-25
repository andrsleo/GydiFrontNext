/**
 * PayPal Email Setup
 *
 * Form component for affiliates to configure their PayPal email for payouts.
 * Shows current email if already configured, or a form to enter a new one.
 *
 * ATOMIC DESIGN: Organism
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Info, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePayoutStatus } from '../hooks/use-payout-status';
import { useSavePayPalEmail } from '../hooks/use-save-paypal-email';

// ── Schema ──────────────────────────────────────────────────────────────────

const paypalEmailSchema = z.object({
  paypalEmail: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email de PayPal valido'),
});

type PayPalEmailFormData = z.infer<typeof paypalEmailSchema>;

// ── Component ────────────────────────────────────────────────────────────────

/**
 * PayPal Email Setup card
 *
 * Renders either the "configured" state (with a change-email toggle) or the
 * email-entry form depending on whether the affiliate already has a PayPal
 * email saved.
 *
 * @example
 * ```tsx
 * <PayPalEmailSetup />
 * ```
 */
export function PayPalEmailSetup() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: payoutStatus, isLoading } = usePayoutStatus();
  const { mutate: saveEmail, isPending } = useSavePayPalEmail();

  const isConfigured = payoutStatus?.paypalEmailConfigured && !isEditing;

  const form = useForm<PayPalEmailFormData>({
    resolver: zodResolver(paypalEmailSchema),
    defaultValues: {
      paypalEmail: '',
    },
  });

  function handleSubmit(data: PayPalEmailFormData) {
    saveEmail(
      { paypalEmail: data.paypalEmail },
      {
        onSuccess: () => {
          toast.success('Email de PayPal guardado correctamente');
          setIsEditing(false);
          form.reset();
        },
        onError: () => {
          toast.error('Error al guardar el email de PayPal. Por favor intenta de nuevo.');
        },
      }
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Verificando metodo de pago...</p>
        </CardContent>
      </Card>
    );
  }

  // ── Already configured ──────────────────────────────────────────────────

  if (isConfigured) {
    return (
      <Card className="border-green-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle className="text-base text-green-800">
              Metodo de pago configurado
            </CardTitle>
          </div>
          <CardDescription>
            Tus comisiones seran enviadas a tu cuenta de PayPal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              PayPal: {payoutStatus?.paypalEmail}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Cambiar email
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Email entry form ────────────────────────────────────────────────────

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Configura tu metodo de pago</CardTitle>
        <CardDescription>
          Para recibir tus comisiones necesitas una cuenta PayPal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paypalEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de PayPal</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tu@paypal.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar email de PayPal'}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Recibiras tus comisiones directamente en tu PayPal en las fechas de pago
            programadas (dias 1 y 15 de cada mes).
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
