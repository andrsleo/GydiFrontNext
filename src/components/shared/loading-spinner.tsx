/**
 * Reusable loading spinner component
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'centered' | 'inline';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'inline',
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const variantClasses = {
    centered: 'flex items-center justify-center min-h-[400px]',
    inline: 'flex items-center justify-center py-8',
  };

  return (
    <div className={cn(variantClasses[variant], className)}>
      <Loader2 className={cn(sizeClasses[size], 'animate-spin text-muted-foreground')} />
    </div>
  );
}
