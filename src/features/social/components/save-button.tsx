'use client';

import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { useToggleSave } from '../hooks/use-toggle-save';

interface SaveButtonProps {
  contentPostId: number;
  saveCount: number;
  saved?: boolean;
  className?: string;
}

export function SaveButton({
  contentPostId,
  saveCount,
  saved = false,
  className,
}: SaveButtonProps) {
  const { mutate, isPending } = useToggleSave(contentPostId);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('gap-1.5 text-sm', className)}
      onClick={() => mutate()}
      disabled={isPending}
      aria-label={saved ? 'Unsave' : 'Save'}
    >
      <Bookmark
        className={cn(
          'h-4 w-4 transition-colors',
          saved && 'fill-[hsl(var(--gydi-primary))] text-[hsl(var(--gydi-primary))]'
        )}
      />
      <span>{saveCount}</span>
    </Button>
  );
}
