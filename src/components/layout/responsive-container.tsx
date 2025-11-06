/**
 * ResponsiveContainer Component
 * Provides consistent max-width and padding across all pages
 */

import { cn } from '@/lib/utils/cn';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

/**
 * Responsive Container with predefined sizes
 *
 * @example
 * ```tsx
 * <ResponsiveContainer size="lg" className="py-8">
 *   <h1>Page Content</h1>
 * </ResponsiveContainer>
 * ```
 */
export function ResponsiveContainer({
  children,
  size = 'lg',
  className
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',    // 768px
    md: 'max-w-5xl',    // 1024px
    lg: 'max-w-7xl',    // 1280px
    xl: 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}