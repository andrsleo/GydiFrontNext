/**
 * Role normalization utilities
 *
 * The backend returns roles with 'ROLE_' prefix (e.g., 'ROLE_USER', 'ROLE_ADMIN'),
 * but the frontend expects roles without prefix (e.g., 'USER', 'ADMIN').
 *
 * These utilities ensure consistent role handling across the application.
 */

import type { Role } from '@/types/navigation';

/**
 * Normalize role by removing 'ROLE_' prefix if present
 *
 * @param role - Role from backend (may have 'ROLE_' prefix)
 * @returns Normalized role without prefix
 *
 * @example
 * normalizeRole('ROLE_USER') // returns 'USER'
 * normalizeRole('USER') // returns 'USER'
 * normalizeRole('ROLE_ADMIN') // returns 'ADMIN'
 */
export function normalizeRole(role: string | undefined | null): Role {
  if (!role) return 'USER';

  // Remove 'ROLE_' prefix if present
  const normalized = role.replace(/^ROLE_/, '');

  // Ensure it's a valid role
  if (normalized === 'USER' || normalized === 'ADMIN' || normalized === 'HOST') {
    return normalized as Role;
  }

  // Default to USER if invalid
  return 'USER';
}

/**
 * Check if user has specific role
 *
 * @param userRole - User's role (may have 'ROLE_' prefix)
 * @param expectedRole - Expected role (without prefix)
 * @returns true if roles match
 *
 * @example
 * hasRole('ROLE_ADMIN', 'ADMIN') // returns true
 * hasRole('USER', 'ADMIN') // returns false
 */
export function hasRole(userRole: string | undefined | null, expectedRole: Role): boolean {
  return normalizeRole(userRole) === expectedRole;
}

/**
 * Check if user has any of the specified roles
 *
 * @param userRole - User's role (may have 'ROLE_' prefix)
 * @param allowedRoles - Array of allowed roles (without prefix)
 * @returns true if user has any of the allowed roles
 *
 * @example
 * hasAnyRole('ROLE_ADMIN', ['ADMIN', 'HOST']) // returns true
 * hasAnyRole('USER', ['ADMIN', 'HOST']) // returns false
 */
export function hasAnyRole(userRole: string | undefined | null, allowedRoles: Role[]): boolean {
  const normalized = normalizeRole(userRole);
  return allowedRoles.includes(normalized);
}
