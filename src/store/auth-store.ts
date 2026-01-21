/**
 * Authentication Store (Zustand)
 *
 * Manages user authentication state without NextAuth.
 * Replaces NextAuth session management with pure Zustand store.
 *
 * This store:
 * - Stores user data in memory and localStorage (persist middleware)
 * - Provides actions to set/clear user
 * - Does NOT store tokens (backend manages cookies in production)
 * - In development, tokens are stored in localStorage by the API client
 */

'use client';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { UserRole, SubscriptionPlan, UserCapabilities } from '@/types/user';

/**
 * User data stored in auth state
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  activePlan: SubscriptionPlan;
  capabilities: UserCapabilities;
  accountVerified: boolean;
}

/**
 * Auth store state
 */
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
}

/**
 * Auth store actions
 */
interface AuthActions {
  setUser: (user: AuthUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

/**
 * Complete auth store type
 */
type AuthStore = AuthState & AuthActions;

/**
 * Auth store with persistence
 *
 * SECURITY NOTE:
 * - We persist user data (non-sensitive)
 * - We NEVER persist tokens (backend manages cookies)
 * - In development, tokens are in localStorage but managed by API client, not this store
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // State
        user: null,
        isAuthenticated: false,
        isLoading: true, // Start as loading (will check session on mount)
        _hasHydrated: false,

        // Actions
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          }),

        setLoading: (isLoading) => set({ isLoading }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }),

        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),
      }),
      {
        name: 'auth-storage', // localStorage key
        partialize: (state) => ({
          // Only persist user data, not loading state
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          // Mark as hydrated when done
          if (state) {
            state._hasHydrated = true;
          }
        },
      }
    ),
    {
      name: 'AuthStore', // DevTools name
    }
  )
);

// Hook to check if store has hydrated from localStorage
export const useHasHydrated = () => useAuthStore((state) => state._hasHydrated);

/**
 * Selectors for better performance (avoid re-renders)
 */
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectUserRole = (state: AuthStore) => state.user?.role;
export const selectUserPlan = (state: AuthStore) => state.user?.activePlan;
export const selectUserCapabilities = (state: AuthStore) => state.user?.capabilities;
