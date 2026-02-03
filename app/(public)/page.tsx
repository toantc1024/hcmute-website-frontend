"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronUp,
  Home,
  Newspaper,
  Users,
  Building2,
  Clock,
  Award,
  Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const sectionNavItems = [
  { id: "hero", label: "Trang chủ", icon: Home },
  { id: "stats", label: "Thống kê", icon: Award },
  { id: "news", label: "Tin tức", icon: Newspaper },
  { id: "values", label: "Triết lý", icon: Award },
  { id: "history", label: "Lịch sử", icon: Clock },
  { id: "units", label: "Đơn vị", icon: Building2 },
  { id: "leadership", label: "Lãnh đạo", icon: Users },
  { id: "partners", label: "Đối tác", icon: Handshake },
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionNavItems.map((item) => item.id);
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }

      const heroElement = heroRef.current;
      const footerElement = footerRef.current;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      // Hide when in hero section (first screen)
      const isInHero = heroElement
        ? scrollTop < heroElement.offsetHeight - 100
        : scrollTop < viewportHeight;

      // Hide only when footer is fully visible (scrolled past the last content section)
      // Use footer element position if available, otherwise don't hide
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

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Floating navigation - fade with Tailwind only */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-200",
          showFloatingNav
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none",
        )}
      >
        {/* Section navigation */}
        <aside className="hidden md:block">
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 p-2">
            <div className="flex flex-col gap-1">
              {sectionNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                    )}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="absolute right-14 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>

      <main className="relative">
        <div ref={heroRef}>
          <HeroCarousel />
        </div>
        <UniversityStats />
        <FeatureShowcase />
        <CoreValues />
        <VideoIntroduction />
        <UniversityLeadership />
        <UnitsSection />
        <NewsSection />
        <div ref={footerRef}>
          <PartnerLogos />
        </div>
      </main>
    </div>
  );
}
