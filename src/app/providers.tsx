'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { fetchCsrfToken } from '@/lib/api/client';
import { CurrencyInitializer } from '@/components/shared/currency-initializer';

/**
 * Providers Component
 *
 * Sets up React Query for server state management and initializes CSRF protection.
 *
 * CSRF Protection:
 * - Backend requires CSRF tokens for cross-domain requests (Vercel → Railway)
 * - On mount, fetches CSRF token from backend and stores in XSRF-TOKEN cookie
 * - API client automatically includes CSRF token in POST/PUT/PATCH/DELETE requests
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  // ✅ Fetch CSRF token on app load
  useEffect(() => {
    fetchCsrfToken().catch((error) => {
      console.error('[Providers] Failed to initialize CSRF token:', error);
      // Don't block app load - CSRF token will be fetched on first POST request
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyInitializer />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
