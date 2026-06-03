'use client';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type Locale = 'en' | 'es';

interface LocaleState {
  locale: Locale;
  /** True once user explicitly clicks a language button */
  isManuallySet: boolean;
  _hasHydrated: boolean;
}

interface LocaleActions {
  /** Manual selection — marks isManuallySet = true */
  setLocale: (locale: Locale) => void;
  /**
   * Called on app boot by CurrencyInitializer.
   * Only changes locale if user hasn't manually chosen one.
   */
  initLocaleFromCountry: (locale: Locale) => void;
}

type LocaleStore = LocaleState & LocaleActions;

export const useLocaleStore = create<LocaleStore>()(
  devtools(
    persist(
      (set) => ({
        locale: 'en',
        isManuallySet: false,
        _hasHydrated: false,

        setLocale: (locale) => set({ locale, isManuallySet: true }),

        initLocaleFromCountry: (locale) =>
          set((state) => (state.isManuallySet ? {} : { locale })),
      }),
      {
        name: 'locale-store',
        partialize: (state) => ({
          locale: state.locale,
          isManuallySet: state.isManuallySet,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) state._hasHydrated = true;
        },
      }
    ),
    { name: 'LocaleStore' }
  )
);

export const selectLocale = (state: LocaleStore) => state.locale;
