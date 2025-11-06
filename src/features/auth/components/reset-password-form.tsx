/**
 * Reset Password Form Component
 *
 * Form for resetting password with token validation and strength indicator.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPassword } from '../hooks/use-reset-password';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/reset-password.schema';
import { PasswordStrengthIndicator } from './password-strength-indicator';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const { mutate, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('newPassword', '');

  const onSubmit = (data: ResetPasswordFormData) => {
    mutate(
      {
        token,
        newPassword: data.newPassword,
      },
      {
        onSuccess: (response) => {
          setPasswordReset(true);
          toast.success('Contraseña restablecida', {
            description: response.message || 'Tu contraseña ha sido actualizada exitosamente',
          });

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            'No se pudo restablecer la contraseña. El token puede estar expirado.';
          toast.error('Error', {
            description: errorMessage,
          });
        },
      }
    );
  };

  if (passwordReset) {
    return (
      <div className="space-y-6 rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
          <div className="space-y-2">
            <h3 className="font-semibold text-green-900">Contraseña restablecida</h3>
            <p className="text-sm text-green-800">
              Tu contraseña ha sido actualizada exitosamente. Serás redirigido al inicio de sesión en
              3 segundos...
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/login')}
        >
          Ir al inicio de sesión
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nueva contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="newPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-9 pr-10"
            {...register('newPassword')}
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-600">{errors.newPassword.message}</p>
        )}
      </div>

      {/* Password Strength Indicator */}
      <PasswordStrengthIndicator password={password} />

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-9 pr-10"
            {...register('confirmPassword')}
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? 'Restableciendo...' : 'Restablecer contraseña'}
      </Button>

      <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
        <p>
          <strong>Consejo de seguridad:</strong> Usa una contraseña única que no hayas usado en
          otros sitios.
        </p>
      </div>
    </form>
  );
}
