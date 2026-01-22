/**
 * Change Password Hook
 *
 * React Query mutation hook for changing user password in security settings.
 *
 * Usage:
 * ```tsx
 * const { mutate, isPending } = useChangePassword();
 *
 * const handleSubmit = (data) => {
 *   mutate(data, {
 *     onSuccess: () => toast.success('Password updated'),
 *     onError: (error) => toast.error(error.message),
 *   });
 * };
 * ```
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Changes user password by verifying current password
 *
 * SECURITY: Uses JWT authentication (no CSRF tokens needed)
 */
async function changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
  const response = await apiClient.put<ChangePasswordResponse>(
    '/api/v1/users/password',
    data
  );
  return response.data;
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      // Invalidate user queries if needed
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      // Error handling is done in the component with onError callback
      console.error('Password change failed:', error);
    },
  });
}
