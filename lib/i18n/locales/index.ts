import { vi } from './vi';
import { en } from './en';
import type { Locale } from '../types';

export const locales = {
  vi,
  en,
} as const;

export type { TranslationKeys } from './vi';

export function getTranslations(locale: Locale) {
  return locales[locale] || locales.vi;
}
