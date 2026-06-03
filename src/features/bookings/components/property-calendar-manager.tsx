'use client';

import { useState } from 'react';
import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useBlockDates,
  usePropertyCalendar,
  useUnblockDate,
} from '../hooks/use-property-calendar';
import 'react-day-picker/dist/style.css';

interface PropertyCalendarManagerProps {
  propertyId: string;
  propertyTitle: string;
}

export function PropertyCalendarManager({
  propertyId,
  propertyTitle,
}: PropertyCalendarManagerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  const from = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const to = format(endOfMonth(addMonths(new Date(), 2)), 'yyyy-MM-dd');

  const { data: blockedDates = [] } = usePropertyCalendar(propertyId, from, to);
  const blockMutation = useBlockDates(propertyId);
  const unblockMutation = useUnblockDate(propertyId);

  // Convert string dates to Date objects for DayPicker modifiers
  const disabledDays = blockedDates.map((d) => new Date(d + 'T00:00:00'));

  const handleBlock = () => {
    if (!selectedRange?.from) return;

    const dates: string[] = [];
    let current = new Date(selectedRange.from);
    const end = selectedRange.to ?? selectedRange.from;

    while (current <= end) {
      dates.push(format(current, 'yyyy-MM-dd'));
      current = new Date(current.getTime() + 86_400_000);
    }

    blockMutation.mutate(dates, {
      onSuccess: () => setSelectedRange(undefined),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disponibilidad — {propertyTitle}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Las fechas en rojo están bloqueadas. Selecciona un rango para bloquear nuevas fechas.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={setSelectedRange}
          disabled={[{ before: new Date() }, ...disabledDays]}
          modifiers={{ blocked: disabledDays }}
          modifiersStyles={{
            blocked: { backgroundColor: '#fecaca', color: '#991b1b', borderRadius: '4px' },
          }}
          locale={es}
          numberOfMonths={2}
        />

        {selectedRange?.from && (
          <Button
            onClick={handleBlock}
            disabled={blockMutation.isPending}
            className="w-full"
          >
            {blockMutation.isPending
              ? 'Bloqueando...'
              : `Bloquear ${selectedRange.to ? 'rango' : 'fecha'} seleccionado`}
          </Button>
        )}

        {blockedDates.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Fechas bloqueadas manualmente:</p>
            <div className="flex flex-wrap gap-2">
              {blockedDates.slice(0, 30).map((date) => (
                <div
                  key={date}
                  className="flex items-center gap-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
                >
                  {format(new Date(date + 'T00:00:00'), 'dd MMM', { locale: es })}
                  <button
                    type="button"
                    onClick={() => unblockMutation.mutate(date)}
                    className="ml-1 hover:text-red-600 font-bold"
                    aria-label={`Desbloquear ${date}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
