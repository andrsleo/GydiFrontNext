'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { useToggleFollow } from '../hooks/use-toggle-follow';

interface FollowButtonProps {
  targetUserId: number;
  following?: boolean;
  className?: string;
}

export function FollowButton({
  targetUserId,
  following = false,
  className,
}: FollowButtonProps) {
  const { mutate, isPending } = useToggleFollow(targetUserId);

  return (
    <Button
      variant={following ? 'outline' : 'default'}
      size="sm"
      className={cn(
        !following &&
          'bg-[hsl(var(--gydi-primary))] hover:bg-[hsl(252,100%,58%)]',
        className
      )}
      onClick={() => mutate()}
      disabled={isPending}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
