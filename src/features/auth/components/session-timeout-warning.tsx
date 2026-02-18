/**
 * Session Timeout Warning Modal
 *
 * Displays a warning modal when user session is about to expire due to inactivity.
 * Shows a countdown timer and gives the user options to continue or logout.
 *
 * Features:
 * - Circular countdown timer (visual progress indicator)
 * - Two action buttons: "Continue Session" and "Logout"
 * - Keyboard accessible (ESC to close if onContinue provided)
 * - Blocks background interaction (modal overlay)
 * - Responsive design
 * - ARIA labels for screen readers
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const [showWarning, setShowWarning] = useState(false);
 *
 *   return (
 *     <>
 *       <DashboardContent />
 *
 *       <SessionTimeoutWarning
 *         isOpen={showWarning}
 *         countdownSeconds={60}
 *         onContinue={() => {
 *           refreshSession();
 *           setShowWarning(false);
 *         }}
 *         onLogout={() => logout()}
 *       />
 *     </>
 *   );
 * }
 * ```
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut, RefreshCw } from 'lucide-react';

export interface SessionTimeoutWarningProps {
  /**
   * Whether the modal is visible
   */
  isOpen: boolean;

  /**
   * Countdown duration in seconds
   * Default: 60
   */
  countdownSeconds?: number;

  /**
   * Callback when user clicks "Continue Session"
   * Typically refreshes JWT token and resets inactivity timer
   */
  onContinue?: () => void | Promise<void>;

  /**
   * Callback when user clicks "Logout" or countdown reaches zero
   * Typically logs out the user and redirects to login
   */
  onLogout: () => void | Promise<void>;

  /**
   * Whether the "Continue Session" action is loading
   * Default: false
   */
  isRefreshing?: boolean;
}

/**
 * Session Timeout Warning Modal Component
 */
export function SessionTimeoutWarning({
  isOpen,
  countdownSeconds = 60,
  onContinue,
  onLogout,
  isRefreshing = false,
}: SessionTimeoutWarningProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(countdownSeconds);

  /**
   * Reset countdown when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(countdownSeconds);
    }
  }, [isOpen, countdownSeconds]);

  /**
   * Countdown timer
   * Decrements every second, triggers onLogout when reaches zero
   */
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-logout when countdown reaches zero
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogout]);

  /**
   * Handle "Continue Session" button click
   */
  const handleContinue = useCallback(async () => {
    if (onContinue) {
      await onContinue();
    }
  }, [onContinue]);

  /**
   * Handle "Logout" button click
   */
  const handleLogout = useCallback(async () => {
    await onLogout();
  }, [onLogout]);

  /**
   * Format seconds as MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Calculate progress percentage for visual indicator
   */
  const progressPercentage = (secondsRemaining / countdownSeconds) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onContinue?.()}>
      <DialogContent
        className="sm:max-w-md"
        aria-describedby="session-timeout-description"
        onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing by clicking outside
        onEscapeKeyDown={(e) => {
          // Allow ESC to trigger continue action if available
          if (onContinue) {
            e.preventDefault();
            handleContinue();
          }
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <DialogTitle className="text-xl">Session Expiring Soon</DialogTitle>
          </div>
          <DialogDescription
            id="session-timeout-description"
            className="text-base pt-4"
          >
            Your session will expire in{' '}
            <span className="font-semibold text-foreground">
              {formatTime(secondsRemaining)}
            </span>{' '}
            due to inactivity.
          </DialogDescription>
        </DialogHeader>

        {/* Circular Progress Indicator */}
        <div className="flex justify-center py-6">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted-foreground/20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-amber-500 transition-all duration-1000 ease-linear"
                strokeDasharray="283" // 2 * π * 45
                strokeDashoffset={283 - (283 * progressPercentage) / 100}
                strokeLinecap="round"
              />
            </svg>
            {/* Countdown text in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums text-foreground">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                remaining
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
          {onContinue && (
            <Button
              onClick={handleContinue}
              disabled={isRefreshing}
              className="w-full sm:w-auto sm:flex-1"
              size="lg"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Continue Session
                </>
              )}
            </Button>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            disabled={isRefreshing}
            className="w-full sm:w-auto"
            size="lg"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
