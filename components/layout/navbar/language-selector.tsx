"use client";

import React, { useState } from "react";
import { navbarConfig } from "./navbar-config";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectorProps {
  variant?: "topbar" | "default";
  className?: string;
}

export function LanguageSelector({ variant = "default", className }: LanguageSelectorProps) {
  const { topBar } = navbarConfig;
  const [currentLang, setCurrentLang] = useState(topBar.defaultLanguage);

  const selectedLang = topBar.languages.find((l) => l.id === currentLang);

  if (variant === "topbar") {
    return (
      <Select value={currentLang} onValueChange={setCurrentLang}>
        <SelectTrigger 
          className={cn(
            "w-auto gap-2 border-0 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 focus:ring-0 focus:ring-offset-0 h-8 px-2",
            className
          )}
        >
          <SelectValue>
            <span className="flex items-center gap-2">
              <span className={cn("fi", `fi-${selectedLang?.flagCode}`)} />
              <span className="hidden sm:inline">{selectedLang?.shortLabel}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {topBar.languages.map((lang) => (
            <SelectItem key={lang.id} value={lang.id}>
              <span className="flex items-center gap-2">
                <span className={cn("fi ", `fi-${lang.flagCode}`)} />
                <span>{lang.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={currentLang} onValueChange={setCurrentLang}>
      <SelectTrigger className={cn("w-[140px]", className)}>
        <SelectValue>
          <span className="flex items-center gap-2">
            <span className={cn("fi rounded-sm", `fi-${selectedLang?.flagCode}`)} />
            <span>{selectedLang?.label}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {topBar.languages.map((lang) => (
          <SelectItem key={lang.id} value={lang.id}>
            <span className="flex items-center gap-2">
              <span className={cn("fi rounded-sm", `fi-${lang.flagCode}`)} />
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
