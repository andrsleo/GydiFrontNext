'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Eye, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, Stagger, StaggerItem, GYDI_SPRING } from '@/lib/motion';
import { useContentFeed } from '@/features/content/hooks/use-content-feed';
import type { ContentPost } from '@/features/content/types';

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

interface TrendingCardProps {
  post: ContentPost;
}

function TrendingCard({ post }: TrendingCardProps) {
  const thumbnail = post.media?.[0]?.thumbnailUrl ?? post.thumbnailUrl;

  return (
    <Link
      href={`/feed?postId=${String(post.id)}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--gydi-primary))] rounded-3xl"
      aria-label={post.caption ?? 'Ver contenido trending'}
    >
      <motion.div
        className="clay-card micro-lift relative w-40 sm:w-48 overflow-hidden rounded-3xl"
        whileHover={{ y: -4, scale: 1.02 }}
        transition={GYDI_SPRING}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: '9/16' }}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={post.caption ?? 'Contenido trending'}
              fill
              sizes="(max-width: 640px) 160px, 192px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)]" />
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

          {/* Creator info — bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {post.creatorAvatarUrl && (
              <div className="mb-2 flex items-center gap-1.5">
                <div className="h-5 w-5 shrink-0 overflow-hidden rounded-full border border-white/40">
                  <Image
                    src={post.creatorAvatarUrl}
                    alt={post.creatorDisplayName ?? 'Creator'}
                    width={20}
                    height={20}
                    className="object-cover"
                  />
                </div>
                {post.creatorDisplayName && (
                  <span className="truncate text-[10px] font-semibold text-white/80 leading-tight">
                    {post.creatorDisplayName}
                  </span>
                )}
              </div>
            )}

            {/* View count */}
            <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 w-fit backdrop-blur-sm">
              <Eye className="h-2.5 w-2.5 text-white/70" />
              <span className="text-[10px] font-bold text-white">
                {formatCount(post.viewCount)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function TrendingCardSkeleton() {
  return (
    <div className="snap-start shrink-0 w-40 sm:w-48">
      <Skeleton className="w-full rounded-3xl" style={{ aspectRatio: '9/16' }} />
    </div>
  );
}

export function HomeTrendingSection() {
  const shouldReduceMotion = useReducedMotion();
  const { data, isLoading } = useContentFeed();

  const posts = data?.pages?.[0]?.content?.slice(0, 8) ?? [];

  if (!isLoading && posts.length === 0) return null;

  return (
    <section
      className="bg-[hsl(var(--gydi-ink))] py-16 px-4 sm:px-8"
      aria-labelledby="trending-heading"
    >
      <div className="container mx-auto">
        {/* Header */}
        <FadeIn direction="up" delay={0}>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--gydi-primary))]/20 bg-[hsl(var(--gydi-primary))]/10 px-4 py-1.5 text-sm font-semibold text-[hsl(var(--gydi-primary))]">
                <TrendingUp className="h-4 w-4" />
                <span>Trending ahora</span>
              </div>
              <h2
                id="trending-heading"
                className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl bg-gradient-to-r from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)] bg-clip-text text-transparent"
              >
                Contenido Trending
              </h2>
            </div>

            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex shrink-0 bg-gradient-to-r from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)] font-semibold shadow-lg shadow-[hsl(252,100%,64%)]/30"
            >
              <Link href="/feed" className="flex items-center gap-2">
                Ver Feed Completo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        {/* Horizontal scroll carousel */}
        <FadeIn direction="up" delay={shouldReduceMotion ? 0 : 0.1}>
          <Stagger
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            staggerDelay={0.05}
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TrendingCardSkeleton key={i} />
                ))
              : posts.map((post) => (
                  <StaggerItem key={post.id} className="snap-start shrink-0">
                    <TrendingCard post={post} />
                  </StaggerItem>
                ))}
          </Stagger>
        </FadeIn>

        {/* Mobile CTA */}
        <FadeIn delay={shouldReduceMotion ? 0 : 0.2} className="mt-8 flex justify-center sm:hidden">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)] font-semibold shadow-lg shadow-[hsl(252,100%,64%)]/30"
          >
            <Link href="/feed" className="flex items-center gap-2">
              Ver Feed Completo
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
