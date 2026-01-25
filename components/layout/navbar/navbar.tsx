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
import { LoginButton } from "@/components/layout/auth";
import { Container } from "@/components/layout/container";

export function Navbar() {
  const { logo, search } = navbarConfig;
  const SearchIcon = search.icon;

  return (
    <LanguageProvider>
      <NavbarProvider>
        {/* Top Bar - Primary Color */}
        <TopBar />

        {/* Main Navigation Bar - Sticky container includes menu content */}
        <div className="sticky top-0 z-50 w-full">
          <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container className="h-16 relative">
              {/* Mobile: Logo left, Menu right */}
              <div className="flex lg:hidden items-center justify-between w-full h-full">
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

              {/* Desktop: Logo (left) | Nav (center) | Actions (right) */}
              <div className="hidden lg:flex items-center w-full h-full">
                {/* Left - Logo */}
                <Link href={logo.href} className="flex items-center shrink-0">
                  <img
                    src={logo.image}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="h-10 w-auto"
                  />
                </Link>

                {/* Center - Navigation (flex-1 to take remaining space, justify-center) */}
                <div className="flex-1 flex items-center justify-center gap-1">
                  <DesktopNavLeft />
                  <DesktopNavRight />
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Search Button */}
                  {search.enabled && (
                    <Button variant="ghost" size="icon">
                      <SearchIcon className="w-5 h-5" />
                      <span className="sr-only">{search.placeholder}</span>
                    </Button>
                  )}

                  {/* Login Button */}
                  <LoginButton variant="default" />
                </div>
              </div>
            </Container>
          </header>

          {/* Desktop Menu Content - inside sticky container, renders below header */}
          <DesktopNav />
        </div>

        {/* Overlay rendered via portal to document.body */}
        <NavbarOverlay />
      </NavbarProvider>
    </LanguageProvider>
  );
}
