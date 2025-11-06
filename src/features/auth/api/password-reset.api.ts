/**
 * Password Reset API Client
 *
 * API client for password reset operations (forgot password, validate token, reset password).
 */

import { apiClient } from '@/lib/api/client';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ValidateTokenResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../types/password-reset.types';

export const passwordResetApi = {
  /**
   * Request password reset - sends reset email to user
   */
  async requestReset(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ForgotPasswordResponse>(
      '/api/v1/auth/forgot-password',
      data
    );
    return response.data;
  },

  /**
   * Validate reset token - check if token is valid and not expired
   */
  async validateToken(token: string): Promise<ValidateTokenResponse> {
    const response = await apiClient.get<ValidateTokenResponse>(
      `/api/v1/auth/reset-password/validate/${token}`
    );
    return response.data;
  },

  /**
   * Reset password - set new password using valid token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>(
      '/api/v1/auth/reset-password',
      data
    );
    return response.data;
  },
};