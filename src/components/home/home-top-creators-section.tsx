'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, Stagger, StaggerItem, GYDI_SPRING } from '@/lib/motion';
import { CreatorTierBadge } from '@/features/creator/components/creator-tier-badge';
import { useTopCreators } from '@/features/creator/hooks/use-top-creators';
import type { CreatorProfile } from '@/features/creator/types';

function fmtFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

interface CreatorCardProps {
  profile: CreatorProfile;
}

function CreatorCard({ profile }: CreatorCardProps) {
  const initials = profile.displayName
    ?.split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <Link
      href={`/creators/${String(profile.userId)}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--gydi-primary))] rounded-3xl"
      aria-label={`Ver perfil de ${profile.displayName ?? `Creator ${profile.userId}`}`}
    >
      <motion.div
        className="clay-card micro-lift w-44 sm:w-52 overflow-hidden rounded-3xl p-5 flex flex-col items-center gap-3 text-center"
        whileHover={{ y: -6, scale: 1.02 }}
        transition={GYDI_SPRING}
      >
        {/* Avatar */}
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[hsl(var(--gydi-primary))]/30 bg-[hsl(var(--gydi-primary))]/10 shrink-0">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.displayName ?? 'Creator'}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[hsl(var(--gydi-primary))]">
              {initials}
            </div>
          )}
        </div>

        {/* Name + verified */}
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="flex items-center gap-1">
            <span className="font-heading font-semibold text-sm text-foreground truncate max-w-[140px]">
              {profile.displayName ?? `Creator ${profile.userId}`}
            </span>
            {profile.isVerified && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-[hsl(var(--gydi-primary))]" />
            )}
          </div>
          <CreatorTierBadge tier={profile.tier} />
        </div>

        {/* Follower count */}
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            {fmtFollowers(profile.followerCount)}
          </span>{' '}
          seguidores
        </p>
      </motion.div>
    </Link>
  );
}

function CreatorCardSkeleton() {
  return (
    <div className="snap-start shrink-0 w-44 sm:w-52">
      <Skeleton className="w-full h-52 rounded-3xl" />
    </div>
  );
}

export function HomeTopCreatorsSection() {
  const shouldReduceMotion = useReducedMotion();
  const { data: creators, isLoading } = useTopCreators(6);

  if (!isLoading && (!creators || creators.length === 0)) return null;

  return (
    <section
      className="bg-[hsl(var(--gydi-ink))] py-16 px-4 sm:px-8"
      aria-labelledby="top-creators-heading"
    >
      <div className="container mx-auto">
        {/* Header */}
        <FadeIn direction="up" delay={0}>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--gydi-teal))]/20 bg-[hsl(var(--gydi-teal))]/10 px-4 py-1.5 text-sm font-semibold text-[hsl(var(--gydi-teal))]">
                <Sparkles className="h-4 w-4" />
                <span>Top Creators</span>
              </div>
              <h2
                id="top-creators-heading"
                className="font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              >
                Creators Destacados
              </h2>
            </div>

            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex shrink-0 bg-gradient-to-r from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)] font-semibold shadow-lg shadow-[hsl(252,100%,64%)]/30"
            >
              <Link href="/creators" className="flex items-center gap-2">
                Ver Todos los Creators
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        {/* Horizontal scroll carousel */}
        <FadeIn direction="up" delay={shouldReduceMotion ? 0 : 0.1}>
          <Stagger
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            staggerDelay={0.06}
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <CreatorCardSkeleton key={i} />
                ))
              : creators!.map((creator) => (
                  <StaggerItem key={creator.userId} className="snap-start shrink-0">
                    <CreatorCard profile={creator} />
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
            <Link href="/creators" className="flex items-center gap-2">
              Ver Todos los Creators
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
