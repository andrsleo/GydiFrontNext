/**
 * useValidateResetToken Hook
 *
 * TanStack Query hook for validating password reset token.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { passwordResetApi } from '../api/password-reset.api';

export function useValidateResetToken(token: string | null) {
  return useQuery({
    queryKey: ['validate-reset-token', token],
    queryFn: () => passwordResetApi.validateToken(token!),
    enabled: !!token,
    retry: false,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache validation results
  });
}