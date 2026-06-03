/**
 * Currency Configuration
 *
 * HOW GEO-DETECTION WORKS:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. User visits the site from any country
 * 2. Vercel edge network reads the real IP and injects header:
 *      x-vercel-ip-country: "MX"   (ISO 3166-1 alpha-2 code)
 * 3. middleware.ts reads the header (0ms — no external API call)
 * 4. Writes cookie: gydi-country=MX (24h TTL, readable by JS)
 * 5. CurrencyInitializer (client component) reads cookie on mount
 * 6. Calls initFromCountry("MX") on the Zustand store
 * 7. Store maps "MX" → defaultCurrency: MXN, availableCurrencies: [MXN, USD, EUR]
 * 8. PreferencesSelector shows the correct options for that country
 *
 * UNRECOGNIZED COUNTRIES:
 *   Any country not in COUNTRY_CURRENCY_MAP falls to DEFAULT_CURRENCY_ENTRY
 *   → USD + EUR. This is correct for international real estate buyers.
 *
 * ADDING NEW CURRENCIES:
 *   1. Add to SupportedCurrency type
 *   2. Add to CURRENCY_META (symbol, locale, decimals)
 *   3. Add to FALLBACK_RATES in exchange-rate/route.ts
 *   4. Add to SUPPORTED_CURRENCIES array in exchange-rate/route.ts
 *   5. Update COUNTRY_CURRENCY_MAP entries
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * SUPPORTED CURRENCIES (9):
 *   USD, EUR — universal references for international real estate
 *   MXN, COP, CLP, BRL, PEN — main LATAM markets
 *   CAD, GBP — major investor markets
 */

export type SupportedCurrency =
  | 'USD'
  | 'EUR'
  | 'MXN'
  | 'COP'
  | 'CLP'
  | 'BRL'
  | 'PEN'
  | 'CAD'
  | 'GBP';

export interface CurrencyMeta {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  /** BCP 47 locale tag — used for Intl.NumberFormat */
  locale: string;
  /** Fractional digits: CLP/COP = 0, others = 2 */
  decimals: number;
}

export const CURRENCY_META: Record<SupportedCurrency, CurrencyMeta> = {
  USD: { code: 'USD', symbol: '$',   name: 'US Dollar',      locale: 'en-US', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€',   name: 'Euro',            locale: 'de-DE', decimals: 2 },
  MXN: { code: 'MXN', symbol: '$',   name: 'Peso Mexicano',   locale: 'es-MX', decimals: 2 },
  COP: { code: 'COP', symbol: '$',   name: 'Peso Colombiano', locale: 'es-CO', decimals: 0 },
  CLP: { code: 'CLP', symbol: '$',   name: 'Peso Chileno',    locale: 'es-CL', decimals: 0 },
  BRL: { code: 'BRL', symbol: 'R$',  name: 'Real Brasileño',  locale: 'pt-BR', decimals: 2 },
  PEN: { code: 'PEN', symbol: 'S/',  name: 'Sol Peruano',     locale: 'es-PE', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£',   name: 'British Pound',   locale: 'en-GB', decimals: 2 },
};

/**
 * Country → [defaultCurrency, availableCurrencies[]]
 *
 * RULES:
 *  - Local currency supported → [local, USD, EUR]  or [local, EUR, USD]
 *  - Eurozone / EUR-native   → [EUR, USD]           (EUR before USD)
 *  - USD-native (dollarized) → [USD, EUR]
 *  - Volatile/restricted FX  → [USD, EUR]           (ARS, VES, CUP, etc.)
 *  - Country not listed      → DEFAULT_CURRENCY_ENTRY = [USD, EUR]
 *
 * Countries whose local currency is NOT in SupportedCurrency (JPY, AUD, INR…)
 * are mapped to [USD, EUR] — the universal reference for international buyers.
 * Add their currencies to SupportedCurrency + CURRENCY_META to enable local display.
 */
export const COUNTRY_CURRENCY_MAP: Record<string, [SupportedCurrency, SupportedCurrency[]]> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // NORTH AMERICA
  // ═══════════════════════════════════════════════════════════════════════════
  US: ['USD', ['USD', 'EUR']],
  CA: ['CAD', ['CAD', 'USD', 'EUR']],
  MX: ['MXN', ['MXN', 'USD', 'EUR']],

  // ═══════════════════════════════════════════════════════════════════════════
  // CENTRAL AMERICA & CARIBBEAN
  // ═══════════════════════════════════════════════════════════════════════════
  // Dollarized / USD official
  PA: ['USD', ['USD', 'EUR']], // Panama — fully dollarized
  SV: ['USD', ['USD', 'EUR']], // El Salvador — official since 2001
  EC: ['USD', ['USD', 'EUR']], // Ecuador — fully dollarized
  PR: ['USD', ['USD', 'EUR']], // Puerto Rico — US territory
  TC: ['USD', ['USD', 'EUR']], // Turks & Caicos — USD official
  // Local currency (not in SupportedCurrency → USD/EUR)
  GT: ['USD', ['USD', 'EUR']], // Guatemala — GTQ, but USD widely used
  HN: ['USD', ['USD', 'EUR']], // Honduras — HNL
  NI: ['USD', ['USD', 'EUR']], // Nicaragua — NIO
  CR: ['USD', ['USD', 'EUR']], // Costa Rica — CRC
  BZ: ['USD', ['USD', 'EUR']], // Belize — BZD pegged to USD
  // Caribbean
  DO: ['USD', ['USD', 'EUR']], // Dominican Republic — DOP
  JM: ['USD', ['USD', 'EUR']], // Jamaica — JMD
  TT: ['USD', ['USD', 'EUR']], // Trinidad & Tobago — TTD
  BB: ['USD', ['USD', 'EUR']], // Barbados — BBD pegged to USD
  HT: ['USD', ['USD', 'EUR']], // Haiti — HTG
  CU: ['USD', ['USD', 'EUR']], // Cuba — CUP (restricted)

  // ═══════════════════════════════════════════════════════════════════════════
  // SOUTH AMERICA
  // ═══════════════════════════════════════════════════════════════════════════
  CO: ['COP', ['COP', 'USD', 'EUR']],
  CL: ['CLP', ['CLP', 'USD', 'EUR']],
  BR: ['BRL', ['BRL', 'USD', 'EUR']],
  PE: ['PEN', ['PEN', 'USD', 'EUR']],
  AR: ['USD', ['USD', 'EUR']], // ARS — currency controls, blue-dollar rate, USD preferred
  VE: ['USD', ['USD', 'EUR']], // VES — hyperinflation, USD de facto
  UY: ['USD', ['USD', 'EUR']], // Uruguay — UYU but USD widely used in real estate
  PY: ['USD', ['USD', 'EUR']], // Paraguay — PYG
  BO: ['USD', ['USD', 'EUR']], // Bolivia — BOB
  GY: ['USD', ['USD', 'EUR']], // Guyana — GYD
  SR: ['USD', ['USD', 'EUR']], // Suriname — SRD

  // ═══════════════════════════════════════════════════════════════════════════
  // EUROPE — EUROZONE (EUR first, then USD)
  // ═══════════════════════════════════════════════════════════════════════════
  ES: ['EUR', ['EUR', 'USD']], // Spain
  PT: ['EUR', ['EUR', 'USD']], // Portugal
  FR: ['EUR', ['EUR', 'USD']], // France
  DE: ['EUR', ['EUR', 'USD']], // Germany
  IT: ['EUR', ['EUR', 'USD']], // Italy
  NL: ['EUR', ['EUR', 'USD']], // Netherlands
  BE: ['EUR', ['EUR', 'USD']], // Belgium
  AT: ['EUR', ['EUR', 'USD']], // Austria
  IE: ['EUR', ['EUR', 'USD']], // Ireland
  GR: ['EUR', ['EUR', 'USD']], // Greece
  FI: ['EUR', ['EUR', 'USD']], // Finland
  LU: ['EUR', ['EUR', 'USD']], // Luxembourg
  SK: ['EUR', ['EUR', 'USD']], // Slovakia
  SI: ['EUR', ['EUR', 'USD']], // Slovenia
  EE: ['EUR', ['EUR', 'USD']], // Estonia
  LV: ['EUR', ['EUR', 'USD']], // Latvia
  LT: ['EUR', ['EUR', 'USD']], // Lithuania
  CY: ['EUR', ['EUR', 'USD']], // Cyprus
  MT: ['EUR', ['EUR', 'USD']], // Malta
  HR: ['EUR', ['EUR', 'USD']], // Croatia — joined Eurozone Jan 2023
  AD: ['EUR', ['EUR', 'USD']], // Andorra — uses EUR de facto
  MC: ['EUR', ['EUR', 'USD']], // Monaco — uses EUR de facto
  SM: ['EUR', ['EUR', 'USD']], // San Marino — uses EUR de facto
  VA: ['EUR', ['EUR', 'USD']], // Vatican — uses EUR de facto

  // ── Europe non-Eurozone (local currency not supported → EUR/USD)
  GB: ['GBP', ['GBP', 'EUR', 'USD']],
  GG: ['GBP', ['GBP', 'EUR', 'USD']], // Guernsey
  JE: ['GBP', ['GBP', 'EUR', 'USD']], // Jersey
  IM: ['GBP', ['GBP', 'EUR', 'USD']], // Isle of Man
  CH: ['EUR', ['EUR', 'USD']],         // Switzerland — CHF, but EUR/USD best for intl buyers
  SE: ['EUR', ['EUR', 'USD']],         // Sweden — SEK
  NO: ['EUR', ['EUR', 'USD']],         // Norway — NOK
  DK: ['EUR', ['EUR', 'USD']],         // Denmark — DKK (pegged to EUR)
  IS: ['EUR', ['EUR', 'USD']],         // Iceland — ISK
  PL: ['EUR', ['EUR', 'USD']],         // Poland — PLN
  CZ: ['EUR', ['EUR', 'USD']],         // Czech Republic — CZK
  HU: ['EUR', ['EUR', 'USD']],         // Hungary — HUF
  RO: ['EUR', ['EUR', 'USD']],         // Romania — RON
  BG: ['EUR', ['EUR', 'USD']],         // Bulgaria — BGN (pegged to EUR)
  RS: ['EUR', ['EUR', 'USD']],         // Serbia — RSD
  BA: ['EUR', ['EUR', 'USD']],         // Bosnia — BAM (pegged to EUR)
  AL: ['EUR', ['EUR', 'USD']],         // Albania — ALL
  MK: ['EUR', ['EUR', 'USD']],         // North Macedonia — MKD
  ME: ['EUR', ['EUR', 'USD']],         // Montenegro — uses EUR de facto
  XK: ['EUR', ['EUR', 'USD']],         // Kosovo — uses EUR de facto
  TR: ['USD', ['USD', 'EUR']],         // Turkey — TRY (volatile, high inflation)
  UA: ['USD', ['USD', 'EUR']],         // Ukraine — UAH
  BY: ['USD', ['USD', 'EUR']],         // Belarus — BYN (restricted)
  RU: ['USD', ['USD', 'EUR']],         // Russia — RUB (sanctioned)
  MD: ['EUR', ['EUR', 'USD']],         // Moldova — MDL
  GE: ['USD', ['USD', 'EUR']],         // Georgia — GEL
  AM: ['USD', ['USD', 'EUR']],         // Armenia — AMD
  AZ: ['USD', ['USD', 'EUR']],         // Azerbaijan — AZN

  // ═══════════════════════════════════════════════════════════════════════════
  // MIDDLE EAST (most pegged to USD)
  // ═══════════════════════════════════════════════════════════════════════════
  AE: ['USD', ['USD', 'EUR']], // UAE — AED pegged to USD
  SA: ['USD', ['USD', 'EUR']], // Saudi Arabia — SAR pegged to USD
  QA: ['USD', ['USD', 'EUR']], // Qatar — QAR pegged to USD
  KW: ['USD', ['USD', 'EUR']], // Kuwait — KWD (pegged, strong)
  BH: ['USD', ['USD', 'EUR']], // Bahrain — BHD pegged to USD
  OM: ['USD', ['USD', 'EUR']], // Oman — OMR pegged to USD
  JO: ['USD', ['USD', 'EUR']], // Jordan — JOD pegged to USD
  LB: ['USD', ['USD', 'EUR']], // Lebanon — LBP (crisis, USD preferred)
  IL: ['USD', ['USD', 'EUR']], // Israel — ILS
  IR: ['USD', ['USD', 'EUR']], // Iran — IRR (sanctioned)
  IQ: ['USD', ['USD', 'EUR']], // Iraq — IQD
  SY: ['USD', ['USD', 'EUR']], // Syria — SYP

  // ═══════════════════════════════════════════════════════════════════════════
  // AFRICA
  // ═══════════════════════════════════════════════════════════════════════════
  ZA: ['USD', ['USD', 'EUR']], // South Africa — ZAR
  NG: ['USD', ['USD', 'EUR']], // Nigeria — NGN
  EG: ['USD', ['USD', 'EUR']], // Egypt — EGP
  MA: ['EUR', ['EUR', 'USD']], // Morocco — MAD (EUR more relevant, French ties)
  KE: ['USD', ['USD', 'EUR']], // Kenya — KES
  ET: ['USD', ['USD', 'EUR']], // Ethiopia — ETB
  GH: ['USD', ['USD', 'EUR']], // Ghana — GHS
  TZ: ['USD', ['USD', 'EUR']], // Tanzania — TZS
  UG: ['USD', ['USD', 'EUR']], // Uganda — UGX
  SN: ['EUR', ['EUR', 'USD']], // Senegal — XOF (pegged to EUR)
  CI: ['EUR', ['EUR', 'USD']], // Côte d'Ivoire — XOF (pegged to EUR)
  CM: ['EUR', ['EUR', 'USD']], // Cameroon — XAF (pegged to EUR)
  TN: ['EUR', ['EUR', 'USD']], // Tunisia — TND (EUR more relevant)
  DZ: ['EUR', ['EUR', 'USD']], // Algeria — DZD (EUR more relevant)
  LY: ['USD', ['USD', 'EUR']], // Libya — LYD
  AO: ['USD', ['USD', 'EUR']], // Angola — AOA
  MZ: ['USD', ['USD', 'EUR']], // Mozambique — MZN
  ZW: ['USD', ['USD', 'EUR']], // Zimbabwe — USD official

  // ═══════════════════════════════════════════════════════════════════════════
  // ASIA PACIFIC
  // ═══════════════════════════════════════════════════════════════════════════
  // East Asia (local currencies not in SupportedCurrency → USD/EUR)
  JP: ['USD', ['USD', 'EUR']], // Japan — JPY (add to SupportedCurrency to enable)
  CN: ['USD', ['USD', 'EUR']], // China — CNY (restricted for intl)
  KR: ['USD', ['USD', 'EUR']], // South Korea — KRW
  TW: ['USD', ['USD', 'EUR']], // Taiwan — TWD
  HK: ['USD', ['USD', 'EUR']], // Hong Kong — HKD pegged to USD
  MO: ['USD', ['USD', 'EUR']], // Macao — MOP pegged to HKD
  // Southeast Asia
  SG: ['USD', ['USD', 'EUR']], // Singapore — SGD (strong, USD widely used)
  MY: ['USD', ['USD', 'EUR']], // Malaysia — MYR
  TH: ['USD', ['USD', 'EUR']], // Thailand — THB
  ID: ['USD', ['USD', 'EUR']], // Indonesia — IDR
  PH: ['USD', ['USD', 'EUR']], // Philippines — PHP
  VN: ['USD', ['USD', 'EUR']], // Vietnam — VND
  MM: ['USD', ['USD', 'EUR']], // Myanmar — MMK
  KH: ['USD', ['USD', 'EUR']], // Cambodia — USD widely used officially
  LA: ['USD', ['USD', 'EUR']], // Laos — LAK
  // South Asia
  IN: ['USD', ['USD', 'EUR']], // India — INR
  PK: ['USD', ['USD', 'EUR']], // Pakistan — PKR
  BD: ['USD', ['USD', 'EUR']], // Bangladesh — BDT
  LK: ['USD', ['USD', 'EUR']], // Sri Lanka — LKR
  NP: ['USD', ['USD', 'EUR']], // Nepal — NPR
  // Central Asia
  KZ: ['USD', ['USD', 'EUR']], // Kazakhstan — KZT
  UZ: ['USD', ['USD', 'EUR']], // Uzbekistan — UZS
  // Oceania
  AU: ['USD', ['USD', 'EUR']], // Australia — AUD (add to SupportedCurrency to enable)
  NZ: ['USD', ['USD', 'EUR']], // New Zealand — NZD
  FJ: ['USD', ['USD', 'EUR']], // Fiji — FJD
};

/**
 * Conservative fallback exchange rates: 1 USD = N units.
 * Used when the live exchange rate API hasn't loaded yet.
 * Mirrors the values in src/app/api/exchange-rate/route.ts — keep in sync.
 */
export const FALLBACK_RATES: Record<SupportedCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  MXN: 17.1,
  COP: 4100,
  CLP: 930,
  BRL: 5.1,
  PEN: 3.75,
  CAD: 1.36,
  GBP: 0.79,
};

/**
 * Fallback for any country not in the map above.
 * USD + EUR covers virtually all international real estate transactions.
 */
export const DEFAULT_CURRENCY_ENTRY: [SupportedCurrency, SupportedCurrency[]] = [
  'USD',
  ['USD', 'EUR'],
];

/**
 * Returns the default currency and available selector options for a given country.
 * Any country not in COUNTRY_CURRENCY_MAP gets USD + EUR.
 */
export function getCurrencyForCountry(countryCode: string): {
  defaultCurrency: SupportedCurrency;
  availableCurrencies: SupportedCurrency[];
} {
  const entry =
    COUNTRY_CURRENCY_MAP[countryCode.toUpperCase()] ?? DEFAULT_CURRENCY_ENTRY;
  return { defaultCurrency: entry[0], availableCurrencies: entry[1] };
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE DETECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ISO 3166-1 alpha-2 codes for Spanish-speaking countries.
 * Source: official Spanish-speaking nations + territories.
 * Any country NOT in this set defaults to English.
 */
const SPANISH_SPEAKING_COUNTRIES = new Set([
  // Latin America
  'MX', // Mexico
  'CO', // Colombia
  'CL', // Chile
  'PE', // Peru
  'AR', // Argentina
  'VE', // Venezuela
  'EC', // Ecuador
  'PA', // Panama
  'SV', // El Salvador
  'GT', // Guatemala
  'HN', // Honduras
  'NI', // Nicaragua
  'CR', // Costa Rica
  'DO', // Dominican Republic
  'CU', // Cuba
  'UY', // Uruguay
  'PY', // Paraguay
  'BO', // Bolivia
  'PR', // Puerto Rico
  // Europe
  'ES', // Spain
  // Africa
  'GQ', // Equatorial Guinea (Spanish official)
  'EH', // Western Sahara
]);

/**
 * Returns 'es' for Spanish-speaking countries, 'en' for everything else.
 * Used by CurrencyInitializer to pre-select the UI language on first visit.
 */
export function getLocaleForCountry(countryCode: string): 'en' | 'es' {
  return SPANISH_SPEAKING_COUNTRIES.has(countryCode.toUpperCase()) ? 'es' : 'en';
}
