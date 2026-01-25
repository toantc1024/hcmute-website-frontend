"use client";

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from "react";
import { i18nConfig } from "./config";
import { getTranslations, type TranslationKeys } from "./locales";
import type { Locale } from "./types";

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
  availableLocales: Locale[];
  localeName: (locale: Locale) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = "hcmute-locale";

function subscribeToNothing() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return i18nConfig.defaultLocale;
  }
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
  if (stored && i18nConfig.locales.includes(stored)) {
    return stored;
  }
  return i18nConfig.defaultLocale;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(subscribeToNothing, getHydratedSnapshot, getServerSnapshot);
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return i18nConfig.defaultLocale;
    }
    return getStoredLocale();
  });

  const setLocale = useCallback((newLocale: Locale) => {
    if (i18nConfig.locales.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    }
  }, []);

  const localeName = useCallback((loc: Locale) => {
    return i18nConfig.localNames[loc] || loc;
  }, []);

  const t = getTranslations(locale);

  if (!isHydrated) {
    return null;
  }

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        availableLocales: i18nConfig.locales,
        localeName,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
