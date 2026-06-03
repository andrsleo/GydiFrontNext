'use client';
import { useMemo } from 'react';
import { LikeButton } from '@/features/social/components/like-button';
import { SaveButton } from '@/features/social/components/save-button';
import { ShareSheet } from '@/features/social/components/share-sheet';
import { useReferralLinks } from '@/features/referrals/hooks/use-referral-links';
import type { ContentPost } from '../../types';

interface FeedActionsProps {
  post: ContentPost;
  shareUrl: string;
}

export function FeedActions({ post, shareUrl }: FeedActionsProps) {
  // Fetch the current user's referral links (no-op if unauthenticated — hook is gated by isAuthenticated)
  const { data: referralLinks } = useReferralLinks();

  // Find the best referral link to append:
  // 1. Prefer one that targets this post's property (if available)
  // 2. Fall back to the first active link
  const referralCode = useMemo(() => {
    if (!referralLinks || referralLinks.length === 0) return null;
    const activeLinks = referralLinks.filter((l) => l.status === 'ACTIVE');
    if (activeLinks.length === 0) return null;

    if (post.propertyId != null) {
      const propertyLink = activeLinks.find(
        (l) => l.propertyId === String(post.propertyId),
      );
      if (propertyLink) return propertyLink.shortCode;
    }

    return activeLinks[0].shortCode;
  }, [referralLinks, post.propertyId]);

  // Append ?ref={code} only when we have a code and the post has a property
  const enrichedShareUrl = useMemo(() => {
    if (!referralCode) return shareUrl;
    try {
      const url = new URL(shareUrl, typeof window !== 'undefined' ? window.location.origin : 'https://gydi.com');
      url.searchParams.set('ref', referralCode);
      return url.toString();
    } catch {
      // If URL construction fails, fall back to the original
      return shareUrl;
    }
  }, [shareUrl, referralCode]);

  return (
    <div className="absolute bottom-20 right-3 flex flex-col items-center gap-5">
      <LikeButton contentPostId={post.id} likeCount={post.likeCount} />
      <SaveButton contentPostId={post.id} saveCount={post.saveCount} />
      <ShareSheet
        contentPostId={post.id}
        shareCount={post.shareCount}
        shareUrl={enrichedShareUrl}
      />
    </div>
  );
}
