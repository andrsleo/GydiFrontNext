/**
 * Authentication Hooks
 *
 * React Query hooks for user authentication operations.
 * Backend-only authentication (no NextAuth).
 */

'use client';

import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, type LoginRequest } from '../api/auth.api';
import { useAuthStore, type AuthUser } from '@/store/auth-store';

/**
 * Hook for user login
 *
 * Calls backend API directly (no NextAuth).
 * Updates Zustand auth store on success.
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
  options?: Omit<UseMutationOptions<AuthUser, Error, LoginRequest>, 'mutationFn'>
) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<AuthUser, Error, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (user, variables, context) => {
      // Update Zustand store
      setUser(user);

      // Check if user provided custom onSuccess handler
      const hasCustomSuccess = options?.onSuccess !== undefined && options.onSuccess !== null;

      if (hasCustomSuccess && options?.onSuccess) {
        // Call user's custom onSuccess handler
        // @ts-expect-error - TanStack Query v5 type signature issue with context parameter
        options.onSuccess(user, variables, context);
      } else {
        // Default behavior: redirect to dashboard
        router.push('/dashboard');
      }
    },
    ...options,
  });
}

/**
 * Hook for user logout
 *
 * Calls backend API directly (no NextAuth).
 * Clears Zustand auth store on success.
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
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useMutation<void, Error, void>({
    mutationFn: authApi.logout,
    onSuccess: (data, variables, context) => {
      // Clear Zustand store
      logout();

      // Check if user provided custom onSuccess handler
      const hasCustomSuccess = options?.onSuccess !== undefined && options.onSuccess !== null;

      if (hasCustomSuccess && options?.onSuccess) {
        // Call user's custom onSuccess handler
        // @ts-expect-error - TanStack Query v5 type signature issue with context parameter
        options.onSuccess(data, variables, context);
      } else {
        // Default behavior: redirect to login
        router.push('/login');
      }
    },
    ...options,
  });
}

/**
 * Hook for getting current user
 *
 * Fetches current user from backend /verify endpoint.
 * Automatically updates Zustand store.
 *
 * @param options - React Query options
 * @returns Query object with user data
 *
 * @example
 * function UserProfile() {
 *   const { data: user, isLoading } = useCurrentUser();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!user) return <div>Not authenticated</div>;
 *
 *   return <div>Hello {user.name}</div>;
 * }
 */
export function useCurrentUser(
  options?: Omit<UseQueryOptions<AuthUser | null, Error>, 'queryKey' | 'queryFn'>
) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useQuery<AuthUser | null, Error>({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      setLoading(true);
      const user = await authApi.getCurrentUser();
      setUser(user);
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry on 401
    ...options,
  });
}

/**
 * Hook to check if user is authenticated
 *
 * Simple selector for auth state.
 * Doesn't make API calls - just reads from Zustand store.
 *
 * @example
 * function ProtectedPage() {
 *   const isAuthenticated = useIsAuthenticated();
 *
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" />;
 *   }
 *
 *   return <div>Protected content</div>;
 * }
 */
export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}

/**
 * Hook to get user from store (no API call)
 *
 * Returns user from Zustand store without making API calls.
 * Use useCurrentUser() if you need to fetch fresh data.
 *
 * @example
 * function UserMenu() {
 *   const user = useUser();
 *
 *   return <div>{user?.name}</div>;
 * }
 */
export function useUser() {
  return useAuthStore((state) => state.user);
}