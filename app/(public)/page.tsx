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
  Sparkles,
  ExternalLink,
  X,
  BarChart3,
  GraduationCap,
  Play,
  Bot,
  Link2,
  FileText,
  Video,
  Cloud,
  VideoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

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

// Section nav items - MUST match actual render order
const sectionNavItems = [
  { id: "hero", label: "Trang chủ", icon: Home },
  { id: "stats", label: "Thống kê", icon: BarChart3 },
  { id: "values", label: "Triết lý", icon: Award },
  { id: "history", label: "Lịch sử", icon: Play },
  { id: "leadership", label: "Lãnh đạo", icon: Users },
  { id: "units", label: "Đơn vị", icon: Building2 },
  { id: "news", label: "Tin tức", icon: Newspaper },
  { id: "partners", label: "Đối tác", icon: Handshake },
];

// AI Systems data
const aiSystems = [
  {
    name: "UTE AI",
    description: "Trợ lý AI thông minh",
    url: "https://ai.hcmute.edu.vn",
    Icon: Bot,
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "SLINK",
    description: "Rút gọn liên kết",
    url: "https://link.hcmute.edu.vn",
    Icon: Link2,
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "UTE Form",
    description: "Tạo biểu mẫu trực tuyến",
    url: "https://form.hcmute.edu.vn",
    Icon: FileText,
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "LiveHub",
    description: "Nền tảng livestream",
    url: "https://livehub.hcmute.edu.vn",
    Icon: Video,
    color: "from-red-500 to-orange-600",
  },
  {
    name: "UTE Drive",
    description: "Lưu trữ đám mây",
    url: "https://drive.hcmute.edu.vn",
    Icon: Cloud,
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "UTE Meet",
    description: "Họp trực tuyến",
    url: "https://meet.hcmute.edu.vn",
    Icon: VideoIcon,
    color: "from-green-500 to-emerald-600",
  },
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
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
      {/* AI Systems Panel Overlay */}
      <AnimatePresence>
        {showAiPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiPanel(false)}
            />
            {/* Panel */}
            <motion.div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[110] max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9, y: "-40%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: "-40%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">
                        Hệ thống UTE
                      </h2>
                      <p className="text-white/70 text-sm">
                        Các dịch vụ số của trường
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAiPanel(false)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
                {/* Grid */}
                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {aiSystems.map((system) => (
                    <a
                      key={system.name}
                      href={system.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative bg-gray-50 hover:bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                          system.color,
                        )}
                      >
                        <system.Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                        {system.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </h3>
                      <p className="text-xs text-gray-500">
                        {system.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating navigation - fade with Tailwind only */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 transition-all duration-200",
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

        {/* AI Systems button */}
        <button
          onClick={() => setShowAiPanel(true)}
          className="p-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 ring-4 ring-blue-400/20"
          title="Hệ thống UTE"
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
