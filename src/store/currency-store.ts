'use client';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type DisplayCurrency = 'USD' | 'EUR';

interface CurrencyState {
  currency: DisplayCurrency;
  _hasHydrated: boolean;
}

interface CurrencyActions {
  setCurrency: (currency: DisplayCurrency) => void;
  toggleCurrency: () => void;
}

type CurrencyStore = CurrencyState & CurrencyActions;

export const useCurrencyStore = create<CurrencyStore>()(
  devtools(
    persist(
      (set) => ({
        currency: 'USD',
        _hasHydrated: false,
        setCurrency: (currency) => set({ currency }),
        toggleCurrency: () =>
          set((state) => ({ currency: state.currency === 'USD' ? 'EUR' : 'USD' })),
      }),
      {
        name: 'currency-store',
        partialize: (state) => ({ currency: state.currency }),
        onRehydrateStorage: () => (state) => {
          if (state) state._hasHydrated = true;
        },
      }
    ),
    { name: 'CurrencyStore' }
  )
);

export const selectCurrency = (state: CurrencyStore) => state.currency;
