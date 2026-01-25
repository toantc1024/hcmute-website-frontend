"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { AuroraText } from "@/components/ui/aurora-text";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  yearRange: string;
  title: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    yearRange: "1962 - 1974",
    title: "Khai Sinh",
    description:
      "Ra đời từ Ban Cao đẳng Sư phạm Kỹ thuật, năm 1974 Trường được nâng cấp thành Trường đại học Giáo dục Thủ Đức, bước đầu đào tạo nhân lực kỹ thuật cho nước.",
    imageUrl: "/assets/1962.png",
  },
  {
    yearRange: "1974 - 1984",
    title: "Định Hình",
    description:
      "Chính thức mang tên Trường Đại học Sư phạm Kỹ thuật Thủ Đức, khẳng định vị thế giáo dục kỹ thuật quốc gia.",
    imageUrl: "/assets/1974.png",
  },
  {
    yearRange: "1984 - 1995",
    title: "Hợp Nhất & Mở Rộng",
    description:
      "Sáp nhập Trường Trung học Công nghiệp Thủ Đức và Trường Sư phạm Kỹ thuật 5, tăng cường quy mô và chuyên ngành. Từ đó chính thức mang tên Trường Đại học Công nghệ Kỹ Thuật TP. Hồ Chí Minh.",
    imageUrl: "/assets/1984.png",
  },
  {
    yearRange: "1995 - 2000",
    title: "Thành viên ĐH QG TP. HCM",
    description:
      "Trở thành thành viên Đại học Quốc gia TP. Hồ Chí Minh, nâng cao mức độ hội nhập và hợp tác.",
    imageUrl: "/assets/1995.png",
  },
  {
    yearRange: "2000 - 2/2025",
    title: "Phát triển vượt bậc",
    description:
      "Trực thuộc Bộ GD&ĐT, được quy hoạch là trường trọng điểm quốc gia về công nghệ kỹ thuật.",
    imageUrl: "/assets/2000.png",
  },
  {
    yearRange: "2/2025 - nay",
    title: "Khẳng định vị thế",
    description:
      "Là Cơ sở giáo dục đại học trọng điểm về kỹ thuật và công nghệ theo quy hoạch mạng lưới CSGD của Thủ tướng chính phủ; Được giao nhiệm vụ dẫn dắt mạng lưới Trung tâm đào tạo xuất sắc và tài năng về công nghệ 4.0, lĩnh vực Năng lượng tái tạo và Hydrogen.",
    videoUrl: "https://www.youtube.com/embed/sQH0-tBvyY4",
  },
];

export default function VideoIntroduction() {
  const [activeIndex, setActiveIndex] = useState(TIMELINE_EVENTS.length - 1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeEvent = TIMELINE_EVENTS[activeIndex];

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.round(percentage * (TIMELINE_EVENTS.length - 1));
    setActiveIndex(index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleDragMove(e.touches[0].clientX);
      }
    };

    const handleUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleUp);
    };
  }, [isDragging]);

  return (
    <section id="history" className="bg-white h-auto relative py-12 lg:py-20 overflow-hidden">
      <div
        className="absolute w-full pointer-events-none z-0"
        style={{ top: "20px", height: "calc(100% + 400px)" }}
      >
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
          ]}
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[100%] skew-y-12"
          )}
        />
      </div>

      <div className="w-full text-center px-4 sm:px-8 lg:px-16 xl:px-24 relative">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            KHÁM PHÁ
            <AuroraText
              className="px-2"
              colors={["#0c4ebfff", "#1760dfff", "#ae0303ff"]}
            >
              HCM-UTE
            </AuroraText>
          </h2>
          <p className="text-base lg:text-lg text-gray-600 mx-auto">
            Hành trình 63 năm xây dựng và phát triển của Trường Đại học Sư phạm
            Kỹ thuật TP.HCM
          </p>
        </motion.div>

        <motion.div
          className="mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-center">
            <div
              ref={containerRef}
              className="relative inline-flex items-center gap-0 bg-gray-100 rounded-3xl px-1 py-1 cursor-pointer select-none w-full max-w-5xl overflow-x-auto"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <motion.div
                className="absolute bg-white rounded-3xl shadow-md hidden sm:block"
                style={{
                  height: "calc(100% - 8px)",
                  top: "4px",
                  width: "calc((100% - 8px) / 6)",
                }}
                initial={false}
                animate={{
                  left: `calc(${activeIndex} * ((100% - 8px) / 6) + 4px)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />

              {TIMELINE_EVENTS.map((event, index) => (
                <button
                  key={event.yearRange}
                  onClick={() => setActiveIndex(index)}
                  className={`relative z-10 px-2 lg:px-4 py-2 text-xs lg:text-sm transition-all duration-200 flex items-center justify-center flex-1 whitespace-nowrap ${
                    activeIndex === index
                      ? "text-gray-900 font-bold"
                      : "text-gray-600 hover:text-gray-900 font-normal"
                  }`}
                >
                  {event.yearRange}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-2xl">
              <div className="aspect-video">
                {activeEvent.videoUrl ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={activeEvent.videoUrl}
                    title={`HCM-UTE ${activeEvent.yearRange} - ${activeEvent.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-2xl"
                  ></iframe>
                ) : activeEvent.imageUrl ? (
                  <img
                    src={activeEvent.imageUrl}
                    alt={`HCM-UTE ${activeEvent.yearRange} - ${activeEvent.title}`}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center rounded-2xl">
                    <div className="text-center text-white p-8">
                      <div className="text-3xl lg:text-5xl font-bold mb-4">
                        {activeEvent.yearRange}
                      </div>
                      <div className="text-xl lg:text-2xl font-semibold">
                        {activeEvent.title}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-gray-900 text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6 lg:space-y-8">
              <div>
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-2xl lg:text-4xl font-bold text-blue-600">
                    {activeEvent.yearRange}
                  </span>
                  <h3 className="text-xl lg:text-3xl font-bold text-gray-900">
                    {activeEvent.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                  {activeEvent.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
