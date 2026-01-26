/**
 * Logger utility for development debugging
 *
 * In production, all logs are silenced to prevent exposing sensitive data.
 * In development, logs are displayed in the console with colors and formatting.
 *
 * Usage:
 * ```ts
 * import { logger } from '@/lib/logger';
 *
 * logger.log('User logged in:', userId);
 * logger.error('API error:', error);
 * logger.warn('Rate limit approaching');
 * logger.debug('Form data:', formData);
 * ```
 *
 * SECURITY: Never log sensitive data (passwords, tokens, personal info)
 * even in development mode.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Logger instance
 * All methods are no-ops in production for security
 */
export const logger = {
  /**
   * General purpose logging
   * Use for non-critical information
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Debug-level logging
   * Use for detailed debugging information
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Info-level logging
   * Use for informational messages
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Warning-level logging
   * Use for non-critical issues
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Error-level logging
   * IMPORTANT: These are shown in production but sanitized
   * Never log full error objects that may contain sensitive data
   */
  error: (message: string, error?: unknown) => {
    if (isDevelopment) {
      console.error(message, error);
    } else {
      // In production, only log the message, not the full error object
      console.error(message);
    }
  },

  /**
   * Table logging (development only)
   * Use for displaying structured data
   */
  table: (data: unknown) => {
    if (isDevelopment) {
      console.table(data);
    }
  },

  /**
   * Group logging (development only)
   * Use for grouping related logs
   */
  group: (label: string) => {
    if (isDevelopment) {
      console.group(label);
    }
  },

  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },
};

/**
 * Production-safe error logger
 * Logs errors to external service (Sentry, LogRocket, etc.) in production
 * Shows full stack trace in development
 *
 * @param error Error object
 * @param context Additional context (component name, user action, etc.)
 */
export function logError(error: Error | unknown, context?: Record<string, unknown>) {
  if (isDevelopment) {
    console.error('Error:', error);
    if (context) {
      console.error('Context:', context);
    }
  } else {
    // In production, send to error tracking service
    // Example with Sentry:
    // Sentry.captureException(error, { extra: context });

    // For now, just log a sanitized message
    const message = error instanceof Error ? error.message : 'An error occurred';
    console.error(message);
  }
}
