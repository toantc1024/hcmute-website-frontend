"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp, Home, Newspaper, Users, Building2, Clock, Award, Handshake } from "lucide-react";

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      const sections = sectionNavItems.map((item) => item.id);
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
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
      <motion.aside
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-2"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-2">
          {sectionNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
                <span className="absolute left-14 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.aside>

      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronUp className="w-6 h-6" />
      </motion.button>

      <main className="relative z-0">
        <HeroCarousel />
        <UniversityStats />
        <NewsSection />
        <FeatureShowcase />
        <CoreValues />
        <VideoIntroduction />
        <UnitsSection />
        <UniversityLeadership />
        <PartnerLogos />
      </main>
    </div>
  );
}
