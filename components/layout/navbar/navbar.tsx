"use client";

import React from "react";
import Link from "next/link";
import { DesktopNav, DesktopNavLeft, DesktopNavRight } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { NavbarProvider } from "./navbar-context";
import { NavbarOverlay } from "./navbar-overlay";
import { TopBar } from "./top-bar";
import { LanguageProvider } from "./language-context";
import { navbarConfig } from "./navbar-config";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { logo, search, actions } = navbarConfig;
  const SearchIcon = search.icon;

  return (
    <LanguageProvider>
    <NavbarProvider>
      {/* Top Bar - Primary Color */}
      <TopBar />

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto relative">
          {/* Mobile: Logo left, Menu right */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <Link href={logo.href} className="flex items-center">
              <img
                src={logo.mobileImage}
                alt={logo.alt}
                width={logo.mobileWidth}
                height={logo.mobileHeight}
                className="h-10 w-auto"
              />
            </Link>
            <MobileNav />
          </div>

          {/* Desktop: Logo | Navigation | Actions */}
          <div className="hidden lg:flex items-center justify-between w-full gap-6">
            {/* Left - Logo */}
            <Link href={logo.href} className="flex items-center flex-shrink-0">
              <img
                src={logo.image}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-10 w-auto"
              />
            </Link>

            {/* Center - Navigation */}
            <div className="flex items-center gap-1 flex-1 justify-center">
              <DesktopNavLeft />
              <DesktopNavRight />
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search Button */}
              {search.enabled && (
                <Button variant="ghost" size="icon">
                  <SearchIcon className="w-5 h-5" />
                  <span className="sr-only">{search.placeholder}</span>
                </Button>
              )}

              {/* Action Buttons */}
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant={action.variant}
                    size="default"
                    icon={Icon as React.ElementType}
                    iconPlacement="right"
                    effect="expandIcon" 
                    asChild
                  >
                    <Link href={action.href}>
                      {action.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Menu Content - renders below header */}
      <DesktopNav />

      {/* Overlay rendered via portal to document.body */}
      <NavbarOverlay />
    </NavbarProvider>
    </LanguageProvider>
  );
}
