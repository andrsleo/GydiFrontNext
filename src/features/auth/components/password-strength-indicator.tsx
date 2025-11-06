/**
 * Password Strength Indicator Component
 *
 * Visual feedback component that shows password strength based on criteria:
 * - Weak: 1-2 criteria met (red)
 * - Fair: 3 criteria met (orange)
 * - Good: 4 criteria met (yellow)
 * - Strong: All 5 criteria met (green)
 */

'use client';

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import type { PasswordStrength, PasswordCriteria } from '../types/password-reset.types';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const criteria: PasswordCriteria = useMemo(
    () => ({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const { strength, color, percentage } = useMemo(() => {
    const metCriteria = Object.values(criteria).filter(Boolean).length;

    if (metCriteria === 0) {
      return { strength: 'weak' as PasswordStrength, color: 'bg-gray-300', percentage: 0 };
    } else if (metCriteria <= 2) {
      return { strength: 'weak' as PasswordStrength, color: 'bg-red-500', percentage: 25 };
    } else if (metCriteria === 3) {
      return { strength: 'fair' as PasswordStrength, color: 'bg-orange-500', percentage: 50 };
    } else if (metCriteria === 4) {
      return { strength: 'good' as PasswordStrength, color: 'bg-yellow-500', percentage: 75 };
    } else {
      return { strength: 'strong' as PasswordStrength, color: 'bg-green-500', percentage: 100 };
    }
  }, [criteria]);

  const strengthText = {
    weak: 'Débil',
    fair: 'Regular',
    good: 'Buena',
    strong: 'Fuerte',
  };

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Seguridad de la contraseña</span>
          <span className={`font-medium ${color.replace('bg-', 'text-')}`}>
            {strengthText[strength]}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full transition-all duration-300 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="space-y-1.5 text-sm">
        <CriteriaItem met={criteria.minLength} text="Al menos 8 caracteres" />
        <CriteriaItem met={criteria.hasUppercase} text="Una letra mayúscula" />
        <CriteriaItem met={criteria.hasLowercase} text="Una letra minúscula" />
        <CriteriaItem met={criteria.hasNumber} text="Un número" />
        <CriteriaItem met={criteria.hasSpecialChar} text="Un carácter especial (!@#$%^&*)" />
      </div>
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
