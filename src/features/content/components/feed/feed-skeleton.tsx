'use client';
import { Skeleton } from '@/components/ui/skeleton';

export function FeedSkeleton() {
  return (
    <div className="flex h-[100dvh] snap-start items-end p-4">
      <div className="w-full space-y-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-64" />
      </div>
    </div>
  );
}
