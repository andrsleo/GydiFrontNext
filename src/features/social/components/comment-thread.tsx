'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../api/social.api';
import type { CommentDto } from '../types';
import { CommentInput } from './comment-input';
import { useState } from 'react';

interface CommentItemProps {
  comment: CommentDto;
  contentPostId: number;
  currentUserId?: number;
}

function CommentItem({ comment, contentPostId, currentUserId }: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteComment } = useMutation({
    mutationFn: () => socialApi.deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentPostId] });
    },
  });

  const initials = comment.authorDisplayName
    ?.split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <div className="flex gap-3">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={comment.authorAvatarUrl} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="rounded-xl bg-muted/50 px-3 py-2">
          <p className="text-xs font-medium">{comment.authorDisplayName ?? 'Anonymous'}</p>
          <p className="text-sm mt-0.5 break-words">{comment.body}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 px-1">
          <button
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setShowReply((v) => !v)}
          >
            Reply
          </button>
          {currentUserId === comment.userId && (
            <button
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={() => deleteComment()}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
        {showReply && (
          <div className="mt-2">
            <CommentInput
              contentPostId={contentPostId}
              parentCommentId={comment.id}
              placeholder="Reply…"
              onSuccess={() => setShowReply(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentThreadProps {
  comments: CommentDto[];
  contentPostId: number;
  currentUserId?: number;
}

export function CommentThread({ comments, contentPostId, currentUserId }: CommentThreadProps) {
  if (!comments.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No comments yet. Be the first!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          contentPostId={contentPostId}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
