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
import { CheckCircle2, ExternalLink, Info, Mail } from 'lucide-react';
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
              PayPal configurado correctamente
            </CardTitle>
          </div>
          <CardDescription>
            Cada vez que alguien reserve a través de tu enlace de referido, recibirás tu comisión directamente aquí.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {payoutStatus?.paypalEmail}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Cambiar email de PayPal
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Email entry form ────────────────────────────────────────────────────

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Configura dónde recibir tus comisiones</CardTitle>
        <CardDescription>
          Cada vez que refieras una propiedad y alguien la reserve usando tu enlace, GYDI te pagará tu comisión en PayPal.
          Es gratis, rápida de crear y funciona en cualquier parte del mundo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50 text-blue-800">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            ¿Aún no tienes PayPal?{' '}
            <a
              href="https://www.paypal.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-blue-900"
            >
              Crea tu cuenta gratis aquí
              <ExternalLink className="h-3 w-3" />
            </a>
            {' '}— solo necesitas tu email y toma menos de 5 minutos.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paypalEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de tu cuenta PayPal</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar y activar cobros'}
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
            Una vez configurado, cada reserva generada por tu enlace de referido te pagará una comisión automáticamente en tu PayPal los días 1 y 15 de cada mes.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
