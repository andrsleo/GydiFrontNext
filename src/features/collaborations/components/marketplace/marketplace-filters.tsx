'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CompensationType } from '../../types';

const COMPENSATION_OPTIONS: { value: CompensationType | ''; label: string }[] = [
  { value: '', label: 'Todas las compensaciones' },
  { value: 'free_stay', label: 'Estadía gratis' },
  { value: 'cash', label: 'Pago en efectivo' },
  { value: 'hybrid', label: 'Híbrido' },
  { value: 'affiliate', label: 'Comisión de afiliado' },
  { value: 'experience_exchange', label: 'Intercambio de experiencia' },
];

export function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/colaboraciones?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="w-full sm:w-40">
        <Input
          placeholder="País"
          defaultValue={searchParams.get('country') ?? ''}
          className="min-h-11"
          onChange={(e) => updateFilter('country', e.target.value)}
        />
      </div>

      <div className="w-full sm:w-40">
        <Input
          placeholder="Ciudad"
          defaultValue={searchParams.get('city') ?? ''}
          className="min-h-11"
          onChange={(e) => updateFilter('city', e.target.value)}
        />
      </div>

      <div className="w-full sm:w-52">
        <Select
          value={searchParams.get('compensationType') ?? ''}
          onValueChange={(value) => updateFilter('compensationType', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-full min-h-11">
            <SelectValue placeholder="Tipo de compensación" />
          </SelectTrigger>
          <SelectContent>
            {COMPENSATION_OPTIONS.map((opt) => (
              <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="min-h-11"
        onClick={() => router.push('/colaboraciones')}
      >
        Limpiar filtros
      </Button>
    </div>
  );
}
