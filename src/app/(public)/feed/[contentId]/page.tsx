'use client';

import { useParams } from 'next/navigation';
import { useContentById } from '@/features/content/hooks/use-content-by-id';
import { ContentMediaPreview } from '@/features/content/components/content-media-preview';
import { LikeButton } from '@/features/social/components/like-button';
import { SaveButton } from '@/features/social/components/save-button';
import { ShareSheet } from '@/features/social/components/share-sheet';
import { CommentThread } from '@/features/social/components/comment-thread';
import { CommentInput } from '@/features/social/components/comment-input';
import { useComments } from '@/features/social/hooks/use-comments';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContentDetailPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const id = Number(contentId);

  const { data: post, isLoading } = useContentById(id);
  const { data: commentsData } = useComments(id);

  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-4">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Content not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      {post.media && post.media.length > 0 && (
        <ContentMediaPreview media={post.media} className="rounded-2xl overflow-hidden" />
      )}

      {post.caption && (
        <p className="text-base leading-relaxed">{post.caption}</p>
      )}

      <div className="flex items-center gap-2">
        <LikeButton
          contentPostId={post.id}
          likeCount={post.likeCount}
        />
        <SaveButton
          contentPostId={post.id}
          saveCount={post.saveCount}
        />
        <ShareSheet
          contentPostId={post.id}
          shareCount={post.shareCount}
          shareUrl={shareUrl}
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold">
          Comments ({post.commentCount})
        </h2>
        <CommentInput contentPostId={post.id} />
        {commentsData && (
          <CommentThread
            comments={commentsData.content}
            contentPostId={post.id}
          />
        )}
      </div>
    </div>
  );
}
