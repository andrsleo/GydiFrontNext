/**
 * Profile Form Options
 *
 * Constants for gender, countries, and languages used in profile forms.
 */

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Gender options
 */
export const GENDER_OPTIONS: SelectOption[] = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'non_binary', label: 'No binario' },
  { value: 'prefer_not_to_say', label: 'Prefiero no decir' },
  { value: 'other', label: 'Otro' },
];

/**
 * Common countries (can be extended)
 */
export const COUNTRY_OPTIONS: SelectOption[] = [
  { value: 'Mexico', label: 'México' },
  { value: 'United States', label: 'Estados Unidos' },
  { value: 'Canada', label: 'Canadá' },
  { value: 'Spain', label: 'España' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Brazil', label: 'Brasil' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Costa Rica', label: 'Costa Rica' },
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'El Salvador', label: 'El Salvador' },
  { value: 'Guatemala', label: 'Guatemala' },
  { value: 'Honduras', label: 'Honduras' },
  { value: 'Nicaragua', label: 'Nicaragua' },
  { value: 'Panama', label: 'Panamá' },
  { value: 'Paraguay', label: 'Paraguay' },
  { value: 'Peru', label: 'Perú' },
  { value: 'Uruguay', label: 'Uruguay' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'United Kingdom', label: 'Reino Unido' },
  { value: 'France', label: 'Francia' },
  { value: 'Germany', label: 'Alemania' },
  { value: 'Italy', label: 'Italia' },
  { value: 'Portugal', label: 'Portugal' },
  { value: 'Netherlands', label: 'Países Bajos' },
  { value: 'Belgium', label: 'Bélgica' },
  { value: 'Switzerland', label: 'Suiza' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Sweden', label: 'Suecia' },
  { value: 'Norway', label: 'Noruega' },
  { value: 'Denmark', label: 'Dinamarca' },
  { value: 'Finland', label: 'Finlandia' },
  { value: 'Poland', label: 'Polonia' },
  { value: 'Czech Republic', label: 'República Checa' },
  { value: 'Hungary', label: 'Hungría' },
  { value: 'Romania', label: 'Rumania' },
  { value: 'Greece', label: 'Grecia' },
  { value: 'Turkey', label: 'Turquía' },
  { value: 'Russia', label: 'Rusia' },
  { value: 'China', label: 'China' },
  { value: 'Japan', label: 'Japón' },
  { value: 'South Korea', label: 'Corea del Sur' },
  { value: 'India', label: 'India' },
  { value: 'Australia', label: 'Australia' },
  { value: 'New Zealand', label: 'Nueva Zelanda' },
  { value: 'South Africa', label: 'Sudáfrica' },
];

/**
 * Common languages
 */
export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'pl', label: 'Polski' },
  { value: 'ru', label: 'Русский' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'ar', label: 'العربية' },
];

/**
 * Profile visibility options
 */
export const VISIBILITY_OPTIONS: SelectOption[] = [
  { value: 'public', label: 'Público - Visible para todos' },
  { value: 'private', label: 'Privado - Solo tú' },
  { value: 'connections', label: 'Conexiones - Solo contactos' },
];
