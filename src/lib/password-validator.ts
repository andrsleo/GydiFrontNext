/**
 * Password validation utilities for strong password requirements.
 *
 * This matches the backend @StrongPassword validation to provide
 * immediate feedback to users without waiting for API response.
 *
 * SECURITY: Frontend validation is for UX only. Backend validation
 * is the actual security boundary.
 */

/**
 * Common passwords blacklist (subset of backend list)
 * Based on OWASP Top 10,000 most common passwords
 */
const COMMON_PASSWORDS = new Set([
  // Top 10 most common
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',

  // Common patterns
  'password123', 'password1', 'qwerty123', 'welcome',
  'admin', 'administrator', 'root', 'user', 'guest',

  // Sequential patterns
  '123456789', '1234567890', 'abcdefgh', 'qwertyuiop',

  // Keyboard patterns
  'asdfghjkl', 'zxcvbnm', 'qazwsx', '123qwe',

  // Years
  'password2024', 'password2025', 'welcome2024',

  // Common with special chars (still weak)
  'password!', 'password@', 'password#', 'password$',
  'qwerty!', '123456!', 'admin123!', 'welcome!',
]);

/**
 * Password validation rules
 */
export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 100,
  patterns: {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    digit: /\d/,
    specialChar: /[@$!%*?&]/,
  },
} as const;

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
}

/**
 * Validates password against strong password requirements.
 *
 * Requirements:
 * - 8-100 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 digit (0-9)
 * - At least 1 special character (@$!%*?&)
 * - Not in common passwords blacklist
 *
 * @param password - The password to validate
 * @returns Validation result with errors and strength indicator
 *
 * @example
 * ```ts
 * const result = validatePasswordStrength('SecureP@ss123');
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password) {
    return {
      isValid: false,
      errors: ['La contraseña es requerida'],
      strength: 'weak',
    };
  }

  // 1. Check length
  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`La contraseña debe tener al menos ${PASSWORD_RULES.minLength} caracteres`);
  }

  if (password.length > PASSWORD_RULES.maxLength) {
    errors.push(`La contraseña no debe exceder ${PASSWORD_RULES.maxLength} caracteres`);
  }

  // 2. Check complexity
  if (!PASSWORD_RULES.patterns.uppercase.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula (A-Z)');
  }

  if (!PASSWORD_RULES.patterns.lowercase.test(password)) {
    errors.push('Debe contener al menos una letra minúscula (a-z)');
  }

  if (!PASSWORD_RULES.patterns.digit.test(password)) {
    errors.push('Debe contener al menos un número (0-9)');
  }

  if (!PASSWORD_RULES.patterns.specialChar.test(password)) {
    errors.push('Debe contener al menos un carácter especial (@$!%*?&)');
  }

  // 3. Check against common passwords
  if (isCommonPassword(password)) {
    errors.push('Esta contraseña es muy común y fácil de adivinar. Por favor elige una contraseña más segura');
  }

  // 4. Calculate strength
  const strength = calculatePasswordStrength(password, errors.length === 0);

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Checks if password is in common passwords blacklist.
 * Case-insensitive comparison and prefix matching.
 *
 * @param password - The password to check
 * @returns true if password is common, false otherwise
 */
export function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase();

  // Exact match
  if (COMMON_PASSWORDS.has(lowerPassword)) {
    return true;
  }

  // Prefix match (e.g., "password123456" starts with "password")
  for (const commonPwd of COMMON_PASSWORDS) {
    if (lowerPassword.startsWith(commonPwd)) {
      return true;
    }
  }

  return false;
}

/**
 * Calculates password strength indicator.
 *
 * @param password - The password to evaluate
 * @param meetsRequirements - Whether password meets all basic requirements
 * @returns Strength level
 */
function calculatePasswordStrength(
  password: string,
  meetsRequirements: boolean
): 'weak' | 'medium' | 'strong' | 'very-strong' {
  if (!meetsRequirements) {
    return 'weak';
  }

  let score = 0;

  // Length bonus
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Complexity bonus
  const hasMultipleUppercase = (password.match(/[A-Z]/g) || []).length > 1;
  const hasMultipleDigits = (password.match(/\d/g) || []).length > 1;
  const hasMultipleSpecial = (password.match(/[@$!%*?&]/g) || []).length > 1;

  if (hasMultipleUppercase) score += 1;
  if (hasMultipleDigits) score += 1;
  if (hasMultipleSpecial) score += 1;

  // No repeated characters
  const hasRepeats = /(.)\1{2,}/.test(password);
  if (!hasRepeats) score += 1;

  // No sequential patterns
  const hasSequential = /abc|bcd|cde|123|234|345|456|567|678|789/i.test(password);
  if (!hasSequential) score += 1;

  // Determine strength
  if (score >= 6) return 'very-strong';
  if (score >= 4) return 'strong';
  if (score >= 2) return 'medium';
  return 'weak';
}

/**
 * Gets user-friendly description of password requirements.
 * Useful for displaying help text in forms.
 *
 * @returns Array of requirement descriptions in Spanish
 */
export function getPasswordRequirements(): string[] {
  return [
    `Al menos ${PASSWORD_RULES.minLength} caracteres`,
    'Una letra mayúscula (A-Z)',
    'Una letra minúscula (a-z)',
    'Un número (0-9)',
    'Un carácter especial (@$!%*?&)',
    'No puede ser una contraseña común',
  ];
}

/**
 * Formats validation errors for display.
 * Converts technical errors to user-friendly messages.
 *
 * @param errors - Array of validation errors
 * @returns Formatted error message
 */
export function formatPasswordErrors(errors: string[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];

  return `Password requirements:\n${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
}
