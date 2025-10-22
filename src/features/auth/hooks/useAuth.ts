'use client';

import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email o contraseña incorrectos');
        return { success: false, error: 'Email o contraseña incorrectos' };
      }

      router.push('/dashboard');
      router.refresh();

      return { success: true };
    } catch (err) {
      const message = 'Error al iniciar sesión';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Llamar al endpoint de registro del backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }

      // Después de registrar, hacer login automático
      await login({ email: data.email, password: data.password });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
}
