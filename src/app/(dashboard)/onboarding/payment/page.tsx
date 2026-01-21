'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Loader2, CreditCard, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressBar } from '@/components/shared/progress-bar';
import { StripeCardElementWrapper } from '@/features/subscriptions/components/stripe-card-element';
import { useSubscribeToPlan } from '@/features/subscriptions/hooks/use-subscription';
import { paymentMethodsApi } from '@/features/subscriptions/api/payment-methods.api';
import { PLAN_FEATURES } from '@/lib/constants/plans';
import type { PlanCode } from '@/lib/utils/plan-selection';
import { useCurrentUser } from '@/features/auth/hooks/use-auth';
import { toast } from 'sonner';

function PaymentWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stripe = useStripe();
  const elements = useElements();

  const [selectedPlan, setSelectedPlan] = useState<PlanCode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const { mutate: subscribeToPlan } = useSubscribeToPlan();
  const { data: currentUser } = useCurrentUser();

  // Detect plan from query params
  useEffect(() => {
    const planFromQuery = searchParams.get('plan')?.toUpperCase() as PlanCode | null;

    if (planFromQuery && ['PRO', 'ELITE'].includes(planFromQuery)) {
      setSelectedPlan(planFromQuery);
    } else {
      // No valid plan, redirect to pricing
      toast.error('Plan no válido', {
        description: 'Por favor selecciona un plan desde la página de precios.',
      });
      router.push('/#precios');
    }
  }, [searchParams, router]);

  const planDetails = selectedPlan ? PLAN_FEATURES[selectedPlan] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !selectedPlan || !planDetails) {
      return;
    }

    if (!cardComplete) {
      toast.error('Información de tarjeta incompleta', {
        description: 'Por favor completa todos los campos de la tarjeta.',
      });
      return;
    }

    if (!currentUser?.email) {
      toast.error('Error de autenticación', {
        description: 'No se pudo obtener tu información de usuario.',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // ========================================
      // STEP 1: Create Stripe PaymentMethod
      // ========================================
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      toast.loading('Validando información de pago...', { id: 'payment-flow' });

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: currentUser.email,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // ========================================
      // STEP 2: Save PaymentMethod to Backend
      // ========================================
      toast.loading('Guardando método de pago...', { id: 'payment-flow' });

      const savedPaymentMethod = await paymentMethodsApi.create({
        stripePaymentMethodId: paymentMethod.id,
        billingEmail: currentUser.email,
        isDefault: true,
      });

      // ========================================
      // STEP 3: Subscribe to Plan
      // ========================================
      toast.loading('Activando suscripción...', { id: 'payment-flow' });

      subscribeToPlan(
        {
          planCode: selectedPlan,
          paymentMethodId: savedPaymentMethod.id, // ✅ Use ID from backend
          autoRenew: true,
        },
        {
          onSuccess: () => {
            toast.dismiss('payment-flow');
            toast.success('¡Suscripción activada!', {
              description: 'Redirigiendo a confirmación...',
            });

            // Redirect to success page
            const successUrl = `/onboarding/success?plan=${selectedPlan}`;
            router.push(successUrl as any);
          },
          onError: (error: any) => {
            toast.dismiss('payment-flow');
            throw error; // Re-throw to be caught by outer catch
          },
        }
      );
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.dismiss('payment-flow');

      // User-friendly error messages
      let errorMessage = 'Error al procesar el pago';
      let errorDescription = 'Por favor intenta nuevamente.';

      if (error.message?.includes('card')) {
        errorMessage = 'Tarjeta rechazada';
        errorDescription = 'Por favor verifica los datos de tu tarjeta.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Error de conexión';
        errorDescription = 'Verifica tu conexión a internet e intenta nuevamente.';
      } else if (error.response?.data?.message) {
        errorDescription = error.response.data.message;
      }

      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan || !planDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Progress Bar */}
        <ProgressBar currentStep={2} totalSteps={3} className="mb-8" />

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Información de Pago
                </CardTitle>
                <CardDescription>
                  Completa tus datos de pago para activar tu suscripción
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Email Display */}
                  {currentUser?.email && (
                    <div className="rounded-lg bg-blue-50 p-3">
                      <p className="text-sm text-blue-900">
                        <span className="font-medium">Email de facturación:</span>{' '}
                        {currentUser.email}
                      </p>
                      <p className="mt-1 text-xs text-blue-700">
                        Los recibos serán enviados a este correo
                      </p>
                    </div>
                  )}

                  {/* Stripe Card Element */}
                  <StripeCardElementWrapper
                    onChange={(event) => setCardComplete(event.complete)}
                  />

                  {/* Security Notice */}
                  <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                    <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <p>
                      Tus datos de pago están protegidos con encriptación de nivel bancario.
                      No almacenamos información de tarjetas.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing || !stripe || !cardComplete}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Procesando pago...
                      </>
                    ) : (
                      <>
                        Confirmar y Activar Suscripción
                        <CheckCircle2 className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Al continuar, aceptas nuestros{' '}
                    <a href="/terms" className="underline hover:text-primary">
                      Términos y Condiciones
                    </a>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Plan Badge */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Plan {planDetails.name}
                      </h3>
                      {planDetails.badge && (
                        <span className="mt-1 inline-block rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                          {planDetails.badge}
                        </span>
                      )}
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Incluye:
                  </h4>
                  <ul className="space-y-2">
                    {planDetails.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t" />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{planDetails.priceDisplay}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-medium">Incluidos</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total hoy</span>
                      <span className="text-xl font-bold text-primary">
                        {planDetails.priceDisplay}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                  <p>
                    Después del primer mes, se cobrará automáticamente{' '}
                    <span className="font-medium">{planDetails.priceDisplay}</span> cada mes.
                    Puedes cancelar en cualquier momento.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper with Suspense boundary
export default function PaymentWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentWizardContent />
    </Suspense>
  );
}
