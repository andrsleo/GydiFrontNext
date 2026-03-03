'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocaleStore } from '@/store/locale-store';
import { loadTranslations, get } from '@/i18n/index';
import type { TranslationNamespace, TranslationDict } from '@/i18n/types';

export function useTranslation(namespace: TranslationNamespace) {
  const locale = useLocaleStore((state) => state.locale);
  const [dict, setDict] = useState<TranslationDict>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    loadTranslations(locale, namespace).then((loaded) => {
      if (!cancelled) {
        setDict(loaded);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [locale, namespace]);

  const t = useCallback(
    (key: string, params?: Record<string, string>) => get(dict, key, params),
    [dict]
  );

  return { t, locale, isLoading };
}
