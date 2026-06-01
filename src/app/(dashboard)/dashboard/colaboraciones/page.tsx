'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PitchCard } from '@/features/collaborations/components/pitch/pitch-card';
import { useMyPitches } from '@/features/collaborations/hooks/use-my-pitches';
import type { PitchStatus } from '@/features/collaborations/types';

const STATUS_OPTIONS: { value: PitchStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'COUNTERED', label: 'Contraoferta' },
  { value: 'ACCEPTED', label: 'Aceptado' },
  { value: 'DECLINED', label: 'Rechazado' },
  { value: 'COMPLETED', label: 'Completado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

export default function MisColaboracionesPage() {
  const [status, setStatus] = useState<string>('');
  const { data, isLoading, isError } = useMyPitches({ status: status || undefined, size: 20 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Mis colaboraciones</h1>
          <p className="text-sm text-muted-foreground">
            Historial de pitches enviados a propiedades
          </p>
        </div>
        <div className="w-full sm:w-52">
          <Select value={status} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
            <SelectTrigger className="min-h-11">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-sm text-destructive py-12">
          Error al cargar tus colaboraciones. Intenta de nuevo.
        </p>
      )}

      {!isLoading && !isError && data && data.content.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="font-heading text-lg text-muted-foreground">
            No tienes pitches{status ? ' con este estado' : ''}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Explora el{' '}
            <a href="/colaboraciones" className="underline text-[hsl(var(--gydi-primary))]">
              marketplace
            </a>{' '}
            y envía tu primer pitch.
          </p>
        </div>
      )}

      {!isLoading && data && data.content.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.content.map((pitch) => (
            <PitchCard key={pitch.pitchId} pitch={pitch} />
          ))}
        </div>
      )}
    </div>
  );
}
