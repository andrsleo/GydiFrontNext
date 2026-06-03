'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth.schema';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';

/**
 * Returns a translation key for the given technical error string
 */
function getFriendlyErrorKey(error: string | null): string {
  if (!error) return 'login.errors.default';

  const errorLower = error.toLowerCase();

  // Sesión expirada — distinto a credenciales incorrectas
  if (
    errorLower === 'sessionexpired' ||
    errorLower.includes('session expired') ||
    errorLower.includes('authenticationrequired')
  ) {
    return 'login.errors.sessionExpired';
  }

  // Rate limiting - demasiados intentos
  if (
    errorLower.includes('too many') ||
    errorLower.includes('rate limit') ||
    errorLower.includes('many requests') ||
    errorLower.includes('429')
  ) {
    return 'login.errors.rateLimit';
  }

  // Errores de credenciales
  if (
    errorLower.includes('credential') ||
    errorLower === 'credentialssignin' ||
    errorLower.includes('invalid') ||
    errorLower.includes('incorrect') ||
    errorLower.includes('wrong') ||
    errorLower.includes('unauthorized') ||
    errorLower.includes('401') ||
    errorLower.includes('autenticación') ||
    errorLower.includes('custom_error')
  ) {
    return 'login.errors.credentials';
  }

  // Usuario no encontrado
  if (errorLower.includes('not found') || errorLower.includes('404')) {
    return 'login.errors.notFound';
  }

  // Usuario bloqueado o suspendido
  if (errorLower.includes('blocked') || errorLower.includes('suspended') || errorLower.includes('disabled')) {
    return 'login.errors.blocked';
  }

  // Problemas de red
  if (
    errorLower.includes('network') ||
    errorLower.includes('timeout') ||
    errorLower.includes('connection') ||
    errorLower.includes('fetch')
  ) {
    return 'login.errors.network';
  }

  // Error del servidor
  if (errorLower.includes('500') || errorLower.includes('server')) {
    return 'login.errors.server';
  }

  // Error genérico
  return 'login.errors.generic';
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  const { t } = useTranslation('auth');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Handle error from URL query parameter
  useEffect(() => {
    const urlError = searchParams?.get('error');
    if (urlError) {
      const errorKey = getFriendlyErrorKey(urlError);
      const friendlyMessage = t(errorKey);
      const isRateLimited = errorKey === 'login.errors.rateLimit';
      const isSessionExpired = errorKey === 'login.errors.sessionExpired';

      toast.error(t('login.errorTitle'), {
        description: friendlyMessage,
        duration: isRateLimited ? 10000 : 8000,
        closeButton: true,
      });

      // Session-expired: toast only — user hasn't attempted login yet, no inline form error
      if (!isSessionExpired) {
        setErrorMessage(friendlyMessage);
      }

      // Clear the error from URL without page reload
      router.replace('/login', { scroll: false });
    }
  }, [searchParams, router, t]);

  // Show toast for validation errors
  useEffect(() => {
    if (errors.email) {
      toast.error('Error de validación', {
        description: errors.email.message,
        duration: 4000,
      });
    }
    if (errors.password) {
      toast.error('Error de validación', {
        description: errors.password.message,
        duration: 4000,
      });
    }
  }, [errors]);

  // Load saved email on mount (NOT password - security)
  useEffect(() => {
    // SECURITY: Limpiar contraseñas guardadas previamente (si existen)
    localStorage.removeItem('rememberedPassword');

    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedRememberMe && savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    setRemainingAttempts(null);

    // SECURITY: Solo guardar email (NO password - XSS vulnerability)
    // La sesión persistente se maneja con refresh tokens (más seguro)
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', data.email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberMe');
    }

    const result = await login(data);

    if (!result.success) {
      const errorKey = getFriendlyErrorKey(result.error || null);
      const friendlyMessage = t(errorKey);
      const isRateLimited = errorKey === 'login.errors.rateLimit';

      // Show error toast
      toast.error(t('login.errorTitle'), {
        description: friendlyMessage,
        duration: isRateLimited ? 10000 : 8000, // Longer duration for better UX
        closeButton: true, // Allow user to close it manually
      });
      setErrorMessage(friendlyMessage);

      // Note: Backend rate limit headers (X-RateLimit-Remaining) are not accessible from frontend
      // due to CORS. For now, we show the error message. In the future, we could add an endpoint
      // to query remaining attempts.
    } else {
      // Show success toast
      toast.success(t('login.successTitle'), {
        description: t('login.successDesc'),
        duration: 3000,
      });

      // ✅ FIX: Redirect to dashboard after successful login
      // Get callbackUrl from query params or default to /dashboard
      const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
      router.push(callbackUrl as any);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {t('login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('login.noAccount')}{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/90">
              {t('login.registerLink')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="email">{t('login.emailLabel')}</Label>
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
              <Label htmlFor="password">{t('login.passwordLabel')}</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                {t('login.rememberMe')}
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/90">
                {t('login.forgotPassword')}
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? t('login.submitting') : t('login.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
