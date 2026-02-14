"use client";

import React, { useEffect, useState } from "react";
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
import { NavContainer } from "@/components/layout";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { logo, search } = navbarConfig;
  const SearchIcon = search.icon;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <LanguageProvider>
      <NavbarProvider>
        {/* Top Bar - Primary Color */}
        <TopBar />

        {/* Main Navigation Bar - Sticky container includes menu content */}
        <div className="sticky top-0 z-50 w-full">
          <header
            className={cn(
              "w-full border-b bg-white backdrop-blur-md transition-all duration-300 ease-out",
              scrolled
                ? "shadow-sm supports-[backdrop-filter]:bg-white/95"
                : "shadow-md supports-[backdrop-filter]:bg-white/98",
            )}
          >
            {/* Decorative top accent line */}
            <div
              className={cn(
                "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-opacity duration-300",
                scrolled ? "opacity-100" : "opacity-0",
              )}
            />

            <NavContainer className="relative">
              {/* Mobile: Logo left, Menu right */}
              <div className="flex lg:hidden items-center justify-between w-full h-14 sm:h-16">
                <Link href={logo.href} className="flex items-center">
                  <img
                    src={logo.mobileImage}
                    alt={logo.alt}
                    width={logo.mobileWidth}
                    height={logo.mobileHeight}
                    className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
                  />
                </Link>
                <MobileNav />
              </div>

              {/* Desktop: Nav Left | Logo (absolute center) | Nav Right + Actions */}
              <div
                className={cn(
                  "hidden lg:flex items-center w-full relative transition-all duration-300 ease-out",
                  scrolled ? "h-16" : "h-[4.5rem]",
                )}
              >
                {/* Left - Navigation */}
                <div className="flex-1 flex items-center justify-start gap-0.5">
                  <DesktopNavLeft />
                </div>

                {/* Center - Logo (absolute positioned for true center) */}
                <Link
                  href={logo.href}
                  className="absolute left-1/2 -translate-x-1/2 flex items-center group"
                >
                  <div className="relative">
                    {/* Glow ring on hover */}
                    <div
                      className={cn(
                        "absolute -inset-3 rounded-full transition-all duration-500",
                        "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
                        "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100",
                      )}
                    />
                    {/* Subtle pulse ring when at top */}
                    <div
                      className={cn(
                        "absolute -inset-4 rounded-full border border-primary/10 transition-all duration-500",
                        scrolled
                          ? "opacity-0 scale-95"
                          : "opacity-100 scale-100 animate-pulse",
                      )}
                    />
                    <img
                      src={logo.image}
                      alt={logo.alt}
                      width={64}
                      height={64}
                      className={cn(
                        "object-contain relative z-10 transition-all duration-300 group-hover:scale-110",
                        scrolled ? "h-10 w-10" : "h-13 w-13",
                      )}
                    />
                  </div>
                </Link>

                {/* Right - Navigation + Actions (aligned with topbar) */}
                <div className="flex-1 flex items-center justify-end gap-0.5">
                  <DesktopNavRight />

                  {/* Divider */}
                  <div className="h-5 w-px bg-border/60 mx-2" />

                  {/* Search Button */}
                  {search.enabled && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <SearchIcon className="w-5 h-5" />
                      <span className="sr-only">{search.placeholder}</span>
                    </Button>
                  )}

                  {/* Login Button */}
                  <LoginButton variant="default" />
                </div>
              </div>
            </NavContainer>

            {/* Bottom decorative gradient (visible when not scrolled) */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300",
                scrolled
                  ? "bg-border"
                  : "bg-gradient-to-r from-transparent via-primary/20 to-transparent",
              )}
            />
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
