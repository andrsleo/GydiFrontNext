/**
 * Change Password Form Component
 *
 * Form for changing user password in security settings with:
 * - Real-time password validation
 * - Password strength indicator
 * - Show/hide password toggle
 * - Clear security messages
 * - Success/error handling
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, Shield, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useChangePassword } from '../hooks/use-change-password';
import { changePasswordSchema, type ChangePasswordFormData } from '../schemas/change-password.schema';
import { PasswordStrengthIndicator } from './password-strength-indicator';

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const { mutate, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword', '');

  const onSubmit = (data: ChangePasswordFormData) => {
    mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: (response) => {
          setPasswordChanged(true);
          reset();
          toast.success('Contraseña actualizada', {
            description: response.message || 'Tu contraseña ha sido cambiada exitosamente',
          });

          // Hide success message after 5 seconds
          setTimeout(() => {
            setPasswordChanged(false);
          }, 5000);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'No se pudo actualizar la contraseña. Verifica tu contraseña actual.';

          toast.error('Error al cambiar contraseña', {
            description: errorMessage,
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {passwordChanged && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Contraseña actualizada</AlertTitle>
          <AlertDescription className="text-green-800">
            Tu contraseña ha sido cambiada exitosamente. Asegúrate de recordarla para tu próximo
            inicio de sesión.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Consejos de seguridad</AlertTitle>
        <AlertDescription className="space-y-1 text-sm">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Usa una contraseña única que no hayas usado en otros sitios</li>
            <li>Combina letras mayúsculas, minúsculas, números y símbolos</li>
            <li>Evita información personal fácil de adivinar (nombre, fecha de nacimiento, etc.)</li>
            <li>Considera usar un gestor de contraseñas para mayor seguridad</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">
            Contraseña actual <span className="text-red-600">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña actual"
              className="pl-9 pr-10"
              {...register('currentPassword')}
              disabled={isPending}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Necesitas tu contraseña actual para cambiarla
          </p>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">
            Nueva contraseña <span className="text-red-600">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Crea una contraseña segura"
              className="pl-9 pr-10"
              {...register('newPassword')}
              disabled={isPending}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Password Strength Indicator */}
        {newPassword && <PasswordStrengthIndicator password={newPassword} />}

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirmar nueva contraseña <span className="text-red-600">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repite tu nueva contraseña"
              className="pl-9 pr-10"
              {...register('confirmPassword')}
              disabled={isPending}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Asegúrate de que ambas contraseñas coincidan
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <Button type="submit" disabled={isPending} className="gap-2">
            <Shield className="h-4 w-4" />
            {isPending ? 'Actualizando...' : 'Actualizar contraseña'}
          </Button>

          {!isPending && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => reset()}
              className="text-muted-foreground"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>

      {/* Additional Help */}
      <div className="rounded-md bg-blue-50 border border-blue-200 p-4 text-sm">
        <h4 className="font-medium text-blue-900 mb-2">Requisitos de contraseña</h4>
        <ul className="text-blue-800 space-y-1 text-xs">
          <li>• Mínimo 8 caracteres de longitud</li>
          <li>• Al menos una letra mayúscula (A-Z)</li>
          <li>• Al menos una letra minúscula (a-z)</li>
          <li>• Al menos un número (0-9)</li>
          <li>• Al menos un carácter especial (@$!%*?&)</li>
          <li>• No puede ser una contraseña común (ej: password123, qwerty)</li>
          <li>• Debe ser diferente a tu contraseña actual</li>
        </ul>
      </div>
    </div>
  );
}
