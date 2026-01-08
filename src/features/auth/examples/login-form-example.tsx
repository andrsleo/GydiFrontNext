/**
 * Login Form Example
 *
 * Complete example of a login form using the dual-mode authentication system.
 * This component demonstrates:
 * - React Hook Form with Zod validation
 * - TanStack Query mutation (useLogin)
 * - Zustand auth store integration
 * - Error handling
 * - Loading states
 *
 * Works in both development and production:
 * - Development: Backend returns tokens in response body, stored in localStorage
 * - Production: Backend sets httpOnly cookies, no localStorage needed
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLogin } from '../hooks/use-auth';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/**
 * Login Form Component
 *
 * Handles user authentication using the dual-mode system.
 * Automatically redirects to dashboard on success.
 *
 * @example
 * // In app/(auth)/login/page.tsx
 * import { LoginFormExample } from '@/features/auth/examples/login-form-example';
 *
 * export default function LoginPage() {
 *   return (
 *     <div className="container mx-auto max-w-md py-10">
 *       <h1 className="mb-6 text-3xl font-bold">Iniciar Sesión</h1>
 *       <LoginFormExample />
 *     </div>
 *   );
 * }
 */
export function LoginFormExample() {
  const router = useRouter();

  // Initialize form with React Hook Form + Zod validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Login mutation with TanStack Query
  const { mutate: login, isPending } = useLogin({
    onSuccess: (user) => {
      // Show success toast
      toast.success(`Bienvenido, ${user.name}!`);

      // Redirect to dashboard
      router.push('/dashboard');

      // Note: Zustand store is automatically updated by useLogin hook
      // Note: Tokens are automatically stored (localStorage in dev, cookies in prod)
    },
    onError: (error: any) => {
      // Handle different error types
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Credenciales inválidas';

      toast.error(errorMessage);

      // Clear password field on error
      form.resetField('password');
    },
  });

  // Form submit handler
  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>

        {/* Additional Links */}
        <div className="space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <a
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Regístrate
            </a>
          </p>
          <p className="text-muted-foreground">
            <a
              href="/forgot-password"
              className="font-medium text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </p>
        </div>
      </form>
    </Form>
  );
}

/**
 * Alternative: Minimal Login Form
 *
 * Simpler version without Form components (for reference).
 */
export function MinimalLoginForm() {
  const router = useRouter();

  const { mutate: login, isPending } = useLogin({
    onSuccess: () => {
      toast.success('Login exitoso!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al iniciar sesión');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-md border border-input px-3 py-2"
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full rounded-md border border-input px-3 py-2"
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
