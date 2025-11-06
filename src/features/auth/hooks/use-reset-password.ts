/**
 * useResetPassword Hook
 *
 * TanStack Query mutation hook for resetting password with new password.
 */

'use client';

import { useMutation } from '@tanstack/react-query';
import { passwordResetApi } from '../api/password-reset.api';
import type { ResetPasswordRequest } from '../types/password-reset.types';

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => passwordResetApi.resetPassword(data),
  });
}
