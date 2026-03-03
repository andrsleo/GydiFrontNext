'use client';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type Locale = 'en' | 'es';

interface LocaleState {
  locale: Locale;
  _hasHydrated: boolean;
}

interface LocaleActions {
  setLocale: (locale: Locale) => void;
}

type LocaleStore = LocaleState & LocaleActions;

export const useLocaleStore = create<LocaleStore>()(
  devtools(
    persist(
      (set) => ({
        locale: 'en',
        _hasHydrated: false,
        setLocale: (locale) => set({ locale }),
      }),
      {
        name: 'locale-store',
        partialize: (state) => ({ locale: state.locale }),
        onRehydrateStorage: () => (state) => {
          if (state) state._hasHydrated = true;
        },
      }
    ),
    { name: 'LocaleStore' }
  )
);

export const selectLocale = (state: LocaleStore) => state.locale;
