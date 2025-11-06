/**
 * Reset Password Page
 *
 * Public page for resetting password with token validation.
 */

'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { useValidateResetToken } from '@/features/auth/hooks/use-validate-reset-token';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { Button } from '@/components/ui/button';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { data: validation, isLoading, error } = useValidateResetToken(token);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Validando token...</p>
        </div>
      </div>
    );
  }

  // Invalid or missing token
  if (!token || error || !validation?.valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
              <div className="space-y-2">
                <h3 className="font-semibold text-red-900">Token inválido o expirado</h3>
                <p className="text-sm text-red-800">
                  {validation?.error ||
                    'El enlace de restablecimiento es inválido o ya expiró. Por favor, solicita un nuevo enlace.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/forgot-password">Solicitar nuevo enlace</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Volver al inicio de sesión</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Restablecer contraseña
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Para: <span className="font-medium">{validation.email}</span>
          </p>
          {validation.expiresAt && (
            <p className="mt-1 text-xs text-muted-foreground">
              Este enlace expirará pronto
            </p>
          )}
        </div>

        {/* Form */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}
