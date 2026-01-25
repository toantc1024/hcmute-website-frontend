"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "./language-context";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  variant?: "topbar" | "default";
  className?: string;
}

export function LanguageSelector({ variant = "default", className }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, languages } = useLanguage();

  const activeIndex = languages.findIndex((lang) => lang.id === currentLanguage);

  if (variant === "topbar") {
    return (
      <div className={cn("relative flex items-center rounded-full bg-primary-foreground/10 p-1", className)}>
        {/* Moving indicator */}
        <motion.div
          className="absolute h-[calc(100%-8px)] rounded-full bg-primary-foreground shadow-sm"
          initial={false}
          animate={{
            x: `calc(${activeIndex * 100}% + ${activeIndex * 4}px)`,
            width: `calc(${100 / languages.length}% - 4px)`,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          style={{
            left: 4,
          }}
        />
        
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            className={cn(
              "relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200",
              currentLanguage === lang.id
                ? "text-primary"
                : "text-primary-foreground/80 hover:text-primary-foreground"
            )}
          >
            <span className={cn("fi w-4 h-3", `fi-${lang.flagCode}`)} />
            <span>{lang.shortLabel}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center rounded-full bg-muted p-1", className)}>
      {/* Moving indicator */}
      <motion.div
        className="absolute h-[calc(100%-8px)] rounded-full bg-background shadow-sm"
        initial={false}
        animate={{
          x: `calc(${activeIndex * 100}% + ${activeIndex * 4}px)`,
          width: `calc(${100 / languages.length}% - 4px)`,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        style={{
          left: 4,
        }}
      />
      
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => setLanguage(lang.id)}
          className={cn(
            "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
            currentLanguage === lang.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className={cn("fi w-4 h-3", `fi-${lang.flagCode}`)} />
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
