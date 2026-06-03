'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { useToggleLike } from '../hooks/use-toggle-like';

interface LikeButtonProps {
  contentPostId: number;
  likeCount: number;
  liked?: boolean;
  className?: string;
}

export function LikeButton({
  contentPostId,
  likeCount,
  liked = false,
  className,
}: LikeButtonProps) {
  const { mutate, isPending } = useToggleLike(contentPostId);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('gap-1.5 text-sm', className)}
      onClick={() => mutate()}
      disabled={isPending}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          liked && 'fill-rose-500 text-rose-500'
        )}
      />
      <span>{likeCount}</span>
    </Button>
  );
}
