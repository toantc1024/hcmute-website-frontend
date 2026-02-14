"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { AuroraText } from "@/components/ui/aurora-text";
import { Container } from "@/components/layout";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SECTION_HEIGHT = 80; // vh per section
const MOBILE_BREAKPOINT = 1024; // lg breakpoint

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
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const indicatorWrapperRef = useRef<HTMLDivElement>(null);
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

  // Desktop scroll behavior
  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const imageWrapper = imageWrapperRef.current;
    if (!section || !container || !imageWrapper) return;

    let ctx: gsap.Context | null = null;

    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const contentColumn = container.querySelector(
          ".lg\\:w-1\/2:last-child",
        ) as HTMLElement;
        if (!contentColumn) return;

        const contentHeight = contentColumn.offsetHeight;
        const imageHeight = imageWrapper.offsetHeight;
        const pinDistance = contentHeight - imageHeight;

        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: () => `+=${Math.max(0, pinDistance)}`,
          pin: imageWrapper,
          pinSpacing: false,
        });

        // Pin the indicator on the right side
        const indicatorWrapper = indicatorWrapperRef.current;
        if (indicatorWrapper) {
          ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: () => `+=${Math.max(0, pinDistance)}`,
            pin: indicatorWrapper,
            pinSpacing: false,
          });
        }

        // Use a single ScrollTrigger with onUpdate for continuous progress tracking
        // This ensures there's ALWAYS an active item — no dead zones between items
        ScrollTrigger.create({
          trigger: contentColumn,
          start: "top 50%",
          end: "bottom 50%",
          onUpdate: (self) => {
            const progress = self.progress;
            const totalItems = featureData.length;
            const newIndex = Math.min(
              Math.floor(progress * totalItems),
              totalItems - 1,
            );
            setActiveIndex(newIndex);
          },
          onLeaveBack: () => setActiveIndex(0),
          onLeave: () => setActiveIndex(featureData.length - 1),
        });
      }, section);
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, [isMobile]);

  // Mobile horizontal scroll behavior
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
        // Each card is 100vw, scroll distance is (totalCards - 1) * viewportWidth
        // This way the last card ends up centered
        const scrollDistance = viewportWidth * (totalCards - 1);

        // Pin and scroll horizontally - ends when last card is centered
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
              const progress = self.progress;
              const newIndex = Math.min(
                Math.round(progress * (totalCards - 1)),
                totalCards - 1,
              );
              setActiveIndex(newIndex);
            },
          },
        });
      }, section);
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, [isMobile]);

  const scrollToSection = useCallback(
    (index: number) => {
      if (isMobile) {
        const scrollTrigger = ScrollTrigger.getAll().find(
          (st) => st.trigger === mobileScrollContainerRef.current,
        );
        if (scrollTrigger) {
          const totalCards = featureData.length;
          const scrollRange = scrollTrigger.end - scrollTrigger.start;
          // Each card takes equal portion of scroll
          const cardProgress = index / (totalCards - 1);
          const targetScroll =
            scrollTrigger.start + scrollRange * Math.min(cardProgress, 1);
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

  // Shared Image Component
  const ImageSection = ({ className = "" }: { className?: string }) => {
    return (
      <div className={`w-full ${className}`}>
        {/* Tab - on left, bottom-left radius 0 to connect with image */}
        <div className="mb-0">
          <span
            className={`inline-block rounded-lg rounded-br-none rounded-bl-none px-3 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm font-semibold text-white bg-gradient-to-r ${featureData[activeIndex].tabColor} shadow-md transition-all duration-300`}
          >
            {featureData[activeIndex].tabLabel}
          </span>
        </div>

        {/* Image - top-left radius 0 to connect with badge */}
        <div className="relative aspect-[4/3] rounded-xl lg:rounded-2xl !rounded-tl-none overflow-hidden shadow-xl bg-gray-100">
          {featureData.map((feature, i) => (
            <Image
              key={feature.id}
              src={feature.imageUrl}
              alt={feature.titleHighlight}
              fill
              className={`object-cover transition-opacity duration-500 ${
                activeIndex === i ? "opacity-100" : "opacity-0"
              }`}
              priority={i === 0}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </div>
    );
  };

  // Mobile Content Card - Full section with Image, Number, and Text stacked
  const MobileContentCard = ({
    feature,
    index,
  }: {
    feature: (typeof featureData)[0];
    index: number;
  }) => {
    const isActive = activeIndex === index;
    const sectionNumber = String(index + 1).padStart(2, "0");

    return (
      <div className="w-screen h-full flex-shrink-0 flex flex-col items-center justify-center px-6">
        <div
          className={`flex  flex-col items-center text-center transition-all duration-500 ease-out ${
            isActive
              ? "opacity-100 blur-0 scale-100"
              : "opacity-40 blur-[1px] scale-95"
          }`}
        >
          {/* Badge centered above image */}
          <div className="mb-2">
            <span
              className={`inline-block rounded-lg  px-3 py-1 text-[10px] font-semibold text-white bg-gradient-to-r ${feature.tabColor}  shadow-md`}
            >
              {feature.tabLabel}
            </span>
          </div>

          {/* Image */}
          <div className="relative w-full max-w-[360px] aspect-[16/10] rounded-xl overflow-hidden shadow-xl bg-gray-100 mb-4">
            <Image
              src={feature.imageUrl}
              alt={feature.titleHighlight}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Big Gradient Number */}
          <span className="font-bold text-[72px] leading-none bg-gradient-to-br from-[#0c4ebf] via-[#1760df] to-[#ae0303]   bg-clip-text text-transparent mb-2">
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
  };

  // Desktop Content Card Component
  const DesktopContentCard = ({
    feature,
    index,
  }: {
    feature: (typeof featureData)[0];
    index: number;
  }) => {
    const isActive = activeIndex === index;
    const sectionNumber = String(index + 1).padStart(2, "0");

    return (
      <div
        ref={(el) => {
          contentRefs.current[index] = el;
        }}
        className="flex flex-col justify-center relative py-8 border-b border-gray-100 last:border-b-0"
        style={{ height: `${SECTION_HEIGHT}vh` }}
      >
        {/* Big Gradient Number - positioned above content, not overlapping */}
        <div
          className={`relative pointer-events-none transition-all duration-500 mb-2 ${
            isActive ? "opacity-100" : "opacity-20"
          }`}
        >
          <span
            className="font-bold text-[80px] lg:text-[100px] leading-none bg-clip-text text-transparent"
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
              : "opacity-30 blur-[2px] translate-y-2"
          }`}
        >
          <h2
            className={`text-2xl lg:text-4xl font-bold mb-4 transition-colors duration-500 ${
              isActive ? "text-foreground" : "text-gray-500"
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
            className={`text-base lg:text-lg leading-relaxed transition-colors duration-500 text-justify ${
              isActive ? "text-gray-600" : "text-gray-500"
            }`}
          >
            {feature.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      data-section="feature-showcase"
      className="relative bg-white py-12"
    >
      {/* Mobile Layout - Horizontal Scroll on Vertical Scroll */}
      <div className="lg:hidden" ref={mobileScrollContainerRef}>
        <div className="h-screen flex flex-col">
          {/* Horizontal Scrolling Full Cards */}
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
                />
              ))}
            </div>
          </div>

          {/* Line-based Progress Indicator */}
          <div className="absolute bottom-8 left-0 right-0 px-6">
            <div className="flex gap-2 w-full">
              {featureData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSection(i)}
                  className={`flex-1 h-1 rounded-full ${
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

      {/* Desktop Layout - Original Vertical Scroll */}
      <Container
        as="div"
        ref={containerRef}
        className="hidden lg:block relative"
      >
        <div className="flex flex-col lg:flex-row lg:gap-12">
          {/* Left - Pinned Image */}
          <div className="lg:w-1/2">
            <div
              ref={imageWrapperRef}
              className="lg:h-screen flex items-center py-4 lg:py-6"
            >
              <ImageSection />
            </div>
          </div>

          {/* Right - Scrolling Content */}
          <div className="lg:w-1/2 flex flex-col">
            {featureData.map((feature, i) => (
              <DesktopContentCard
                key={feature.id}
                feature={feature}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Desktop Vertical Indicator - Pinned on right side within section */}
        <div
          ref={indicatorWrapperRef}
          className="absolute right-2 top-0 h-screen flex items-center z-50"
        >
          <div className="flex flex-col gap-2" style={{ height: "60vh" }}>
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
      </Container>

      {/* Section Divider — decorative line */}
      <Container className="mt-12 lg:mt-16">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
      </Container>
    </section>
  );
}
