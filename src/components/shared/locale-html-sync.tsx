'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/store/locale-store';

export function LocaleHtmlSync() {
  const locale = useLocaleStore((state) => state.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
