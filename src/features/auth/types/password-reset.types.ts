/**
 * Password Reset Types
 *
 * TypeScript types for password reset flow (forgot password, validate token, reset password).
 */

/**
 * Request to initiate password reset flow
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Response after requesting password reset
 */
export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

/**
 * Response when validating reset token
 */
export interface ValidateTokenResponse {
  valid: boolean;
  email?: string;
  expiresAt?: string;
  error?: string;
}

/**
 * Request to reset password with new password
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Response after successfully resetting password
 */
export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

/**
 * Password strength levels
 */
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

/**
 * Password validation criteria
 */
export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}