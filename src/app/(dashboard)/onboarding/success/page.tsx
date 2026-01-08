'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/shared/progress-bar';
import { PLAN_FEATURES } from '@/lib/constants/plans';
import type { PlanCode } from '@/lib/utils/plan-selection';

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<PlanCode | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Detect plan from query params
  useEffect(() => {
    const planFromQuery = searchParams.get('plan')?.toUpperCase() as PlanCode | null;

    if (planFromQuery && ['PRO', 'ELITE'].includes(planFromQuery)) {
      setSelectedPlan(planFromQuery);
      // Trigger confetti animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      // No valid plan, redirect to dashboard
      router.push('/dashboard');
    }
  }, [searchParams, router]);

  const planDetails = selectedPlan ? PLAN_FEATURES[selectedPlan] : null;

  if (!selectedPlan || !planDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Progress Bar */}
        <ProgressBar currentStep={3} totalSteps={3} className="mb-8" />

        {/* Success Card */}
        <Card className="relative overflow-hidden border-2 border-primary/20">
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute top-0 left-1/4 animate-bounce">
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="absolute top-10 right-1/4 animate-bounce delay-100">
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>
              <div className="absolute top-5 right-1/3 animate-bounce delay-200">
                <Sparkles className="h-4 w-4 text-pink-500" />
              </div>
            </div>
          )}

          <CardHeader className="text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <CardTitle className="text-3xl">¡Suscripción Activada!</CardTitle>
            <CardDescription className="text-lg">
              Bienvenido al plan {planDetails.name}. Tu cuenta ha sido actualizada exitosamente.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Plan Details */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Plan {planDetails.name}
                  </h3>
                  {planDetails.badge && (
                    <span className="mt-1 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                      {planDetails.badge}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {planDetails.priceDisplay}
                  </p>
                  <p className="text-sm text-gray-600">Comisión: {planDetails.commissionDisplay}</p>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900">
                  Ahora tienes acceso a:
                </h4>
                <div className="grid gap-2">
                  {planDetails.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 rounded-md bg-white p-3 text-sm"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 font-medium text-blue-900">Próximos pasos:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="font-medium">1.</span>
                  <span>Completa tu perfil en configuración</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">2.</span>
                  <span>Genera tu primer enlace de referido</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">3.</span>
                  <span>Comienza a ganar comisiones</span>
                </li>
              </ul>
            </div>

            {/* Billing Info */}
            <div className="text-center text-sm text-gray-600">
              <p>
                Se ha enviado un recibo de confirmación a tu email.
                El próximo cargo será el{' '}
                <span className="font-medium">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                size="lg"
                onClick={() => router.push('/dashboard')}
              >
                Ir al Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => router.push('/dashboard/referidos')}
              >
                Generar Enlace de Referido
              </Button>
            </div>

            {/* Support Link */}
            <p className="text-center text-xs text-gray-500">
              ¿Necesitas ayuda?{' '}
              <a href="/dashboard/configuracion" className="text-primary hover:underline">
                Contacta soporte
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Puedes gestionar tu suscripción en cualquier momento desde{' '}
            <button
              onClick={() => router.push('/dashboard/subscription')}
              className="font-medium text-primary hover:underline"
            >
              Configuración → Membresía
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper with Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
