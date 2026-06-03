'use client';
import Link from 'next/link';
import { FeedPropertyPill } from './feed-property-pill';
import type { ContentPost } from '../../types';

interface FeedOverlayProps {
  post: ContentPost;
}

export function FeedOverlay({ post }: FeedOverlayProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-6">
      {/* Creator info */}
      <div className="mb-2 flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
          {(post.creatorDisplayName ?? 'U')[0].toUpperCase()}
        </div>
        <Link
          href={`/creators/${post.creatorId}`}
          className="text-sm font-semibold text-white hover:underline"
        >
          {post.creatorDisplayName ?? `Creator #${post.creatorId}`}
        </Link>
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="mb-2 line-clamp-2 text-sm text-white/90">{post.caption}</p>
      )}

      {/* Property pill — Phase 4: includes contentId for social commerce attribution */}
      {post.propertyTitle && post.propertySlug && (
        <FeedPropertyPill
          propertyTitle={post.propertyTitle}
          propertySlug={post.propertySlug}
          contentPostId={post.id}
        />
      )}
    </div>
  );
}
