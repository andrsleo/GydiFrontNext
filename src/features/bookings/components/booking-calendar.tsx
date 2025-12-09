'use client';

import { useState } from 'react';
import { parseISO, isBefore, isAfter, startOfDay, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { useBlockedDates } from '../hooks';
import { Button } from '@/components/ui/button';
import 'react-day-picker/dist/style.css';

interface BookingCalendarProps {
    propertyId: string;
    onDateSelect?: (dates: { from: Date; to: Date } | undefined) => void;
}

export function BookingCalendar({ propertyId, onDateSelect }: BookingCalendarProps) {
    const { data: blockedDates, isLoading } = useBlockedDates(propertyId);
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

    // Convert blocked date ranges to an array of Date objects
    const disabledDates = blockedDates?.flatMap(block => {
        const start = parseISO(block.startDate);
        const end = parseISO(block.endDate);
        const dates: Date[] = [];

        let current = new Date(start);
        while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return dates;
    }) ?? [];

    // Check if there are any blocked dates within a given range
    const hasBlockedDatesInRange = (from: Date, to: Date): boolean => {
        if (!blockedDates || blockedDates.length === 0) return false;

        const rangeStart = startOfDay(from);
        const rangeEnd = startOfDay(to);

        return disabledDates.some(blockedDate => {
            const blocked = startOfDay(blockedDate);
            // Check if blocked date falls within the range (inclusive)
            return blocked >= rangeStart && blocked <= rangeEnd;
        });
    };

    const handleSelect = (range: DateRange | undefined) => {
        // Handle clear/reset
        if (!range?.from) {
            setSelectedRange(undefined);
            onDateSelect?.(undefined);
            return;
        }

        // Check if we currently have a complete range (both from and to, and they're DIFFERENT)
        const currentlyHasCompleteRange = !!(
            selectedRange?.from &&
            selectedRange?.to &&
            selectedRange.from.getTime() !== selectedRange.to.getTime()
        );

        // If we already have a complete range, any click should reset and start fresh
        if (currentlyHasCompleteRange) {
            // The new clicked date could be in range.to (if react-day-picker extended the range)
            // or in range.from if it's a completely different date
            let newCheckInDate = range.from;

            // If range.to exists and is different from our current range.to,
            // that's likely the newly clicked date
            if (range.to && selectedRange.to &&
                range.to.getTime() !== selectedRange.to.getTime()) {
                newCheckInDate = range.to;
            } else if (range.from && selectedRange.from &&
                       range.from.getTime() !== selectedRange.from.getTime()) {
                newCheckInDate = range.from;
            }

            setSelectedRange({ from: newCheckInDate, to: undefined });
            onDateSelect?.(undefined);
            return;
        }

        // Check if from and to are the SAME date (first click in react-day-picker)
        const isSingleDateClick = range.from && range.to &&
            range.from.getTime() === range.to.getTime();

        // If it's a single date click, treat it as check-in only
        if (isSingleDateClick) {
            setSelectedRange({ from: range.from, to: undefined });
            onDateSelect?.(undefined);
            return;
        }

        // Case: Only check-in exists, no check-out yet
        if (range.from && !range.to) {
            setSelectedRange(range);
            onDateSelect?.(undefined);
            return;
        }

        // Case: Second click - completing the range (from and to are DIFFERENT)
        if (range.from && range.to && range.from.getTime() !== range.to.getTime()) {
            // Validate no blocked dates in range
            if (hasBlockedDatesInRange(range.from, range.to)) {
                setSelectedRange(undefined);
                onDateSelect?.(undefined);
                return;
            }

            setSelectedRange(range);
            onDateSelect?.({ from: range.from, to: range.to });
        }
    };

    const handleClearSelection = () => {
        setSelectedRange(undefined);
        onDateSelect?.(undefined);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <CalendarIcon className="animate-pulse h-8 w-8 text-muted-foreground" />
            </div>
        );
    }

    // Format selected dates for display
    const formatDateRange = () => {
        if (!selectedRange?.from) return null;

        const fromStr = format(selectedRange.from, "d 'de' MMMM", { locale: es });

        if (!selectedRange.to) {
            return (
                <div className="text-sm">
                    <span className="font-medium">Check-in:</span> {fromStr}
                </div>
            );
        }

        const toStr = format(selectedRange.to, "d 'de' MMMM 'de' yyyy", { locale: es });

        return (
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-medium">Check-in:</span> {fromStr}
                    </div>
                    <div>
                        <span className="font-medium">Check-out:</span> {toStr}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="booking-calendar w-full">
            <style jsx global>{`
        .booking-calendar .rdp {
          margin: 0 auto;
          --rdp-cell-size: 40px;
          --rdp-accent-color: hsl(var(--primary));
          --rdp-background-color: hsl(var(--primary) / 0.1);
        }
        
        .booking-calendar .rdp-months {
          justify-content: center;
        }
        
        .booking-calendar .rdp-month {
          width: 100%;
        }
        
        .booking-calendar .rdp-caption {
          margin-bottom: 1rem;
        }
        
        .booking-calendar .rdp-day_selected {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        
        .booking-calendar .rdp-day_disabled {
          opacity: 0.3;
          text-decoration: line-through;
        }
        
        .booking-calendar .rdp-day:hover:not(.rdp-day_disabled) {
          background-color: hsl(var(--accent));
        }
      `}</style>

            {/* Selected dates display */}
            {selectedRange?.from && (
                <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            {formatDateRange()}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearSelection}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex justify-center">
                <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={handleSelect}
                    disabled={[
                        { before: new Date() },
                        ...disabledDates,
                    ]}
                    numberOfMonths={1}
                    className="rounded-md border p-3"
                />
            </div>

            {blockedDates && blockedDates.length > 0 && (
                <div className="mt-3 space-y-1 text-center">
                    <p className="text-xs text-muted-foreground">
                        <span className="inline-block w-3 h-3 bg-muted rounded-sm mr-1 align-middle opacity-30"></span>
                        Fechas no disponibles
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-500">
                        ⚠️ No puedes seleccionar un rango que incluya fechas bloqueadas
                    </p>
                </div>
            )}
        </div>
    );
}
