'use client';
import type { UrlObject } from 'url';
import Link from 'next/link';
import { Home } from 'lucide-react';

interface FeedPropertyPillProps {
  propertyTitle: string;
  propertySlug: string;
  /** Phase 4 — Social Commerce: appended as ?contentId= for booking attribution */
  contentPostId?: number;
}

export function FeedPropertyPill({ propertyTitle, propertySlug, contentPostId }: FeedPropertyPillProps) {
  const href = contentPostId
    ? `/propiedades/${propertySlug}?contentId=${contentPostId}`
    : `/propiedades/${propertySlug}`;

  return (
    <Link
      href={href as unknown as UrlObject}
      className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
    >
      <Home className="h-3.5 w-3.5" />
      <span className="max-w-[160px] truncate">{propertyTitle}</span>
    </Link>
  );
}
