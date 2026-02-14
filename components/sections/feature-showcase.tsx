"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { AuroraText } from "@/components/ui/aurora-text";
import { Container } from "@/components/layout";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CARD_GAP = 48; // px between content cards
const MOBILE_BREAKPOINT = 1024;

/* ── Engineering icon SVG paths (one per feature) ── */
const ENGINEERING_ICONS = [
  // Wrench (Đào tạo)
  {
    paths: [
      "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z",
    ],
  },
  // Graduation cap (Tuyển sinh)
  {
    paths: [
      "M22 10v6M2 10l10-5 10 5-10 5z",
      "M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5",
    ],
  },
  // Microscope/Flask (Khoa học)
  {
    paths: [
      "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2",
      "M8.5 2h7M7 16.5h10",
    ],
  },
  // Heart-handshake (Cộng đồng)
  {
    paths: [
      "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      "M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66",
      "M18 15l-2-2M15 18l-2-2",
    ],
  },
];

const featureData = [
  {
    id: "dao-tao",
    title: "Chương trình",
    titleHighlight: "Đào tạo",
    description:
      "52 ngành Đại học, 18 ngành Thạc sĩ, 12 ngành Tiến sĩ. Chương trình đào tạo của HCM-UTE được thiết kế theo chuẩn quốc tế, kết hợp giữa lý thuyết và thực hành.",
    imageUrl: "/scroll/dao-tao.jpg",
    tabLabel: "52 ngành ĐH • 18 ThS • 12 TS",
    tabColor: "from-[#0c4ebf] to-[#1760df]",
  },
  {
    id: "tuyen-sinh",
    title: "",
    titleHighlight: "Tuyển sinh",
    description:
      "HCM-UTE tuyển sinh đa dạng các ngành đào tạo từ bậc đại học đến sau đại học. Với phương thức tuyển sinh linh hoạt, minh bạch và công bằng.",
    imageUrl: "/scroll/tuyen-sinh.jpeg",
    tabLabel: "Khóa 2025",
    tabColor: "from-[#1760df] to-[#0c4ebf]",
  },
  {
    id: "khcn",
    title: "Nghiên cứu",
    titleHighlight: "Khoa học",
    description:
      "Tạp chí Khoa học Giáo dục JTE uy tín hàng đầu Việt Nam. HCM-UTE tiên phong trong việc ứng dụng và phát triển các công nghệ tiên tiến.",
    imageUrl: "/scroll/KHCN.jpg",
    tabLabel: "Tạp chí JTE",
    tabColor: "from-[#0c4ebf] to-[#1760df]",
  },
  {
    id: "hoat-dong-sv",
    title: "Phục vụ",
    titleHighlight: "Cộng đồng",
    description:
      "Hướng đến phát triển bền vững. HCM-UTE tạo môi trường phát triển toàn diện cho sinh viên thông qua các hoạt động ngoại khóa phong phú.",
    imageUrl: "/scroll/pvcd.jpg",
    tabLabel: "Phát triển bền vững",
    tabColor: "from-[#ae0303] to-[#1760df]",
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export default function FeatureShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentColumnRef = useRef<HTMLDivElement>(null);
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);
  const mobileContentWrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  // Preload images
  useEffect(() => {
    if (typeof window === "undefined") return;
    featureData.forEach((f) => {
      const img = new window.Image();
      img.src = f.imageUrl;
    });
  }, []);

  // ── Desktop: active index tracking only (sticky handles pinning) ──
  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;

    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Track active index — continuous scroll-based tracking
        featureData.forEach((_, i) => {
          const card = contentRefs.current[i];
          if (!card) return;

          ScrollTrigger.create({
            trigger: card,
            start: "top 65%",
            end: "bottom 35%",
            onEnter: () => setActiveIndex(i),
            onEnterBack: () => setActiveIndex(i),
            onLeave: () => {
              // When leaving downward, activate next if available
              if (i < featureData.length - 1) setActiveIndex(i + 1);
            },
            onLeaveBack: () => {
              // When leaving upward, activate previous if available
              if (i > 0) setActiveIndex(i - 1);
            },
          });
        });

        // Animate decorative icons on scroll
        gsap.utils.toArray<HTMLElement>(".decor-icon").forEach((icon) => {
          gsap.fromTo(
            icon,
            { opacity: 0, scale: 0.6, rotate: -15 },
            {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: icon,
                start: "top 90%",
                end: "top 40%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        // Animate the divider curves and diamond
        const dividerSvg = section.querySelector(".section-divider-line");
        const diamond = section.querySelector(".divider-diamond");

        if (dividerSvg) {
          const paths = dividerSvg.querySelectorAll("path");
          paths.forEach((path) => {
            const length = (path as SVGPathElement).getTotalLength?.() || 600;
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: dividerSvg,
                start: "top 95%",
                toggleActions: "play none none reverse",
              },
            });
          });
        }

        if (diamond) {
          gsap.fromTo(
            diamond,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: 0.4,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: diamond,
                start: "top 95%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      }, section);
    }, 300);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, [isMobile]);

  // ── Mobile: horizontal scroll ──
  useEffect(() => {
    if (typeof window === "undefined" || !isMobile) return;

    const section = sectionRef.current;
    const mobileScrollContainer = mobileScrollContainerRef.current;
    const mobileContentWrapper = mobileContentWrapperRef.current;
    if (!section || !mobileScrollContainer || !mobileContentWrapper) return;

    let ctx: gsap.Context | null = null;

    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const viewportWidth = window.innerWidth;
        const totalCards = featureData.length;
        const scrollDistance = viewportWidth * (totalCards - 1);

        gsap.to(mobileContentWrapper, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: mobileScrollContainer,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            pin: true,
            scrub: 0.3,
            onUpdate: (self) => {
              const newIndex = Math.min(
                Math.round(self.progress * (totalCards - 1)),
                totalCards - 1,
              );
              setActiveIndex(newIndex);
            },
          },
        });
      }, section);
    }, 300);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, [isMobile]);

  const scrollToSection = useCallback(
    (index: number) => {
      if (isMobile) {
        const st = ScrollTrigger.getAll().find(
          (t) => t.trigger === mobileScrollContainerRef.current,
        );
        if (st) {
          const totalCards = featureData.length;
          const scrollRange = st.end - st.start;
          const cardProgress = index / (totalCards - 1);
          const targetScroll =
            st.start + scrollRange * Math.min(cardProgress, 1);
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      } else {
        contentRefs.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    },
    [isMobile],
  );

  // Memoize the active feature to prevent unnecessary re-renders
  const activeFeature = useMemo(() => featureData[activeIndex], [activeIndex]);

  return (
    <section
      ref={sectionRef}
      data-section="feature-showcase"
      className="relative bg-white"
    >
      {/* ═══════════ Large Decorative Engineering Icons ═══════════ */}

      {/* Top-left: Wrench & Screwdriver */}
      <svg
        className="absolute -left-10 md:-left-20 lg:-left-24 top-[8%] w-48 h-48 md:w-72 md:h-72 lg:w-[22rem] lg:h-[22rem] pointer-events-none -z-0 opacity-[0.18]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="0.3"
      >
        <defs>
          <linearGradient id="engGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c4ebf" stopOpacity="1" />
            <stop offset="60%" stopColor="#1760df" stopOpacity="1" />
            <stop offset="100%" stopColor="#ae0303" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Wrench */}
        <path
          stroke="url(#engGrad1)"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"
        />
      </svg>

      {/* Bottom-right: Circuit/Chip */}
      <svg
        className="absolute -right-10 md:-right-20 lg:-right-24 bottom-[12%] w-44 h-44 md:w-64 md:h-64 lg:w-80 lg:h-80 pointer-events-none -z-0 opacity-[0.15]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="0.3"
      >
        <defs>
          <linearGradient id="engGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ae0303" stopOpacity="1" />
            <stop offset="50%" stopColor="#1760df" stopOpacity="1" />
            <stop offset="100%" stopColor="#0c4ebf" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* CPU/Chip */}
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          stroke="url(#engGrad2)"
        />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="url(#engGrad2)" />
        <path
          stroke="url(#engGrad2)"
          strokeLinecap="round"
          d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"
        />
      </svg>

      {/* Mid-left: Compass/Drafting */}
      <svg
        className="absolute -left-6 md:-left-12 lg:-left-16 top-[55%] w-36 h-36 md:w-56 md:h-56 lg:w-64 lg:h-64 pointer-events-none -z-0 opacity-[0.14]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="0.3"
      >
        <defs>
          <linearGradient id="engGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0c4ebf" stopOpacity="1" />
            <stop offset="100%" stopColor="#ae0303" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Compass tool */}
        <circle cx="12" cy="5" r="3" stroke="url(#engGrad3)" />
        <path
          stroke="url(#engGrad3)"
          strokeLinecap="round"
          d="m12 8-4 13M12 8l4 13M9 18h6"
        />
      </svg>

      {/* Top-right: Graduation Cap (Tuyển sinh) */}
      <svg
        className="absolute -right-8 md:-right-16 lg:-right-20 top-[25%] w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 pointer-events-none -z-0 opacity-[0.14]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="0.3"
      >
        <defs>
          <linearGradient id="engGrad4" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#1760df" stopOpacity="1" />
            <stop offset="100%" stopColor="#ae0303" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Graduation cap */}
        <path
          stroke="url(#engGrad4)"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M22 10v6M2 10l10-5 10 5-10 5z"
        />
        <path
          stroke="url(#engGrad4)"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"
        />
      </svg>
      {/* ═══════════ Mobile Layout ═══════════ */}
      <div className="lg:hidden" ref={mobileScrollContainerRef}>
        <div className="h-screen flex flex-col">
          <div className="flex-1 overflow-hidden flex items-center">
            <div
              ref={mobileContentWrapperRef}
              className="flex items-center will-change-transform h-full"
            >
              {featureData.map((feature, i) => (
                <MobileContentCard
                  key={feature.id}
                  feature={feature}
                  index={i}
                  isActive={activeIndex === i}
                />
              ))}
            </div>
          </div>

          {/* Progress bars */}
          <div className="absolute bottom-8 left-0 right-0 px-6">
            <div className="flex gap-2 w-full">
              {featureData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSection(i)}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? "bg-gradient-to-r from-[#0c4ebf] via-[#1760df] to-[#ae0303]"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ Desktop Layout ═══════════ */}
      <Container className="hidden lg:!flex relative !px-0">
        <div className="flex w-full">
          {/* ── Left: Sticky image (55% width) ── */}
          <div className="w-[55%]">
            <div className="sticky top-0 h-screen flex flex-col justify-center py-12 pl-16 xl:pl-64 pr-6">
              {/* Tab badge */}
              <div className="mb-0 shrink-0">
                <span
                  className={`inline-block rounded-t-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r ${activeFeature.tabColor} shadow-md transition-all duration-300`}
                >
                  {activeFeature.tabLabel}
                </span>
              </div>

              {/* Image — capped at 65vh so tag badge stays visible */}
              <div className="relative w-full max-h-[65vh] aspect-[4/3] rounded-2xl !rounded-tl-none overflow-hidden shadow-2xl bg-gray-100">
                {featureData.map((feature, i) => (
                  <Image
                    key={feature.id}
                    src={feature.imageUrl}
                    alt={feature.titleHighlight}
                    fill
                    sizes="55vw"
                    className={`object-cover transition-opacity duration-700 ease-in-out ${
                      activeIndex === i ? "opacity-100" : "opacity-0"
                    }`}
                    priority={i === 0}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* ── Right: Scrolling content cards (45% width) ── */}
          <div
            ref={contentColumnRef}
            className="w-[45%] flex flex-col pl-6 xl:pl-10 pr-16 xl:pr-64"
          >
            {featureData.map((feature, i) => (
              <DesktopContentCard
                key={feature.id}
                feature={feature}
                index={i}
                isActive={activeIndex === i}
                cardRef={(el) => {
                  contentRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Scroll indicator (sticky on right edge) ── */}
        <div className="absolute right-3 top-0 h-full pointer-events-none">
          <div className="sticky top-0 h-screen flex items-center pointer-events-auto z-50">
            <div className="flex flex-col gap-2" style={{ height: "50vh" }}>
              {featureData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSection(i)}
                  className={`flex-1 w-1 rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? "bg-gradient-to-b from-[#0c4ebf] via-[#1760df] to-[#ae0303]"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* ═══════════ Full-width Gradient Divider with Diamond ═══════════ */}
      <div className="relative flex items-center justify-center py-8 w-full">
        <svg
          className="section-divider-line w-full"
          viewBox="0 0 1200 40"
          fill="none"
          style={{ height: "2.5rem" }}
        >
          <defs>
            <linearGradient
              id="dividerCurveGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="20%" stopColor="#0c4ebf" />
              <stop offset="50%" stopColor="#1760df" />
              <stop offset="80%" stopColor="#ae0303" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient
              id="diamondStroke"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#0c4ebf" />
              <stop offset="50%" stopColor="#1760df" />
              <stop offset="100%" stopColor="#ae0303" />
            </linearGradient>
          </defs>
          {/* Single smooth parabola — Q curve peak at center */}
          <path
            d="M0 36 Q600 4 1200 36"
            stroke="url(#dividerCurveGrad)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Diamond sitting at the parabola peak (x=600, y=20) */}
          <rect
            className="divider-diamond"
            x="592"
            y="12"
            width="16"
            height="16"
            rx="1"
            transform="rotate(45 600 20)"
            stroke="url(#diamondStroke)"
            strokeWidth="1.5"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}

// ── Extracted as standalone components (not defined inside render) ──

function DesktopContentCard({
  feature,
  index,
  isActive,
  cardRef,
}: {
  feature: (typeof featureData)[0];
  index: number;
  isActive: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const sectionNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={cardRef}
      className="flex flex-col justify-center relative min-h-screen"
    >
      {/* Gradient number */}
      <div
        className={`pointer-events-none transition-all duration-500 mb-3 ${
          isActive ? "opacity-100" : "opacity-15"
        }`}
      >
        <span
          className="font-bold text-[100px] xl:text-[120px] leading-none bg-clip-text text-transparent select-none"
          style={{
            backgroundImage:
              "linear-gradient(to bottom left, #ef2a2aff 10%, #1760df 40%, transparent 85%)",
          }}
        >
          {sectionNumber}
        </span>
      </div>

      <div
        className={`transition-all duration-500 ease-out relative z-10 ${
          isActive
            ? "opacity-100 blur-0 translate-y-0"
            : "opacity-25 blur-[2px] translate-y-3"
        }`}
      >
        <h2
          className={`text-3xl xl:text-4xl font-bold mb-4 transition-colors duration-500 ${
            isActive ? "text-foreground" : "text-gray-400"
          }`}
        >
          {feature.title}{" "}
          <AuroraText
            className="inline"
            colors={["#0c4ebf", "#1760df", "#ae0303"]}
          >
            {feature.titleHighlight}
          </AuroraText>
        </h2>
        <p
          className={`text-base xl:text-lg leading-relaxed max-w-lg transition-colors duration-500 text-justify ${
            isActive ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
}

function MobileContentCard({
  feature,
  index,
  isActive,
}: {
  feature: (typeof featureData)[0];
  index: number;
  isActive: boolean;
}) {
  const sectionNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="w-screen h-full flex-shrink-0 flex flex-col items-center justify-center px-6">
      <div
        className={`flex flex-col items-center text-center transition-all duration-500 ease-out ${
          isActive
            ? "opacity-100 blur-0 scale-100"
            : "opacity-40 blur-[1px] scale-95"
        }`}
      >
        {/* Badge */}
        <div className="mb-2">
          <span
            className={`inline-block rounded-lg px-3 py-1 text-[10px] font-semibold text-white bg-gradient-to-r ${feature.tabColor} shadow-md`}
          >
            {feature.tabLabel}
          </span>
        </div>

        {/* Image */}
        <div className="relative w-full max-w-[360px] aspect-[16/10] max-h-[35vh] rounded-xl overflow-hidden shadow-xl bg-gray-100 mb-4">
          <Image
            src={feature.imageUrl}
            alt={feature.titleHighlight}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Number */}
        <span className="font-bold text-[72px] leading-none bg-gradient-to-br from-[#0c4ebf] via-[#1760df] to-[#ae0303] bg-clip-text text-transparent mb-2">
          {sectionNumber}
        </span>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2 text-foreground">
          {feature.title}{" "}
          <AuroraText
            className="inline"
            colors={["#0c4ebf", "#1760df", "#ae0303"]}
          >
            {feature.titleHighlight}
          </AuroraText>
        </h2>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-600 max-w-[300px]">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
