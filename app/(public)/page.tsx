"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { UTEExtensionsDialog } from "@/components/blocks/ute-extensions-dialog";
import SpacingDebug from "@/components/blocks/spacing-debug";

import {
  HeroCarousel,
  UniversityStats,
  NewsSection,
  PartnerLogos,
  CoreValues,
  VideoIntroduction,
  UniversityLeadership,
  UnitsSection,
  FeatureShowcase,
} from "@/components/sections";

export default function HomePage() {
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = heroRef.current;
      const footerElement = footerRef.current;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const isInHero = heroElement
        ? scrollTop < heroElement.offsetHeight - 100
        : scrollTop < viewportHeight;

      const isAtFooter = footerElement
        ? scrollTop + viewportHeight >
          footerElement.offsetTop + footerElement.offsetHeight - 50
        : false;

      setShowFloatingNav(!isInHero && !isAtFooter);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Spacing Debug Overlay — remove after testing */}
      {/* <SpacingDebug /> */}

      {/* UTE Extensions Dialog */}
      <UTEExtensionsDialog open={showAiPanel} onOpenChange={setShowAiPanel} />

      {/* Floating buttons — only AI + scroll-to-top */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 transition-all duration-200",
          showFloatingNav
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none",
        )}
      >
        {/* UTE Extensions button — primary blue */}
        <button
          onClick={() => setShowAiPanel(true)}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg border border-blue-500/50 hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 ring-4 ring-blue-500/20"
          title="UTE Extensions"
        >
          <Sparkles className="w-6 h-6" />
        </button>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className="p-3 bg-white text-gray-700 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:scale-110 active:scale-95 transition-all duration-200"
          title="Lên đầu trang"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>

      <main className="relative">
        <div ref={heroRef}>
          <HeroCarousel />
        </div>
        <div className="h-12" aria-hidden="true" />
        <UniversityStats />
        <FeatureShowcase />
        <CoreValues />
        <VideoIntroduction />
        <UniversityLeadership />
        <UnitsSection />
        <div ref={footerRef}>
          <PartnerLogos />
        </div>
        <NewsSection />
      </main>
    </div>
  );
}
