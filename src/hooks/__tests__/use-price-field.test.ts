import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePriceField } from '../use-price-field';

// Mock the currency store
vi.mock('@/store/currency-store', () => ({
  useCurrencyStore: vi.fn(),
}));

import { useCurrencyStore } from '@/store/currency-store';

describe('usePriceField', () => {
  beforeEach(() => {
    vi.mocked(useCurrencyStore).mockReturnValue({
      currency: 'COP',
    } as any);
  });

  it('returns currency code and symbol for COP', () => {
    const { result } = renderHook(() => usePriceField('per-night'));
    expect(result.current.code).toBe('COP');
    expect(result.current.symbol).toBe('$');
  });

  it('returns correct label for per-night field type', () => {
    const { result } = renderHook(() => usePriceField('per-night'));
    expect(result.current.label).toContain('COP');
  });

  it('returns correct label for sale field type', () => {
    const { result } = renderHook(() => usePriceField('sale'));
    expect(result.current.label).toContain('COP');
    expect(result.current.label.toLowerCase()).toContain('venta');
  });

  it('returns correct helperText with currency name', () => {
    const { result } = renderHook(() => usePriceField('per-night'));
    expect(result.current.helperText).toContain('Peso Colombiano');
    expect(result.current.helperText).toContain('COP');
  });

  it('updates reactively when currency changes to USD', () => {
    vi.mocked(useCurrencyStore).mockReturnValue({
      currency: 'USD',
    } as any);
    const { result } = renderHook(() => usePriceField('per-night'));
    expect(result.current.code).toBe('USD');
    expect(result.current.symbol).toBe('$');
  });

  it('returns sale-specific placeholder for sale field type', () => {
    const { result } = renderHook(() => usePriceField('sale'));
    expect(result.current.placeholder).not.toBe('');
  });
});
