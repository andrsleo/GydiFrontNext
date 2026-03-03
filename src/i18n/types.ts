import type { Locale } from '@/store/locale-store';

export type { Locale };

export type TranslationNamespace =
  | 'common'
  | 'auth'
  | 'properties'
  | 'dashboard'
  | 'referrals'
  | 'earnings'
  | 'subscription'
  | 'settings'
  | 'admin'
  | 'landing'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'cookies';

export type TranslationDict = {
  [key: string]: string | TranslationDict;
};
