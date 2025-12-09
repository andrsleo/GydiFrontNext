/**
 * Password Strength Indicator Component
 *
 * Visual feedback component that shows password strength with:
 * - Real-time validation using password-validator utility
 * - Visual strength meter (color-coded progress bar)
 * - List of requirements with check/cross icons
 * - Common password detection
 * - Matches backend @StrongPassword validation
 *
 * @updated 2025-12-02 - Added common password detection and full validation
 */

'use client';

import { useMemo } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import {
  validatePasswordStrength,
  PASSWORD_RULES,
  type PasswordValidationResult,
} from '@/lib/password-validator';

interface PasswordStrengthIndicatorProps {
  password: string;
  showCommonPasswordWarning?: boolean;
}

export function PasswordStrengthIndicator({
  password,
  showCommonPasswordWarning = true,
}: PasswordStrengthIndicatorProps) {
  const validation = useMemo<PasswordValidationResult>(() => {
    if (!password) {
      return {
        isValid: false,
        errors: [],
        strength: 'weak',
      };
    }
    return validatePasswordStrength(password);
  }, [password]);

  const strengthConfig = {
    weak: {
      label: 'Débil',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      progress: 25,
    },
    medium: {
      label: 'Media',
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      progress: 50,
    },
    strong: {
      label: 'Fuerte',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      progress: 75,
    },
    'very-strong': {
      label: 'Muy Fuerte',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      progress: 100,
    },
  };

  const config = strengthConfig[validation.strength];

  // Determine if each requirement is met
  const requirements = [
    {
      met: password.length >= PASSWORD_RULES.minLength,
      text: `Al menos ${PASSWORD_RULES.minLength} caracteres`,
    },
    {
      met: PASSWORD_RULES.patterns.uppercase.test(password),
      text: 'Una letra mayúscula (A-Z)',
    },
    {
      met: PASSWORD_RULES.patterns.lowercase.test(password),
      text: 'Una letra minúscula (a-z)',
    },
    {
      met: PASSWORD_RULES.patterns.digit.test(password),
      text: 'Un número (0-9)',
    },
    {
      met: PASSWORD_RULES.patterns.specialChar.test(password),
      text: 'Un carácter especial (@$!%*?&)',
    },
    {
      met: !validation.errors.some((error) => error.includes('too common')),
      text: 'No es una contraseña común',
    },
  ];

  const isCommonPassword = validation.errors.some((error) => error.includes('too common'));

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Fortaleza de la contraseña</span>
          <span className={`font-medium ${config.textColor}`}>{config.label}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full transition-all duration-300 ${config.color}`}
            style={{ width: `${config.progress}%` }}
          />
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="space-y-1.5 text-sm">
        {requirements.map((req, index) => (
          <CriteriaItem key={index} met={req.met} text={req.text} />
        ))}
      </div>

      {/* Common Password Warning */}
      {showCommonPasswordWarning && isCommonPassword && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Contraseña común detectada</p>
            <p className="text-amber-700 mt-1">
              Esta contraseña es muy común y vulnerable a ataques. Por favor elige una contraseña
              única y más segura.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface CriteriaItemProps {
  met: boolean;
  text: string;
}

function CriteriaItem({ met, text }: CriteriaItemProps) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      )}
      <span className={met ? 'text-green-700' : 'text-muted-foreground'}>{text}</span>
    </div>
  );
}
