import { Eye, Heart, Bookmark, MessageCircle, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SocialCountsProps {
  viewCount: number;
  likeCount: number;
  saveCount: number;
  commentCount: number;
  shareCount: number;
  className?: string;
  compact?: boolean;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function SocialCounts({
  viewCount,
  likeCount,
  saveCount,
  commentCount,
  shareCount,
  className,
  compact = false,
}: SocialCountsProps) {
  const items = [
    { icon: Eye, count: viewCount, label: 'views' },
    { icon: Heart, count: likeCount, label: 'likes' },
    { icon: Bookmark, count: saveCount, label: 'saves' },
    { icon: MessageCircle, count: commentCount, label: 'comments' },
    { icon: Share2, count: shareCount, label: 'shares' },
  ];

  return (
    <div className={cn('flex items-center gap-3 text-muted-foreground', className)}>
      {items.map(({ icon: Icon, count, label }) => (
        <span key={label} className="flex items-center gap-1 text-xs">
          <Icon className={cn('shrink-0', compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
          {fmt(count)}
        </span>
      ))}
    </div>
  );
}
