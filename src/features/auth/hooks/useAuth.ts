/**
 * Legacy useAuth Hook
 *
 * Wrapper around new React Query hooks to maintain compatibility
 * with existing components while using the new API client.
 *
 * BACKEND-ONLY AUTHENTICATION (NO NextAuth):
 * - Uses backend-managed authentication with cookies (production) or localStorage (dev)
 * - All authentication logic handled by backend
 *
 * @deprecated Use useLogin, useLogout, useCreateUser directly for new components
 */

'use client';

import { useState } from 'react';
import { useLogin, useLogout } from './use-auth';
import { useCreateUser } from './use-users';
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  // Use new React Query hooks (backend-only authentication)
  const loginMutation = useLogin({
    onError: (err) => {
      setError(err.message || 'Error al iniciar sesión');
    },
  });

  const logoutMutation = useLogout();

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
      // CRITICAL: Extract the actual error message
      // React Query wraps errors, so we need to extract properly
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message); // Also set local error state
      return { success: false, error: message };
    }
  };

  const register = async (data: RegisterFormData, selectedPlanCode?: string) => {
    try {
      setError(null);

      // Create user with USER role by default (no role selection)
      // Send firstName and lastName separately to backend
      // Include selectedPlanCode if provided (for subscription flow)
      await createUserMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        roleNames: ['USER'], // All users start as USER
        selectedPlanCode: selectedPlanCode || undefined, // Plan selected during registration (e.g., "PRO", "ELITE")
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
    // Use backend-only logout (clears cookies in production, localStorage in dev)
    await logoutMutation.mutateAsync();
  };

  return {
    login,
    register,
    logout,
    isLoading: loginMutation.isPending || createUserMutation.isPending || logoutMutation.isPending,
    error,
  };
}
