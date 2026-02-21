/**
 * Session Timeout Provider
 *
 * Wraps dashboard content and manages session timeout logic:
 * - Detects user inactivity (1 hour)
 * - Shows warning modal (after 59 minutes)
 * - Auto-refreshes JWT token when user continues
 * - Auto-logs out after timeout
 *
 * This component integrates:
 * - useInactivityDetector (custom hook)
 * - SessionTimeoutWarning (modal component)
 * - authApi.refresh() (token refresh)
 * - useLogout() (logout hook)
 *
 * Configuration:
 * - Inactivity timeout: 1 hour (3600000ms) - synchronized with backend JWT expiration
 * - Warning timeout: 59 minutes (3540000ms) - gives user 1 minute to respond
 * - Countdown: 60 seconds
 *
 * @example
 * ```tsx
 * // In dashboard layout
 * export default function DashboardLayout({ children }) {
 *   return (
 *     <SessionTimeoutProvider>
 *       {children}
 *     </SessionTimeoutProvider>
 *   );
 * }
 * ```
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useInactivityDetector } from '../hooks/use-inactivity-detector';
import { SessionTimeoutWarning } from './session-timeout-warning';
import { authApi } from '../api/auth.api';
import { useLogout } from '../hooks/use-auth';
import { toast } from 'sonner';

export interface SessionTimeoutProviderProps {
  children: React.ReactNode;

  /**
   * Inactivity timeout in milliseconds
   * Default: 1 hour (3600000ms) - synchronized with backend JWT expiration
   */
  inactivityTimeout?: number;

  /**
   * Warning timeout in milliseconds
   * Should be less than inactivityTimeout
   * Default: 59 minutes (3540000ms) - gives user 1 minute to respond
   */
  warningTimeout?: number;

  /**
   * Countdown seconds shown in warning modal
   * Default: 60 seconds
   */
  countdownSeconds?: number;
}

/**
 * Provider component that wraps dashboard content with session timeout protection
 */
export function SessionTimeoutProvider({
  children,
  inactivityTimeout = 60 * 60 * 1000, // 1 hour
  warningTimeout = 59 * 60 * 1000, // 59 minutes
  countdownSeconds = 60,
}: SessionTimeoutProviderProps) {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      router.push('/login?reason=timeout');
      toast.info('Your session has expired due to inactivity.');
    },
  });

  /**
   * Handle warning timeout (59 minutes of inactivity)
   * Show modal to user with countdown
   */
  const handleWarning = useCallback(() => {
    setShowWarning(true);
  }, [warningTimeout]);

  /**
   * Handle inactivity timeout (60 minutes)
   * Auto-logout user
   */
  const handleTimeout = useCallback(() => {
    logout();
  }, [logout]);

  /**
   * Reset inactivity timer function
   * Returned by useInactivityDetector
   */
  const { resetTimer } = useInactivityDetector({
    inactivityTimeout,
    warningTimeout,
    onWarning: handleWarning,
    onTimeout: handleTimeout,
    enabled: true,
  });

  /**
   * Handle "Continue Session" button click
   * Refresh JWT token via backend /api/v1/auth/refresh
   * Reset inactivity timers
   */
  const handleContinue = useCallback(async () => {
    setIsRefreshing(true);

    try {
      // Call backend /api/v1/auth/refresh to get new access_token
      // The backend will:
      // 1. Read refresh_token from httpOnly cookie
      // 2. Validate refresh_token
      // 3. Generate new access_token
      // 4. Set new access_token cookie
      await authApi.refresh();

      // Reset inactivity timers
      resetTimer();

      // Close modal
      setShowWarning(false);

      // Show success message
      toast.success('Session extended successfully');
    } catch (error) {
      console.error('[SessionTimeout] Failed to refresh JWT token:', error);

      // If refresh fails (e.g., refresh_token expired), force logout
      toast.error('Failed to extend session. Please login again.');
      logout();
    } finally {
      setIsRefreshing(false);
    }
  }, [resetTimer, logout]);

  /**
   * Handle "Logout" button click or countdown reaching zero
   */
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <>
      {children}

      {/* Session Timeout Warning Modal */}
      <SessionTimeoutWarning
        isOpen={showWarning}
        countdownSeconds={countdownSeconds}
        onContinue={handleContinue}
        onLogout={handleLogout}
        isRefreshing={isRefreshing}
      />
    </>
  );
}
