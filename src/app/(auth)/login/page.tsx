'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth.schema';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Convierte errores técnicos en mensajes amigables para el usuario
 */
function getFriendlyErrorMessage(error: string | null): string {
  if (!error) {
    return 'Email o contraseña incorrectos. Por favor, verifica tus credenciales e intenta nuevamente.';
  }

  const errorLower = error.toLowerCase();

  // Rate limiting - demasiados intentos
  if (
    errorLower.includes('too many') ||
    errorLower.includes('rate limit') ||
    errorLower.includes('many requests') ||
    errorLower.includes('429')
  ) {
    return 'Has realizado demasiados intentos de inicio de sesión. Por favor, espera unos minutos antes de intentar nuevamente.';
  }

  // Errores de credenciales
  if (
    errorLower.includes('credential') ||
    errorLower.includes('invalid') ||
    errorLower.includes('incorrect') ||
    errorLower.includes('wrong') ||
    errorLower.includes('unauthorized') ||
    errorLower.includes('401')
  ) {
    return 'El email o la contraseña que ingresaste no coinciden. Por favor, verifica e intenta nuevamente.';
  }

  // Usuario no encontrado
  if (errorLower.includes('not found') || errorLower.includes('404')) {
    return 'No encontramos una cuenta con ese email. ¿Ya te registraste?';
  }

  // Usuario bloqueado o suspendido
  if (errorLower.includes('blocked') || errorLower.includes('suspended') || errorLower.includes('disabled')) {
    return 'Tu cuenta ha sido temporalmente deshabilitada. Contacta al soporte para más información.';
  }

  // Problemas de red
  if (
    errorLower.includes('network') ||
    errorLower.includes('timeout') ||
    errorLower.includes('connection') ||
    errorLower.includes('fetch')
  ) {
    return 'No pudimos conectarnos al servidor. Verifica tu conexión a internet e intenta nuevamente.';
  }

  // Error del servidor
  if (errorLower.includes('500') || errorLower.includes('server')) {
    return 'Estamos experimentando problemas técnicos. Por favor, intenta nuevamente en unos minutos.';
  }

  // Error genérico
  return 'Ocurrió un error al iniciar sesión. Por favor, verifica tus datos e intenta nuevamente.';
}

export default function LoginPage() {
  const { login, isLoading } = useAuth();
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
      // Convertir error técnico a mensaje amigable
      const friendlyMessage = getFriendlyErrorMessage(result.error || null);

      // Check if error contains rate limit info
      const isRateLimited = friendlyMessage.toLowerCase().includes('demasiados intentos') ||
                           friendlyMessage.toLowerCase().includes('too many');

      // Show error toast
      toast.error('No pudimos iniciar sesión', {
        description: friendlyMessage,
        duration: isRateLimited ? 8000 : 5000, // Longer duration for rate limit errors
      });
      setErrorMessage(friendlyMessage);

      // Note: Backend rate limit headers (X-RateLimit-Remaining) are not accessible from frontend
      // due to CORS. For now, we show the error message. In the future, we could add an endpoint
      // to query remaining attempts.
    } else {
      // Show success toast
      toast.success('¡Bienvenido de nuevo!', {
        description: 'Iniciaste sesión correctamente. Redirigiendo...',
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Inicia Sesión en GYDI Properties
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/90">
              Regístrate gratis
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

          <div className="flex items-center justify-between">
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
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/90">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500">Credenciales de prueba</span>
              </div>
            </div>

            <div className="mt-4 rounded-md bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> admin@demo.com
                <br />
                <strong>Contraseña:</strong> 123456
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
