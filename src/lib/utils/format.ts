/**
 * Formatting Utilities
 * Date, number, and currency formatters
 */

import { format as dateFnsFormat } from 'date-fns';
import type { Currency } from '@/features/properties/types';

/**
 * Currency symbols mapping
 */
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  MXN: '$',
  CAD: 'CA$',
  GBP: '£',
};

/**
 * Format currency with symbol
 *
 * @example
 * formatCurrency(150, 'USD') // "$150"
 * formatCurrency(99.99, 'EUR') // "€99.99"
 */
export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol}${formatted}`;
}

/**
 * Format date to readable string
 *
 * @example
 * formatDate('2025-10-30') // "Oct 30, 2025"
 */
export function formatDate(date: string | Date, formatStr = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateFnsFormat(dateObj, formatStr);
}

/**
 * Format date to relative time
 *
 * @example
 * formatRelativeTime('2025-10-29') // "1 day ago"
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

/**
 * Format file size
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format number with commas
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format percentage
 *
 * @example
 * formatPercentage(0.15) // "15%"
 * formatPercentage(0.05) // "5%"
 */
export function formatPercentage(decimal: number): string {
  return `${(decimal * 100).toFixed(0)}%`;
}
