export type Locale = 'vi' | 'en';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface I18nConfig {
  defaultLocale: Locale;
  locales: Locale[];
  localNames: Record<Locale, string>;
}
