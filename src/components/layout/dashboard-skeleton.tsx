/**
 * Dashboard Skeleton
 *
 * Loading state shown while Zustand store hydrates from localStorage.
 * Prevents flashing of incorrect menu items during hydration.
 *
 * Uses optimized shimmer animation (GPU-accelerated background-position).
 */

import { cn } from '@/lib/utils/cn';

export function DashboardSkeleton() {
  // Shimmer skeleton component with optimized animation
  const SkeletonShimmer = ({ className }: { className?: string }) => (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
        className
      )}
    />
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Skeleton */}
      <aside className="hidden lg:flex w-72 flex-col border-r bg-gray-50/40">
        {/* Logo Section */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <SkeletonShimmer className="h-8 w-8 rounded-lg" />
          <SkeletonShimmer className="h-6 w-24 rounded" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <SkeletonShimmer className="h-5 w-5 rounded" />
              <SkeletonShimmer className="h-4 flex-1 rounded" />
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <SkeletonShimmer className="h-10 w-full rounded-lg" />
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1">
        {/* Header Skeleton (Mobile) */}
        <div className="lg:hidden flex items-center gap-4 border-b p-4">
          <SkeletonShimmer className="h-10 w-10 rounded-lg" />
          <SkeletonShimmer className="h-6 flex-1 rounded" />
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          <SkeletonShimmer className="h-8 w-48 rounded" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonShimmer key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
