'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAddComment } from '../hooks/use-add-comment';

interface CommentInputProps {
  contentPostId: number;
  parentCommentId?: number;
  placeholder?: string;
  onSuccess?: () => void;
}

export function CommentInput({
  contentPostId,
  parentCommentId,
  placeholder = 'Add a comment…',
  onSuccess,
}: CommentInputProps) {
  const [body, setBody] = useState('');
  const { mutate, isPending } = useAddComment(contentPostId);

  const handleSubmit = () => {
    if (!body.trim() || body.length < 3) return;
    mutate(
      { body: body.trim(), parentCommentId },
      {
        onSuccess: () => {
          setBody('');
          onSuccess?.();
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={2}
        maxLength={300}
        className="resize-none text-sm"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{body.length}/300</span>
        <Button
          size="sm"
          disabled={isPending || body.trim().length < 3}
          onClick={handleSubmit}
        >
          {isPending ? 'Posting…' : 'Post'}
        </Button>
      </div>
    </div>
  );
}
