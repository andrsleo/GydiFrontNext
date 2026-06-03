import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePriceDisplay, formatAmountWithCode } from '../use-price-display';

// Mock useCurrencyFormat — the underlying conversion + formatting hook
vi.mock('../use-currency-format', () => ({
  useCurrencyFormat: vi.fn(),
}));

import { useCurrencyFormat } from '../use-currency-format';

const mockFormatAmount = vi.fn();

beforeEach(() => {
  vi.mocked(useCurrencyFormat).mockReturnValue({
    formatAmount: mockFormatAmount,
    displayCurrency: 'USD',
    isLoading: false,
    isFallback: false,
  });
});

describe('usePriceDisplay', () => {
  it('returns formatted price with currency code appended', () => {
    mockFormatAmount.mockReturnValue('$121');
    const { result } = renderHook(() => usePriceDisplay(500_000, 'COP'));

    expect(mockFormatAmount).toHaveBeenCalledWith(500_000, 'COP');
    expect(result.current.formatted).toBe('$121 USD');
    expect(result.current.formattedNoCode).toBe('$121');
  });

  it('returns "--" for null amount', () => {
    const { result } = renderHook(() => usePriceDisplay(null, 'USD'));
    expect(result.current.formatted).toBe('--');
    expect(result.current.formattedNoCode).toBe('--');
    expect(mockFormatAmount).not.toHaveBeenCalled();
  });

  it('returns "--" for undefined amount', () => {
    const { result } = renderHook(() => usePriceDisplay(undefined, 'USD'));
    expect(result.current.formatted).toBe('--');
  });

  it('exposes displayCurrency from the store', () => {
    mockFormatAmount.mockReturnValue('$1,500');
    const { result } = renderHook(() => usePriceDisplay(1500, 'USD'));
    expect(result.current.displayCurrency).toBe('USD');
  });

  it('forwards isLoading state', () => {
    vi.mocked(useCurrencyFormat).mockReturnValue({
      formatAmount: mockFormatAmount,
      displayCurrency: 'USD',
      isLoading: true,
      isFallback: false,
    });
    mockFormatAmount.mockReturnValue('$1,500');
    const { result } = renderHook(() => usePriceDisplay(1500, 'USD'));
    expect(result.current.isLoading).toBe(true);
  });

  it('forwards isFallback state', () => {
    vi.mocked(useCurrencyFormat).mockReturnValue({
      formatAmount: mockFormatAmount,
      displayCurrency: 'USD',
      isLoading: false,
      isFallback: true,
    });
    mockFormatAmount.mockReturnValue('$1,500');
    const { result } = renderHook(() => usePriceDisplay(1500, 'USD'));
    expect(result.current.isFallback).toBe(true);
  });

  it('uses USD as default fromCurrency when not specified', () => {
    mockFormatAmount.mockReturnValue('$1,500');
    renderHook(() => usePriceDisplay(1500));
    expect(mockFormatAmount).toHaveBeenCalledWith(1500, 'USD');
  });
});

describe('formatAmountWithCode', () => {
  it('appends currency code to formatted amount', () => {
    expect(formatAmountWithCode('$1,500', 'USD')).toBe('$1,500 USD');
    expect(formatAmountWithCode('$150.000', 'COP')).toBe('$150.000 COP');
    expect(formatAmountWithCode('€99', 'EUR')).toBe('€99 EUR');
  });
});
