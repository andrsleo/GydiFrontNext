/**
 * Progress Bar Component
 *
 * Shows user progress through multi-step flows (registration, payment, etc.)
 */

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn('w-full space-y-2', className)}>
      {/* Steps indicator */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium">
          Paso {currentStep} de {totalSteps}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className={cn(currentStep >= 1 && 'font-medium text-primary')}>
          {currentStep === 1 ? '◉' : currentStep > 1 ? '✓' : '○'} Información
        </span>
        <span className={cn(currentStep >= 2 && 'font-medium text-primary')}>
          {currentStep === 2 ? '◉' : currentStep > 2 ? '✓' : '○'} Pago
        </span>
        <span className={cn(currentStep >= 3 && 'font-medium text-primary')}>
          {currentStep === 3 ? '◉' : '○'} Confirmación
        </span>
      </div>
    </div>
  );
}
