/**
 * Forgot Password Form Component
 *
 * Form for requesting password reset email.
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForgotPassword } from '../hooks/use-forgot-password';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/forgot-password.schema';

export function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const { mutate, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data, {
      onSuccess: (response) => {
        setEmailSent(true);
        toast.success('Email enviado', {
          description: response.message || 'Revisa tu bandeja de entrada para restablecer tu contraseña',
        });
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || 'No se pudo enviar el email. Intenta nuevamente.';
        toast.error('Error', {
          description: errorMessage,
        });
      },
    });
  };

  if (emailSent) {
    return (
      <div className="space-y-6 rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
          <div className="space-y-2">
            <h3 className="font-semibold text-green-900">Email enviado exitosamente</h3>
            <p className="text-sm text-green-800">
              Hemos enviado un enlace de restablecimiento a <strong>{email}</strong>
            </p>
            <p className="text-sm text-green-700">
              El enlace expirará en 1 hora. Si no recibes el email, revisa tu carpeta de spam.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setEmailSent(false)}
        >
          Enviar a otro email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className="pl-9"
            {...register('email')}
            disabled={isPending}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
      </Button>

      <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
        <p>
          <strong>Nota:</strong> Recibirás un email con un enlace para restablecer tu contraseña.
          El enlace será válido por 1 hora.
        </p>
      </div>
    </form>
  );
}
