/**
 * Inactivity Detection Hook
 *
 * Monitors user activity and triggers callbacks after periods of inactivity.
 * Used for session timeout management and user presence detection.
 *
 * Features:
 * - Detects mousemove, keydown, scroll, click, and touchstart events
 * - Throttles event handlers for performance (100ms)
 * - Configurable inactivity and warning timeouts
 * - Automatic cleanup of event listeners
 * - Supports manual timer reset
 *
 * @example
 * ```tsx
 * function DashboardLayout() {
 *   const [showWarning, setShowWarning] = useState(false);
 *
 *   const { resetTimer } = useInactivityDetector({
 *     inactivityTimeout: 60 * 60 * 1000, // 1 hour
 *     warningTimeout: 59 * 60 * 1000,     // 59 minutes
 *     onWarning: () => setShowWarning(true),
 *     onTimeout: () => handleLogout(),
 *   });
 *
 *   return (
 *     <>
 *       {children}
 *       <SessionTimeoutWarning
 *         isOpen={showWarning}
 *         onContinue={() => {
 *           resetTimer();
 *           setShowWarning(false);
 *         }}
 *       />
 *     </>
 *   );
 * }
 * ```
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Configuration options for the inactivity detector
 */
export interface UseInactivityDetectorOptions {
  /**
   * Milliseconds of inactivity before triggering onTimeout callback
   * Default: 60 minutes (3600000ms)
   */
  inactivityTimeout?: number;

  /**
   * Milliseconds of inactivity before triggering onWarning callback
   * Should be less than inactivityTimeout (e.g., 59 minutes for 1-minute warning)
   * Default: 59 minutes (3540000ms)
   */
  warningTimeout?: number;

  /**
   * Callback invoked when warning timeout is reached
   */
  onWarning?: () => void;

  /**
   * Callback invoked when inactivity timeout is reached
   */
  onTimeout?: () => void;

  /**
   * Whether to enable the detector
   * Default: true
   */
  enabled?: boolean;

  /**
   * Throttle interval for event handlers in milliseconds
   * Default: 100ms
   */
  throttleInterval?: number;
}

/**
 * Return type of useInactivityDetector hook
 */
export interface UseInactivityDetectorReturn {
  /**
   * Manually reset the inactivity timers
   * Call this after user performs an action (e.g., clicks "Continue Session")
   */
  resetTimer: () => void;

  /**
   * Check if warning has been triggered
   */
  warningTriggered: boolean;
}

/**
 * Events to monitor for user activity
 */
const ACTIVITY_EVENTS = [
  'mousemove',
  'keydown',
  'scroll',
  'click',
  'touchstart',
] as const;

/**
 * Hook to detect user inactivity and trigger callbacks
 *
 * @param options - Configuration options
 * @returns Object with resetTimer function and warningTriggered state
 */
export function useInactivityDetector(
  options: UseInactivityDetectorOptions = {}
): UseInactivityDetectorReturn {
  const {
    inactivityTimeout = 60 * 60 * 1000, // 1 hour default
    warningTimeout = 59 * 60 * 1000, // 59 minutes default
    onWarning,
    onTimeout,
    enabled = true,
    throttleInterval = 100,
  } = options;

  // Refs to store timers and state
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTriggeredRef = useRef(false);
  const lastActivityRef = useRef<number>(Date.now());

  /**
   * Throttle helper function
   * Limits how often a function can be called
   */
  const throttle = useCallback(
    <T extends (...args: any[]) => void>(func: T, delay: number): T => {
      let lastCall = 0;
      return ((...args: any[]) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          func(...args);
        }
      }) as T;
    },
    []
  );

  /**
   * Clear all timers
   */
  const clearTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
  }, []);

  /**
   * Reset inactivity timers
   * Called when user activity is detected
   */
  const resetTimer = useCallback(() => {
    // Clear existing timers
    clearTimers();

    // Reset warning triggered flag
    warningTriggeredRef.current = false;

    // Update last activity timestamp
    lastActivityRef.current = Date.now();

    if (!enabled) return;

    // Set warning timer (e.g., after 59 minutes)
    warningTimerRef.current = setTimeout(() => {
      if (!warningTriggeredRef.current) {
        warningTriggeredRef.current = true;
        onWarning?.();
      }
    }, warningTimeout);

    // Set inactivity timeout (e.g., after 60 minutes)
    inactivityTimerRef.current = setTimeout(() => {
      onTimeout?.();
    }, inactivityTimeout);
  }, [enabled, warningTimeout, inactivityTimeout, onWarning, onTimeout, clearTimers]);

  /**
   * Throttled reset timer for event handlers
   * Prevents excessive timer resets on rapid events (e.g., mousemove)
   */
  const throttledResetTimer = useCallback(
    throttle(resetTimer, throttleInterval),
    [resetTimer, throttleInterval, throttle]
  );

  /**
   * Setup event listeners and initial timer
   */
  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }

    // Start initial timer
    resetTimer();

    // Add event listeners for activity detection
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, throttledResetTimer, { passive: true });
    });

    // Cleanup function
    return () => {
      clearTimers();

      // Remove event listeners
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, throttledResetTimer);
      });
    };
  }, [enabled, resetTimer, throttledResetTimer, clearTimers]);

  return {
    resetTimer,
    warningTriggered: warningTriggeredRef.current,
  };
}
