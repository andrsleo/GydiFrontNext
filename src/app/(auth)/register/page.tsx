'use client';

import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/features/auth/schemas/auth.schema';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PasswordStrengthIndicator } from '@/features/auth/components/password-strength-indicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressBar } from '@/components/shared/progress-bar';
import type { PlanCode } from '@/lib/utils/plan-selection';
import { PLAN_FEATURES } from '@/lib/constants/plans';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, isLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanCode | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Detect selected plan from query param only
  useEffect(() => {
    const planFromQuery = searchParams.get('plan')?.toUpperCase() as PlanCode | null;

    if (planFromQuery && ['FREE', 'PRO', 'ELITE'].includes(planFromQuery)) {
      setSelectedPlan(planFromQuery);
    }
  }, [searchParams]);

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);

    // Pass selectedPlan to backend so it knows whether to create FREE subscription or not
    const result = await registerUser(data, selectedPlan || undefined);

    if (!result.success) {
      setErrorMessage(result.error || 'Error al registrar usuario');
      return;
    }

    // Registration successful!
    // Redirect based on selected plan
    if (selectedPlan && selectedPlan !== 'FREE') {
      // For paid plans, redirect to payment wizard
      const paymentUrl = `/onboarding/payment?plan=${selectedPlan}`;
      router.push(paymentUrl as any); // Type assertion needed for dynamic route
    }
    // For FREE plan or no plan, useAuth hook handles redirect to dashboard
  };

  const planDetails = selectedPlan ? PLAN_FEATURES[selectedPlan] : null;
  const isPaidPlan = selectedPlan && selectedPlan !== 'FREE';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Progress Bar */}
        {selectedPlan && (
          <ProgressBar currentStep={1} totalSteps={isPaidPlan ? 3 : 1} />
        )}

        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Crea tu cuenta en GYDI
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/90">
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* Plan Badge - Only for paid plans */}
        {isPaidPlan && planDetails && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Plan {planDetails.name}
                  </h3>
                  {planDetails.badge && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                      {planDetails.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {planDetails.priceDisplay} • Comisión Afiliado: {planDetails.affiliate.commissionDisplay}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {planDetails.affiliate.benefits.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="rounded-md bg-white px-2 py-1 text-xs text-gray-700"
                >
                  ✓ {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Juan"
                  {...register('firstName')}
                  className="mt-1"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Pérez"
                  {...register('lastName')}
                  className="mt-1"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                {...register('email')}
                className="mt-1"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('password')}
                className="mt-1"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="mt-2">
              <PasswordStrengthIndicator password={watch('password') || ''} />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className="mt-1"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">
                Teléfono <span className="text-gray-400">(opcional)</span>
              </Label>
              <div className="mt-1">
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      placeholder="Ingresa tu número de teléfono"
                      value={value}
                      onChange={onChange}
                      defaultCountry="CO"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  )}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="acceptTerms"
              type="checkbox"
              {...register('acceptTerms')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
              Acepto los{' '}
              <Link href="/terms" className="font-medium text-primary hover:text-primary/90">
                Términos y Condiciones
              </Link>
            </label>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : isPaidPlan ? (
              <>
                Continuar al Pago
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Crear Cuenta'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

// Wrapper component with Suspense boundary
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
