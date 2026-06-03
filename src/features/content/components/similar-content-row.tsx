'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSimilarContent } from '../hooks/use-similar-content';
import type { ContentPost } from '../types';

interface SimilarContentCardProps {
  post: ContentPost;
}

function SimilarContentCard({ post }: SimilarContentCardProps) {
  const firstMedia = post.media?.[0];
  const thumbnail = firstMedia?.thumbnailUrl ?? post.thumbnailUrl;

  return (
    <Link
      href={`/feed?postId=${post.id}`}
      className="snap-start shrink-0 group relative w-32 overflow-hidden rounded-2xl bg-[hsl(var(--gydi-ink))] clay-card micro-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--gydi-primary))]"
      aria-label={post.caption ?? 'Ver contenido'}
    >
      {/* Portrait thumbnail */}
      <div className="aspect-[9/16] relative overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={post.caption ?? 'Contenido'}
            fill
            sizes="128px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)]" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Creator avatar — bottom-left */}
        {post.creatorAvatarUrl && (
          <div className="absolute bottom-2 left-2 h-6 w-6 overflow-hidden rounded-full border border-white/40 bg-white/20 backdrop-blur-sm">
            <Image
              src={post.creatorAvatarUrl}
              alt={post.creatorDisplayName ?? 'Creator'}
              fill
              sizes="24px"
              className="object-cover"
            />
          </div>
        )}

        {/* View count — bottom-right */}
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-full bg-black/50 px-1.5 py-0.5 backdrop-blur-sm">
          <Eye className="h-2.5 w-2.5 text-white/70" />
          <span className="text-[10px] font-semibold text-white/90">
            {post.viewCount >= 1000
              ? `${(post.viewCount / 1000).toFixed(1)}K`
              : post.viewCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SimilarContentSkeleton() {
  return (
    <div className="flex gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          className="snap-start shrink-0 w-32 rounded-2xl"
          style={{ aspectRatio: '9/16' }}
        />
      ))}
    </div>
  );
}

interface SimilarContentRowProps {
  postId: number;
}

export function SimilarContentRow({ postId }: SimilarContentRowProps) {
  const { data: posts, isLoading } = useSimilarContent(postId);

  if (isLoading) return <SimilarContentSkeleton />;
  if (!posts || posts.length === 0) return null;

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
      role="list"
      aria-label="Contenido similar"
    >
      {posts.slice(0, 8).map((post) => (
        <SimilarContentCard key={post.id} post={post} />
      ))}
    </div>
  );
}
