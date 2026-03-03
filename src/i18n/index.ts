import type { Locale, TranslationNamespace, TranslationDict } from './types';

const cache = new Map<string, TranslationDict>();

export async function loadTranslations(
  locale: Locale,
  namespace: TranslationNamespace
): Promise<TranslationDict> {
  const key = `${locale}:${namespace}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const module = await import(`./locales/${locale}/${namespace}.json`);
    const dict = module.default as TranslationDict;
    cache.set(key, dict);
    return dict;
  } catch {
    if (locale !== 'en') {
      try {
        const fallback = await import(`./locales/en/${namespace}.json`);
        const dict = fallback.default as TranslationDict;
        cache.set(key, dict);
        return dict;
      } catch {
        return {};
      }
    }
    return {};
  }
}

export function get(
  dict: TranslationDict,
  key: string,
  params?: Record<string, string>
): string {
  const parts = key.split('.');
  let current: string | TranslationDict = dict;

  for (const part of parts) {
    if (typeof current !== 'object') return key;
    current = current[part];
  }

  if (typeof current !== 'string') return key;

  if (params) {
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replace(`{{${k}}}`, v),
      current
    );
  }
  return current;
}
