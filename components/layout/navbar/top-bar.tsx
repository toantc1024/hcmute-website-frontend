"use client";

import React from "react";
import Link from "next/link";
import { navbarConfig } from "./navbar-config";
import { LanguageSelector } from "./language-selector";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TopBar() {
  const { topBar, logo } = navbarConfig;

  if (!topBar.enabled) return null;

  return (
    <div className="hidden lg:block bg-primary py-2 text-primary-foreground">
      <div className="container flex h-10 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto text-sm">
        {/* Left - Links */}
        <div className="flex items-center gap-1">
          {/* Desktop: Show top bar links */}
          <TooltipProvider delayDuration={300}>
            <div className="flex items-center">
              {topBar.links.map((link, index) => {
                const Icon = link.icon;
                const content = (
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-primary-foreground/10 transition-colors">
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{link.label}</span>
                  </span>
                );

                const linkElement = link.isExternal ? (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <Tooltip key={link.id}>
                    <TooltipTrigger asChild>
                      <Link href={link.href}>{content}</Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{link.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );

                return (
                  <React.Fragment key={link.id}>
                    {linkElement}
                    {index < topBar.links.length - 1 && (
                      <Separator orientation="vertical" className="h-4 mx-1 bg-primary-foreground/30" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </TooltipProvider>
        </div>

        {/* Right - Language Selector */}
        <LanguageSelector variant="topbar" />
      </div>
    </div>
  );
}
