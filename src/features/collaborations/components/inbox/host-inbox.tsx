'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PitchStatusBadge } from '../pitch/pitch-status-badge';
import { useHostInbox } from '../../hooks/use-host-inbox';
import { useAcceptPitch } from '../../hooks/use-accept-pitch';
import { useDeclinePitch } from '../../hooks/use-decline-pitch';
import type { InboxPitchItem } from '../../types';

const COMPENSATION_LABELS: Record<string, string> = {
  free_stay: 'Estadía gratis',
  cash: 'Efectivo',
  hybrid: 'Híbrido',
  affiliate: 'Comisión de afiliado',
  experience_exchange: 'Intercambio de experiencia',
};

function InboxItemCard({ item }: { item: InboxPitchItem }) {
  const { mutate: accept, isPending: accepting } = useAcceptPitch();
  const { mutate: decline, isPending: declining } = useDeclinePitch();
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const isPending = item.status === 'PENDING' || item.status === 'COUNTERED';

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-heading font-semibold text-base">{item.propertyTitle}</p>
            <p className="text-sm text-muted-foreground">
              {item.creatorDisplayName}
              {item.creatorVerified && (
                <Badge variant="secondary" className="ml-2 text-xs">Verificado</Badge>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.creatorFollowers.toLocaleString('es')} seguidores &bull;{' '}
              {(item.creatorEngagementRate * 100).toFixed(1)}% engagement &bull; Tier {item.creatorTier}
            </p>
          </div>
          <PitchStatusBadge status={item.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-muted-foreground">Compensacion:</span>
          <span>{COMPENSATION_LABELS[item.compensation.type] ?? item.compensation.type}</span>
        </div>
        <p className="text-sm text-muted-foreground">{item.deliverablesSummary}</p>

        {item.portfolioUrl && (
          <a
            href={item.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline text-[hsl(var(--gydi-primary))]"
          >
            Ver portfolio
          </a>
        )}

        <p className="text-xs text-muted-foreground">
          Expira: {new Date(item.expiresAt).toLocaleDateString('es', { dateStyle: 'medium' })}
        </p>

        {isPending && (
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button
              size="sm"
              className="min-h-11 flex-1 bg-[hsl(var(--gydi-primary))] text-white"
              disabled={accepting || declining}
              onClick={() => accept(item.pitchId)}
            >
              {accepting ? 'Aceptando...' : 'Aceptar'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="min-h-11 flex-1"
              disabled={accepting || declining}
              onClick={() => setShowDeclineInput((v) => !v)}
            >
              Rechazar
            </Button>
          </div>
        )}

        {showDeclineInput && (
          <div className="flex flex-col gap-2">
            <textarea
              className="w-full rounded-md border px-3 py-2 text-sm min-h-[80px] resize-none"
              placeholder="Motivo del rechazo (opcional)"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
            <Button
              size="sm"
              variant="destructive"
              className="min-h-11"
              disabled={declining}
              onClick={() => {
                decline(
                  { pitchId: item.pitchId, reason: declineReason },
                  { onSuccess: () => setShowDeclineInput(false) }
                );
              }}
            >
              {declining ? 'Rechazando...' : 'Confirmar rechazo'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function HostInbox() {
  const { data, isLoading, isError } = useHostInbox({ page: 0, size: 20 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-sm text-destructive">
        Error al cargar el inbox. Intenta de nuevo.
      </p>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        No tienes pitches en tu inbox.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {data.content.map((item) => (
        <InboxItemCard key={item.pitchId} item={item} />
      ))}
    </div>
  );
}
