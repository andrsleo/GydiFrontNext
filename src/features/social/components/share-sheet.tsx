'use client';

import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useShareContent } from '../hooks/use-share-content';
import type { SharePlatform } from '../types';

interface ShareSheetProps {
  contentPostId: number;
  shareCount: number;
  shareUrl: string;
}

const PLATFORMS: { id: SharePlatform; label: string; color: string }[] = [
  { id: 'WHATSAPP', label: 'WhatsApp', color: '#25D366' },
  { id: 'INSTAGRAM', label: 'Instagram', color: '#E1306C' },
  { id: 'TWITTER', label: 'X (Twitter)', color: '#000' },
  { id: 'FACEBOOK', label: 'Facebook', color: '#1877F2' },
  { id: 'TIKTOK', label: 'TikTok', color: '#010101' },
];

export function ShareSheet({ contentPostId, shareCount, shareUrl }: ShareSheetProps) {
  const { mutate } = useShareContent(contentPostId);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    mutate('COPY_LINK');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
          <Share2 className="h-4 w-4" />
          <span>{shareCount}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Compartir</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => mutate(p.id)}
              className="flex flex-col items-center gap-1.5 rounded-xl p-3 hover:bg-muted transition-colors"
            >
              <div
                className="h-10 w-10 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-xs font-medium">{p.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2">
          <span className="flex-1 truncate text-sm text-muted-foreground">{shareUrl}</span>
          <Button size="sm" variant="ghost" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
