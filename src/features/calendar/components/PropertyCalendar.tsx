'use client';
import { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, CalendarDays, Grid3X3, DollarSign } from 'lucide-react';
import { useCalendarMonth } from '../hooks/use-calendar-month';
import { useBlockDates } from '../hooks/use-block-dates';
import { useUnblockDate } from '../hooks/use-unblock-date';
import { useSetCustomPrice } from '../hooks/use-set-custom-price';
import { CalendarDayCell } from './CalendarDayCell';
import type { CellLabels } from './CalendarDayCell';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { useCurrencyStore, selectCurrency } from '@/store/currency-store';
import { useLocaleStore, selectLocale } from '@/store/locale-store';
import { CURRENCY_META, FALLBACK_RATES } from '@/lib/constants/currency-config';
import type { SupportedCurrency } from '@/lib/constants/currency-config';
import { useExchangeRate } from '@/hooks/use-exchange-rate';

interface PropertyCalendarProps {
  propertyId: number;
  /**
   * Moneda original en la que están almacenados los precios de la propiedad
   * (viene del DTO backend, campo `currency`).
   *
   * Se usa para:
   *  1. Pasar a CalendarDayCell para que convierta a la moneda del usuario.
   *  2. Enviar al backend en SetCustomPricePayload (los precios custom se guardan
   *     en la moneda original de la propiedad, no en la moneda de display).
   *  3. Mostrar el símbolo correcto en el input de precio custom.
   *
   * NO se usa para formatear precios en la UI (eso lo hace useCurrencyFormat).
   */
  currency: SupportedCurrency;
  isHost?: boolean;
  onDateSelect?: (dates: string[]) => void;
}

type SelectionMode = 'range' | 'individual';

function CalendarSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-6 bg-muted rounded" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, col) => (
            <div key={col} className="h-[44px] bg-muted rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

function getDateRange(a: string, b: string): string[] {
  const start = new Date(a + 'T00:00:00');
  const end = new Date(b + 'T00:00:00');
  const [from, to] = start <= end ? [start, end] : [end, start];
  const dates: string[] = [];
  const cur = new Date(from);
  while (cur <= to) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export function PropertyCalendar({
  propertyId,
  currency,
  isHost,
  onDateSelect,
}: PropertyCalendarProps) {
  const { t, locale } = useTranslation('calendar');

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  // Selection mode toggle
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('range');

  // Range mode state
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Confirmed selection (both modes)
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  // Custom price panel
  const [showPricePanel, setShowPricePanel] = useState(false);
  const [customPriceValue, setCustomPriceValue] = useState('');
  const [priceError, setPriceError] = useState('');

  const { data, isLoading, isError } = useCalendarMonth(propertyId, currentYear, currentMonth);
  const blockMutation = useBlockDates(propertyId, currentYear, currentMonth);
  const unblockMutation = useUnblockDate(propertyId, currentYear, currentMonth);
  const customPriceMutation = useSetCustomPrice(propertyId, currentYear, currentMonth);

  const displayCurrency = useCurrencyStore(selectCurrency);
  const displayCurrencyMeta = CURRENCY_META[displayCurrency] ?? CURRENCY_META['USD'];
  // Month name uses the UI language selected in the header, not the currency locale.
  const uiLocale = useLocaleStore(selectLocale);
  const formatLocale = uiLocale === 'es' ? 'es-419' : 'en-US';

  const dayMap = useMemo(() => {
    if (!data) return new Map();
    return new Map(data.days.map((d) => [d.date, d]));
  }, [data]);

  const gridDates = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const startPad = firstDay.getDay();
    const dates: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) {
      const d = new Date(firstDay);
      d.setDate(d.getDate() - (startPad - i));
      dates.push(d);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      dates.push(new Date(currentYear, currentMonth - 1, d));
    }
    const remaining = (7 - (dates.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(lastDay);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [currentYear, currentMonth]);

  const previewSet = useMemo<Set<string>>(() => {
    if (selectionMode !== 'range' || !rangeStart || !hoveredDate) return new Set();
    return new Set(getDateRange(rangeStart, hoveredDate));
  }, [selectionMode, rangeStart, hoveredDate]);

  const selectedBlockedDates = useMemo(
    () => Array.from(selectedDates).filter((d) => dayMap.get(d)?.status === 'BLOCKED'),
    [selectedDates, dayMap],
  );

  const selectedAvailableDates = useMemo(
    () =>
      Array.from(selectedDates).filter((d) => {
        const s = dayMap.get(d)?.status;
        return s === 'AVAILABLE' || s === 'MAINTENANCE' || s == null;
      }),
    [selectedDates, dayMap],
  );

  // i18n: day headers from locale
  const DAY_HEADERS = [
    t('days.sun'),
    t('days.mon'),
    t('days.tue'),
    t('days.wed'),
    t('days.thu'),
    t('days.fri'),
    t('days.sat'),
  ];

  // i18n: cell labels (computed once, passed to every cell)
  const cellLabels: CellLabels = {
    blocked: t('cell.blocked'),
    reserved: t('cell.reserved'),
    maintenance: t('cell.maintenance'),
    rangeStart: t('cell.rangeStart'),
  };

  // Exchange rates for converting user-entered display-currency amount → property currency.
  // Falls back to FALLBACK_RATES so conversion always runs, even before rates load.
  const { data: exchangeRatesData } = useExchangeRate();
  const activeRates = exchangeRatesData?.rates ?? FALLBACK_RATES;

  // Label del mes usa el locale de la moneda del usuario (no de la propiedad)
  const monthLabel = new Date(currentYear, currentMonth - 1).toLocaleString(formatLocale, {
    month: 'long',
    year: 'numeric',
  });


  function clearAll() {
    setSelectedDates(new Set());
    setRangeStart(null);
    setHoveredDate(null);
    setShowPricePanel(false);
    setCustomPriceValue('');
    setPriceError('');
    onDateSelect?.([]);
  }

  function changeMonth(delta: number) {
    clearAll();
    setCurrentMonth((m) => {
      const next = m + delta;
      if (next < 1) { setCurrentYear((y) => y - 1); return 12; }
      if (next > 12) { setCurrentYear((y) => y + 1); return 1; }
      return next;
    });
  }

  function handleModeSwitch(mode: SelectionMode) {
    setSelectionMode(mode);
    clearAll();
  }

  // ── Individual mode: toggle single date ───────────────────────────────────
  function handleIndividualClick(dateStr: string) {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      onDateSelect?.(Array.from(next));
      return next;
    });
  }

  // ── Range mode: start → hover → confirm ──────────────────────────────────
  const handleRangeClick = useCallback(
    (dateStr: string) => {
      if (!rangeStart) {
        setRangeStart(dateStr);
        setSelectedDates(new Set());
      } else {
        const range = new Set(getDateRange(rangeStart, dateStr));
        setSelectedDates(range);
        onDateSelect?.(Array.from(range));
        setRangeStart(null);
        setHoveredDate(null);
      }
    },
    [rangeStart, onDateSelect],
  );

  const handleDayClick = selectionMode === 'range' ? handleRangeClick : handleIndividualClick;

  const handleDayHover = useCallback(
    (dateStr: string) => {
      if (selectionMode === 'range' && rangeStart) setHoveredDate(dateStr);
    },
    [selectionMode, rangeStart],
  );

  // ── Actions ───────────────────────────────────────────────────────────────
  async function handleBlock() {
    if (!selectedAvailableDates.length) return;
    await blockMutation.mutateAsync({ dates: selectedAvailableDates });
    clearAll();
  }

  async function handleUnblock() {
    if (!selectedBlockedDates.length) return;
    await Promise.all(selectedBlockedDates.map((d) => unblockMutation.mutateAsync(d)));
    clearAll();
  }

  async function handleApplyCustomPrice() {
    const amount = parseFloat(customPriceValue);
    if (isNaN(amount) || amount <= 0) {
      setPriceError(t('actions.priceError'));
      return;
    }
    setPriceError('');
    const dates = Array.from(selectedDates);

    // Convert from display currency → property's stored currency before saving.
    // All prices must be in property currency so backend aggregation (booking totals) works.
    // Formula: amount * rates[to] / rates[from]  (rates = "1 USD = N units")
    const amountToSave =
      displayCurrency !== currency
        ? (amount * activeRates[currency]) / activeRates[displayCurrency]
        : amount;

    await Promise.all(
      dates.map((date) =>
        customPriceMutation.mutateAsync({ date, amount: amountToSave, currency }),
      ),
    );
    clearAll();
  }

  const isMutating =
    blockMutation.isPending || unblockMutation.isPending || customPriceMutation.isPending;

  const selectionCount = rangeStart
    ? hoveredDate
      ? previewSet.size
      : 1
    : selectedDates.size;

  return (
    <div
      className="w-full space-y-3"
      onMouseLeave={() => selectionMode === 'range' && rangeStart && setHoveredDate(null)}
    >
      {/* Mode toggle */}
      {isHost && (
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl w-fit">
          <button
            onClick={() => handleModeSwitch('range')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px]',
              selectionMode === 'range'
                ? 'bg-card text-[hsl(var(--gydi-primary))] shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            {t('mode.range')}
          </button>
          <button
            onClick={() => handleModeSwitch('individual')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px]',
              selectionMode === 'individual'
                ? 'bg-card text-[hsl(var(--gydi-primary))] shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            {t('mode.individual')}
          </button>
        </div>
      )}

      {/* Month header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => changeMonth(-1)}
          aria-label={t('calendar.prevMonth')}
          className="p-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="text-center">
          <h3 className="font-heading text-sm font-semibold capitalize text-foreground md:text-base flex items-center justify-center gap-1.5">
            <span>
              {new Date(currentYear, currentMonth - 1).toLocaleString(formatLocale, { month: 'long' })}
            </span>
            <span className="relative inline-flex items-center gap-0.5 border-b border-dashed border-muted-foreground/50 hover:border-[hsl(var(--gydi-primary))] transition-colors group">
              <select
                value={currentYear}
                onChange={(e) => {
                  clearAll();
                  setCurrentYear(Number(e.target.value));
                }}
                className="bg-transparent font-heading text-sm font-semibold text-foreground md:text-base cursor-pointer focus:outline-none group-hover:text-[hsl(var(--gydi-primary))] transition-colors appearance-none"
                aria-label={t('calendar.selectYear')}
              >
                {Array.from({ length: 6 }, (_, i) => today.getFullYear() - 1 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-muted-foreground/60 group-hover:text-[hsl(var(--gydi-primary))] transition-colors pointer-events-none" />
            </span>
          </h3>
          {data && (
            <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--gydi-gold)/0.15)] text-[hsl(var(--gydi-gold))] font-medium">
                {t('calendar.seasonHigh')} ×{data.seasonPricing.high}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--gydi-primary)/0.10)] text-[hsl(var(--gydi-primary))] font-medium">
                {t('calendar.seasonMedium')} ×{data.seasonPricing.medium}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--gydi-teal)/0.12)] text-[hsl(var(--gydi-teal))] font-medium">
                {t('calendar.seasonLow')} ×{data.seasonPricing.low}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => changeMonth(1)}
          aria-label={t('calendar.nextMonth')}
          className="p-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Range selection hint */}
      {isHost && selectionMode === 'range' && (
        <p className="text-[11px] text-muted-foreground text-center">
          {rangeStart
            ? hoveredDate
              ? t(
                  selectionCount === 1 ? 'hint.rangeConfirmOne' : 'hint.rangeConfirmMany',
                  { count: String(selectionCount) },
                )
              : t('hint.rangeHover')
            : t('hint.rangeStart')}
        </p>
      )}
      {isHost && selectionMode === 'individual' && (
        <p className="text-[11px] text-muted-foreground text-center">
          {t('hint.individual')}
        </p>
      )}

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_HEADERS.map((day, i) => (
          <div
            key={i}
            className="text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wide py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar body */}
      {isLoading ? (
        <CalendarSkeleton />
      ) : isError ? (
        <div className="flex items-center justify-center h-48 text-sm text-destructive">
          {t('calendar.errorLoading')}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {gridDates.map((date, idx) => {
            if (!date) return <div key={idx} />;
            const dateStr = date.toISOString().split('T')[0];
            const isCurrentMonth =
              date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
            const day = isCurrentMonth ? (dayMap.get(dateStr) ?? null) : null;

            const isSelected = selectedDates.has(dateStr);
            const isRangeStartDay = selectionMode === 'range' && rangeStart === dateStr;
            const isInRange =
              selectionMode === 'range' && rangeStart
                ? previewSet.has(dateStr) && !isRangeStartDay
                : false;

            return (
              <CalendarDayCell
                key={dateStr}
                day={day}
                date={date}
                isCurrentMonth={isCurrentMonth}
                isSelected={isSelected}
                isRangeStart={isRangeStartDay}
                isInRange={isInRange}
                isHost={isHost}
                propertyCurrency={currency}
                labels={cellLabels}
                onClick={handleDayClick}
                onMouseEnter={handleDayHover}
              />
            );
          })}
        </div>
      )}

      {/* Action bar — shown when dates confirmed */}
      {isHost && selectedDates.size > 0 && (
        <div className="space-y-3 p-3 bg-[hsl(var(--gydi-primary)/0.04)] rounded-xl border border-[hsl(var(--gydi-primary)/0.15)]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground font-medium">
              {t(
                selectedDates.size === 1 ? 'actions.selectedOne' : 'actions.selectedMany',
                { count: String(selectedDates.size) },
              )}
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors min-h-[44px] px-1 flex items-center"
            >
              {t('actions.clear')}
            </button>
          </div>

          {/* Block / Unblock */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedAvailableDates.length > 0 && (
              <button
                onClick={handleBlock}
                disabled={isMutating}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors min-h-[44px] micro-press',
                  'bg-[hsl(var(--gydi-primary))] hover:opacity-90',
                  isMutating && 'opacity-60',
                )}
              >
                {blockMutation.isPending
                  ? t('actions.blocking')
                  : `${t('actions.block')} (${selectedAvailableDates.length})`}
              </button>
            )}
            {selectedBlockedDates.length > 0 && (
              <button
                onClick={handleUnblock}
                disabled={isMutating}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] micro-press',
                  'bg-card border border-border text-foreground hover:bg-muted',
                  isMutating && 'opacity-60',
                )}
              >
                {unblockMutation.isPending
                  ? t('actions.unblocking')
                  : `${t('actions.unblock')} (${selectedBlockedDates.length})`}
              </button>
            )}
            <button
              onClick={() => setShowPricePanel((v) => !v)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] micro-press',
                showPricePanel
                  ? 'bg-[hsl(var(--gydi-teal)/0.15)] text-[hsl(var(--gydi-teal))] border border-[hsl(var(--gydi-teal)/0.3)]'
                  : 'bg-card border border-border text-foreground hover:bg-muted',
              )}
            >
              <DollarSign className="w-3.5 h-3.5" />
              {t('actions.price')}
            </button>
          </div>

          {/* Custom price panel */}
          {showPricePanel && (
            <div className="pt-2 border-t border-[hsl(var(--gydi-primary)/0.12)] space-y-2">
              <p className="text-xs text-muted-foreground">
                {t('actions.priceHint', { count: String(selectedDates.size) })}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1 border border-border rounded-lg px-2.5 py-1.5 bg-card focus-within:ring-2 focus-within:ring-[hsl(var(--gydi-primary))]">
                  <span className="text-sm text-muted-foreground font-medium">
                    {displayCurrencyMeta.symbol}
                  </span>
                  <span className="text-xs text-muted-foreground/60">{displayCurrency}</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="0"
                    value={customPriceValue}
                    onChange={(e) => {
                      setCustomPriceValue(e.target.value);
                      setPriceError('');
                    }}
                    className="flex-1 text-sm outline-none bg-transparent min-w-0"
                    aria-label={t('actions.priceLabel')}
                  />
                </div>
                <button
                  onClick={handleApplyCustomPrice}
                  disabled={isMutating || !customPriceValue}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium text-white min-h-[44px] transition-colors micro-press',
                    'bg-[hsl(var(--gydi-teal))] hover:opacity-90',
                    (isMutating || !customPriceValue) && 'opacity-60',
                  )}
                >
                  {customPriceMutation.isPending ? t('actions.priceApplying') : t('actions.priceApply')}
                </button>
              </div>
              {priceError && <p className="text-xs text-destructive">{priceError}</p>}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-card border border-border" />
          <span className="text-[11px] text-muted-foreground">{t('legend.available')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <span className="text-[11px] text-muted-foreground">{t('legend.blocked')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-destructive/10 border border-destructive/20" />
          <span className="text-[11px] text-muted-foreground">{t('legend.reserved')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[hsl(var(--gydi-primary)/0.2)] border border-[hsl(var(--gydi-primary)/0.4)]" />
          <span className="text-[11px] text-muted-foreground">{t('legend.selected')}</span>
        </div>
      </div>
    </div>
  );
}
