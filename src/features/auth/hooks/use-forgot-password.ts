/**
 * useForgotPassword Hook
 *
 * TanStack Query mutation hook for requesting password reset.
 */

'use client';

import { useMutation } from '@tanstack/react-query';
import { passwordResetApi } from '../api/password-reset.api';
import type { ForgotPasswordRequest } from '../types/password-reset.types';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => passwordResetApi.requestReset(data),
  });
}