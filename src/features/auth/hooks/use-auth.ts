/**
 * Authentication Hooks
 *
 * React Query hooks for user authentication operations.
 */

'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/users.api';
import type {
  LoginRequest,
  AuthResponse,
  RefreshTokenRequest,
  LogoutRequest,
} from '../types';

/**
 * Maps NextAuth error codes to user-friendly messages
 * NextAuth returns generic error codes like "CredentialsSignin"
 * We convert these to messages that users can understand
 */
function mapNextAuthError(error: string | null | undefined): string {
  if (!error) {
    return 'CredentialsSignin';
  }

  const errorLower = error.toLowerCase();

  // Specific NextAuth error codes
  if (errorLower === 'credentialssignin') {
    return 'CredentialsSignin';
  }

  if (errorLower === 'configuration') {
    return 'Configuration error';
  }

  if (errorLower === 'accessdenied') {
    return 'Access denied';
  }

  // Return original error (might be from backend)
  return error;
}

/**
 * Hook for user login
 *
 * Uses NextAuth signIn under the hood for session management.
 *
 * @param options - React Query mutation options
 * @returns Mutation object with login function
 *
 * @example
 * function LoginForm() {
 *   const { mutate: login, isPending } = useLogin({
 *     onSuccess: () => {
 *       router.push('/dashboard');
 *     },
 *     onError: (error) => {
 *       toast.error('Invalid credentials');
 *     },
 *   });
 *
 *   const handleSubmit = (data: LoginRequest) => {
 *     login(data);
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 */
export function useLogin(
  options?: Omit<UseMutationOptions<AuthResponse, Error, LoginRequest>, 'mutationFn'>
) {
  const router = useRouter();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (request: LoginRequest) => {
      // Use NextAuth signIn for session management
      const result = await signIn('credentials', {
        email: request.email,
        password: request.password,
        redirect: false,
      });

      // CRITICAL: NextAuth does NOT throw errors - it returns { ok: false, error: string }
      // We must check result.ok and throw manually for React Query to catch
      if (!result?.ok) {
        // Map NextAuth errors to user-friendly messages
        const errorMessage = mapNextAuthError(result?.error);
        throw new Error(errorMessage);
      }

      // Also call backend API to get full response with tokens
      return authApi.login(request);
    },
    onSuccess: (data, variables, context) => {
      // Call user's onSuccess if provided
      options?.onSuccess?.(data, variables, context);

      // Default behavior: redirect to dashboard
      if (!options?.onSuccess) {
        router.push('/dashboard');
      }
    },
    ...options,
  });
}

/**
 * Hook for user logout
 *
 * Uses NextAuth signOut under the hood for session cleanup.
 *
 * @param options - React Query mutation options
 * @returns Mutation object with logout function
 *
 * @example
 * function LogoutButton() {
 *   const { mutate: logout, isPending } = useLogout();
 *
 *   return (
 *     <button onClick={() => logout()} disabled={isPending}>
 *       Logout
 *     </button>
 *   );
 * }
 */
export function useLogout(
  options?: Omit<UseMutationOptions<void, Error, LogoutRequest | undefined>, 'mutationFn'>
) {
  const router = useRouter();

  return useMutation<void, Error, LogoutRequest | undefined>({
    mutationFn: async (request?: LogoutRequest) => {
      // Call backend to blacklist token
      await authApi.logout(request);

      // Use NextAuth signOut for session cleanup
      await signOut({ redirect: false });
    },
    onSuccess: (data, variables, context) => {
      // Call user's onSuccess if provided
      options?.onSuccess?.(data, variables, context);

      // Default behavior: redirect to login
      if (!options?.onSuccess) {
        router.push('/login');
      }
    },
    ...options,
  });
}

/**
 * Hook for refreshing access token
 *
 * @param options - React Query mutation options
 * @returns Mutation object with refresh function
 *
 * @example
 * function TokenRefresh() {
 *   const { mutate: refresh } = useRefreshToken({
 *     onSuccess: (data) => {
 *       // Update stored tokens
 *       console.log('New access token:', data.token);
 *     },
 *   });
 *
 *   return (
 *     <button onClick={() => refresh({ refreshToken: 'token' })}>
 *       Refresh Token
 *     </button>
 *   );
 * }
 */
export function useRefreshToken(
  options?: Omit<UseMutationOptions<AuthResponse, Error, RefreshTokenRequest>, 'mutationFn'>
) {
  return useMutation<AuthResponse, Error, RefreshTokenRequest>({
    mutationFn: authApi.refresh,
    ...options,
  });
}