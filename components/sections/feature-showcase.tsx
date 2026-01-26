"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { AuroraText } from "@/components/ui/aurora-text";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SECTION_HEIGHT = 80; // vh per section

const featureData = [
  {
    id: "dao-tao",
    title: "Chương trình",
    titleHighlight: "Đào tạo",
    description:
      "52 ngành Đại học, 18 ngành Thạc sĩ, 12 ngành Tiến sĩ. Chương trình đào tạo của HCMUTE được thiết kế theo chuẩn quốc tế, kết hợp giữa lý thuyết và thực hành.",
    imageUrl: "/scroll/dao-tao.jpg",
    tabLabel: "52 ngành Đại học, 18 ngành Thạc sĩ, 12 ngành Tiến sĩ",
    tabColor: "from-[#0c4ebf] to-[#1760df]",
  },
  {
    id: "tuyen-sinh",
    title: "",
    titleHighlight: "Tuyển sinh",
    description:
      "HCMUTE tuyển sinh đa dạng các ngành đào tạo từ bậc đại học đến sau đại học. Với phương thức tuyển sinh linh hoạt, minh bạch và công bằng.",
    imageUrl: "/scroll/tuyen-sinh.jpeg",
    tabLabel: "Khóa 2025",
    tabColor: "from-[#1760df] to-[#0c4ebf]",
  },
  {
    id: "khcn",
    title: "Nghiên cứu",
    titleHighlight: "Khoa học",
    description:
      "Tạp chí Khoa học Giáo dục JTE uy tín hàng đầu Việt Nam. HCMUTE tiên phong trong việc ứng dụng và phát triển các công nghệ tiên tiến.",
    imageUrl: "/scroll/KHCN.jpg",
    tabLabel: "Tạp chí Khoa học Giáo dục JTE",
    tabColor: "from-[#0c4ebf] to-[#1760df]",
  },
  {
    id: "hoat-dong-sv",
    title: "Phục vụ",
    titleHighlight: "Cộng đồng",
    description:
      "Hướng đến phát triển bền vững. HCMUTE tạo môi trường phát triển toàn diện cho sinh viên thông qua các hoạt động ngoại khóa phong phú.",
    imageUrl: "/scroll/pvcd.jpg",
    tabLabel: "Hướng đến phát triển bền vững",
    tabColor: "from-[#ae0303] to-[#1760df]",
  },
];

export default function FeatureShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Preload images
  useEffect(() => {
    if (typeof window === "undefined") return;
    featureData.forEach((f) => {
      const img = new window.Image();
      img.src = f.imageUrl;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const imageWrapper = imageWrapperRef.current;
    if (!section || !container || !imageWrapper) return;

    let ctx: gsap.Context | null = null;

    // Wait for layout to settle
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Get the right column (content) height
        const contentColumn = container.querySelector(".lg\\:w-1\\/2:last-child") as HTMLElement;
        if (!contentColumn) return;
        
        const contentHeight = contentColumn.offsetHeight;
        const imageHeight = imageWrapper.offsetHeight;
        const pinDistance = contentHeight - imageHeight;

        // Pin the image while scrolling through content
        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: () => `+=${Math.max(0, pinDistance)}`,
          pin: imageWrapper,
          pinSpacing: false,
        });

        // Track active section
        contentRefs.current.forEach((el, i) => {
          if (!el) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => {
              if (self.isActive) {
                setActiveIndex(i);
              }
            },
          });
        });
      }, section);
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white">
      <div
        ref={containerRef}
        className="relative px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40"
      >
        <div className="flex flex-col lg:flex-row lg:gap-12">
          {/* Left - Pinned Image */}
          <div className="lg:w-1/2">
            <div
              ref={imageWrapperRef}
              className="lg:h-screen flex items-center py-8 lg:py-12"
            >
              <div className="w-full">
                {/* Tab */}
                <div className="mb-3">
                  <span
                    className={`inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r ${featureData[activeIndex].tabColor} shadow-md transition-all duration-300`}
                  >
                    {featureData[activeIndex].tabLabel}
                  </span>
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
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

                {/* Dots */}
                <div className="flex gap-2 mt-4 justify-center">
                  {featureData.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        contentRefs.current[i]?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeIndex === i
                          ? "w-6 bg-primary"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Scrolling Content */}
          <div className="lg:w-1/2 flex flex-col">
            {featureData.map((feature, i) => {
              const isActive = activeIndex === i;
              
              return (
                <div
                  key={feature.id}
                  ref={(el) => {
                    contentRefs.current[i] = el;
                  }}
                  className="flex flex-col justify-center py-8 border-b border-gray-100 last:border-b-0"
                  style={{
                    height: `${SECTION_HEIGHT}vh`,
                  }}
                >
                  <div
                    className={`transition-all duration-500 ease-out ${
                      isActive 
                        ? "opacity-100 blur-0 translate-y-0" 
                        : "opacity-30 blur-[2px] translate-y-2"
                    }`}
                  >
                    <h2
                      className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 transition-colors duration-500 ${
                        isActive ? "text-gray-900" : "text-gray-500"
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
                      className={`text-base lg:text-lg leading-relaxed transition-colors duration-500 ${
                        isActive ? "text-gray-600" : "text-gray-500"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
