'use client';

import { useState } from 'react';
import { Copy, Check, Share2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useReferralLinks } from '@/features/referrals/hooks/use-referral-links';
import { useReferralStats } from '@/features/referrals/hooks/use-referral-stats';
import { Skeleton } from '@/components/ui/skeleton';

export function CreatorReferralCard() {
  const { data: links, isLoading: isLoadingLinks } = useReferralLinks();
  const { data: stats, isLoading: isLoadingStats } = useReferralStats();
  const [copied, setCopied] = useState(false);

  const isLoading = isLoadingLinks || isLoadingStats;

  // Use the first active referral link as the creator's primary share URL
  const activeLink = links?.find((l) => l.status === 'ACTIVE');

  const handleCopy = async () => {
    if (!activeLink?.fullUrl) return;
    try {
      await navigator.clipboard.writeText(activeLink.fullUrl);
      setCopied(true);
      toast.success('¡Copiado!', { description: 'Link de referido copiado al portapapeles.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar el link.');
    }
  };

  const handleShare = async () => {
    if (!activeLink?.fullUrl) return;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'GYDI Properties',
          text: '¡Descubre propiedades increíbles en Latinoamérica con GYDI!',
          url: activeLink.fullUrl,
        });
      } catch {
        // User cancelled or share failed — no-op
      }
    } else {
      // Fallback: copy to clipboard
      await handleCopy();
    }
  };

  if (isLoading) {
    return (
      <div className="clay-card rounded-2xl border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 flex-1 rounded-xl" />
        </div>
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="clay-card rounded-2xl border bg-card p-5 space-y-4">
      <h2 className="font-heading text-base font-semibold">Tu link de referido</h2>

      {activeLink ? (
        <>
          {/* URL display */}
          <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2">
            <code className="flex-1 truncate text-xs text-muted-foreground select-all">
              {activeLink.fullUrl}
            </code>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Link copiado' : 'Copiar link de referido'}
              className="micro-press flex flex-1 items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2.5 text-sm font-medium min-h-[44px] transition-colors hover:bg-muted"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[hsl(var(--gydi-teal))]" aria-hidden="true" />
                  <span className="text-[hsl(var(--gydi-teal))]">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              aria-label="Compartir link de referido"
              className="micro-press flex flex-1 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--gydi-primary))] px-3 py-2.5 text-sm font-medium text-white min-h-[44px] transition-opacity hover:opacity-90"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              <span>Compartir</span>
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Genera un link de referido desde la sección de Referidos para empezar a compartir.
        </p>
      )}

      {/* Stat: referrals this month */}
      <div className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--gydi-teal))]/20 bg-[hsl(var(--gydi-teal))]/5 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--gydi-teal))]/15">
          <Users className="h-5 w-5 text-[hsl(var(--gydi-teal))]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Creators referidos este mes</p>
          <p className="text-2xl font-bold leading-none mt-0.5">
            {stats?.conversionsLast30Days ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
