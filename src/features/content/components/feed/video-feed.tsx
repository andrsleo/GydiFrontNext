'use client';
import { useRef, useEffect } from 'react';
import { useContentFeed } from '../../hooks/use-content-feed';
import { FeedCard } from './feed-card';
import { FeedSkeleton } from './feed-skeleton';
import { FeedEmpty } from './feed-empty';
import type { ContentPost } from '../../types';

interface VideoFeedProps {
  initialPosts?: ContentPost[];
}

export function VideoFeed({ initialPosts }: VideoFeedProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useContentFeed();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const posts = data?.pages.flatMap((p) => p.content) ?? initialPosts ?? [];

  // IntersectionObserver to auto-fetch next page
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="h-[100dvh] overflow-y-scroll snap-y snap-mandatory">
        {[1, 2, 3].map((i) => (
          <FeedSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) return <FeedEmpty />;

  return (
    <div className="h-[100dvh] overflow-y-scroll snap-y snap-mandatory">
      {posts.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}
      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && <FeedSkeleton />}
    </div>
  );
}
