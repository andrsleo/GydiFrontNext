'use client';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {
  getCurrencyForCountry,
  DEFAULT_CURRENCY_ENTRY,
  type SupportedCurrency,
} from '@/lib/constants/currency-config';

export type { SupportedCurrency };
/** @deprecated Use SupportedCurrency instead */
export type DisplayCurrency = SupportedCurrency;

interface CurrencyState {
  currency: SupportedCurrency;
  availableCurrencies: SupportedCurrency[];
  detectedCountry: string | null;
  /** True once user has explicitly clicked the selector */
  isManuallySet: boolean;
  _hasHydrated: boolean;
}

interface CurrencyActions {
  /** Manual selection — marks isManuallySet = true, locks out auto-detection */
  setCurrency: (currency: SupportedCurrency) => void;
  /**
   * Called once on app boot by CurrencyInitializer.
   * Sets availableCurrencies for the selector always.
   * Only changes the active currency if the user hasn't manually chosen one.
   */
  initFromCountry: (countryCode: string) => void;
}

type CurrencyStore = CurrencyState & CurrencyActions;

export const useCurrencyStore = create<CurrencyStore>()(
  devtools(
    persist(
      (set) => ({
        currency: DEFAULT_CURRENCY_ENTRY[0],
        availableCurrencies: DEFAULT_CURRENCY_ENTRY[1],
        detectedCountry: null,
        isManuallySet: false,
        _hasHydrated: false,

        setCurrency: (currency) =>
          set({ currency, isManuallySet: true }),

        initFromCountry: (countryCode) => {
          const { defaultCurrency, availableCurrencies } = getCurrencyForCountry(countryCode);
          set((state) => ({
            availableCurrencies,
            detectedCountry: countryCode,
            // Respect manual selection — only auto-set if untouched
            ...(state.isManuallySet ? {} : { currency: defaultCurrency }),
          }));
        },
      }),
      {
        name: 'currency-store',
        // Only persist the user's choice — re-detect country each session
        partialize: (state) => ({
          currency: state.currency,
          isManuallySet: state.isManuallySet,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) state._hasHydrated = true;
        },
      }
    ),
    { name: 'CurrencyStore' }
  )
);

export const selectCurrency = (state: CurrencyStore) => state.currency;
export const selectAvailableCurrencies = (state: CurrencyStore) =>
  state.availableCurrencies;
