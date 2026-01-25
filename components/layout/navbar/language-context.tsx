"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { navbarConfig } from "./navbar-config";

type LanguageContextType = {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  languages: typeof navbarConfig.topBar.languages;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(navbarConfig.topBar.defaultLanguage);

  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguage(lang);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        languages: navbarConfig.topBar.languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
