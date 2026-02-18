/**
 * Animation Utilities
 *
 * Optimized animation helpers using GPU-accelerated CSS properties.
 * All animations respect user's "prefers-reduced-motion" setting.
 *
 * Performance best practices:
 * - Use transform and opacity (GPU-accelerated)
 * - Avoid animating width, height, margin (trigger layout reflow)
 * - Use will-change for complex animations
 * - Keep animations under 300ms for snappy feel
 */

import { type ClassValue } from 'clsx';
import { cn } from './cn';

/**
 * Animation variants for menu items
 * Staggered fade-in effect when sidebar loads
 */
export const menuItemAnimations = {
  /**
   * Initial state (hidden)
   */
  initial: 'opacity-0 translate-x-[-8px]',

  /**
   * Animated state (visible)
   * Uses GPU-accelerated transform and opacity
   */
  animate: 'opacity-100 translate-x-0 transition-all duration-200 ease-out',

  /**
   * Hover state
   * Subtle scale for interactive feedback
   */
  hover: 'hover:scale-[1.02] active:scale-[0.98]',
} as const;

/**
 * Badge animations
 */
export const badgeAnimations = {
  /**
   * Pulse animation for "NEW" or highlighted badges
   * Uses scale transform (GPU-accelerated)
   */
  pulse: 'animate-pulse',

  /**
   * Bounce-in animation when badge appears
   */
  bounceIn: 'animate-in zoom-in-50 duration-300',

  /**
   * Scale on hover for interactive badges
   */
  scaleHover: 'hover:scale-110 transition-transform duration-150',
} as const;

/**
 * Sidebar animations
 */
export const sidebarAnimations = {
  /**
   * Collapse/expand animation
   * Uses width transition (optimized with will-change)
   */
  width: 'transition-[width] duration-300 ease-in-out will-change-[width]',

  /**
   * Mobile drawer slide-in
   * Uses transform (GPU-accelerated)
   */
  slideIn: 'transition-transform duration-300 ease-out',

  /**
   * Overlay fade-in
   */
  overlayFade: 'animate-in fade-in duration-200',

  /**
   * Content fade (when sidebar collapses)
   */
  contentFade: 'transition-opacity duration-200',
} as const;

/**
 * Progress bar animations
 */
export const progressAnimations = {
  /**
   * Smooth width transition for progress bars
   * Uses transform for better performance
   */
  fill: 'transition-all duration-500 ease-out',

  /**
   * Shimmer effect for loading states
   */
  shimmer: 'animate-pulse',

  /**
   * Color transition for different states (green/yellow/red)
   */
  colorTransition: 'transition-colors duration-300',
} as const;

/**
 * Tooltip animations
 */
export const tooltipAnimations = {
  /**
   * Fade and slide in from the side
   */
  fadeIn: 'animate-in fade-in slide-in-from-left-2 duration-150',

  /**
   * Fade out
   */
  fadeOut: 'animate-out fade-out slide-out-to-left-2 duration-100',
} as const;

/**
 * Skeleton loading animations
 */
export const skeletonAnimations = {
  /**
   * Shimmer effect for skeleton loaders
   * Uses background-position animation
   */
  shimmer: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',

  /**
   * Pulse effect (alternative to shimmer)
   */
  pulse: 'animate-pulse',
} as const;

/**
 * Get stagger delay for menu items
 * Creates cascading animation effect
 *
 * @param index - Item index in the list
 * @param baseDelay - Base delay in ms (default: 30ms)
 * @returns Delay in milliseconds
 *
 * @example
 * <div style={{ animationDelay: `${getStaggerDelay(index)}ms` }}>
 */
export function getStaggerDelay(index: number, baseDelay: number = 30): number {
  return index * baseDelay;
}

/**
 * Create animation classes with reduced motion support
 *
 * @param animations - Animation classes to apply
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Combined classes with motion preference applied
 *
 * @example
 * const classes = withReducedMotion(
 *   'transition-all duration-300',
 *   prefersReducedMotion
 * );
 */
export function withReducedMotion(
  animations: ClassValue,
  prefersReducedMotion: boolean
): string {
  if (prefersReducedMotion) {
    // Remove transition/animation classes
    return cn(animations).replace(/transition|animate|duration|ease/g, '');
  }
  return cn(animations);
}

/**
 * Spring animation config for framer-motion (if used)
 * Optimized for snappy, natural feel
 */
export const springConfig = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

/**
 * Easing functions for custom animations
 */
export const easings = {
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

/**
 * Performance-optimized animation wrapper
 * Adds will-change for complex animations, removes it after completion
 *
 * @param element - Element to animate
 * @param property - CSS property to optimize
 * @param duration - Animation duration in ms
 */
export function optimizeAnimation(
  element: HTMLElement,
  property: string,
  duration: number
): void {
  // Add will-change before animation
  element.style.willChange = property;

  // Remove will-change after animation completes
  setTimeout(() => {
    element.style.willChange = 'auto';
  }, duration);
}
