/**
 * CSRF Token Hook
 *
 * React hook to fetch and initialize CSRF token on component mount.
 * This hook should be used in the root layout or App component to ensure
 * the CSRF token is available before any API requests are made.
 */

'use client';

import { useEffect, useState } from 'react';
import { fetchCsrfToken, getCsrfToken } from '@/lib/utils/csrf';

interface UseCsrfTokenReturn {
  token: string | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage CSRF token.
 *
 * <p>
 * This hook automatically fetches a CSRF token from the backend if one doesn't
 * already exist in the cookie. It should be used in the root layout or a top-level
 * component to ensure CSRF protection is available throughout the application.
 * </p>
 *
 * <p>
 * <strong>When the token is fetched:</strong>
 * </p>
 * <ul>
 *   <li>On component mount (if token doesn't exist in cookie)</li>
 *   <li>When refetch() is called manually</li>
 * </ul>
 *
 * <p>
 * <strong>When to use:</strong>
 * </p>
 * <ul>
 *   <li>In the root layout (app/layout.tsx) to initialize token on app load</li>
 *   <li>After session refresh/logout to get a new token</li>
 *   <li>When you receive a 403 CSRF error and need to retry with a new token</li>
 * </ul>
 *
 * @param options Configuration options
 * @param options.fetchOnMount Whether to fetch token on mount (default: true)
 * @param options.onSuccess Callback when token is successfully fetched
 * @param options.onError Callback when token fetch fails
 *
 * @returns Object containing token state and refetch function
 *
 * @example
 * ```typescript
 * // In app/layout.tsx or similar root component
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   const { token, isLoading, error } = useCsrfToken();
 *
 *   if (error) {
 *     console.error('Failed to initialize CSRF protection:', error);
 *   }
 *
 *   return (
 *     <html>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Manual refetch after session refresh
 * function LoginForm() {
 *   const { refetch } = useCsrfToken({ fetchOnMount: false });
 *
 *   const handleLogin = async () => {
 *     // ... login logic
 *     await refetch(); // Get new CSRF token after login
 *   };
 * }
 * ```
 */
export function useCsrfToken(options?: {
  fetchOnMount?: boolean;
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
}): UseCsrfTokenReturn {
  const { fetchOnMount = true, onSuccess, onError } = options || {};

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchToken = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if token already exists in cookie
      const existingToken = getCsrfToken();

      if (existingToken) {
        setToken(existingToken);
        onSuccess?.(existingToken);
        return;
      }

      // No token found - fetch a new one
      const csrfData = await fetchCsrfToken();
      setToken(csrfData.token);
      onSuccess?.(csrfData.token);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch CSRF token');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchToken();
    }
  }, [fetchOnMount]);

  return {
    token,
    isLoading,
    error,
    refetch: fetchToken,
  };
}

/**
 * Hook to ensure CSRF token is available before rendering children.
 *
 * <p>
 * This hook is similar to useCsrfToken but provides a loading state
 * that can be used to prevent rendering until the token is fetched.
 * </p>
 *
 * @returns Object with ready state
 *
 * @example
 * ```typescript
 * function ProtectedForm() {
 *   const { isReady } = useCsrfProtection();
 *
 *   if (!isReady) {
 *     return <Spinner />;
 *   }
 *
 *   return <form>...</form>;
 * }
 * ```
 */
export function useCsrfProtection(): {
  isReady: boolean;
  token: string | null;
  error: Error | null;
} {
  const { token, isLoading, error } = useCsrfToken();

  return {
    isReady: !isLoading && !error,
    token,
    error,
  };
}
