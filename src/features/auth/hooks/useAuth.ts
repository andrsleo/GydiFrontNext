/**
 * Legacy useAuth Hook
 *
 * Wrapper around new React Query hooks to maintain compatibility
 * with existing components while using the new API client.
 *
 * @deprecated Use useLogin, useLogout, useCreateUser directly for new components
 */

'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useLogin } from './use-auth';
import { useCreateUser } from './use-users';
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  // Use new React Query hooks
  const loginMutation = useLogin({
    onError: (err) => {
      setError(err.message || 'Error al iniciar sesión');
    },
  });

  const createUserMutation = useCreateUser({
    onError: (err) => {
      setError(err.message || 'Error al registrar usuario');
    },
  });

  const login = async (data: LoginFormData) => {
    try {
      setError(null);

      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      return { success: false, error: message };
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setError(null);

      // Create user with USER role by default (no role selection)
      // Names are now stored in user_profile (source of truth)
      await createUserMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName || null,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        roleNames: ['USER'], // All users start as USER
      });

      // After registration, auto-login
      await login({ email: data.email, password: data.password });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar usuario';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return {
    login,
    register,
    logout,
    isLoading: loginMutation.isPending || createUserMutation.isPending,
    error,
  };
}
