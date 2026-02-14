"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuroraText } from "@/components/ui/aurora-text";
import { GridPattern } from "@/components/ui/grid-pattern";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout";

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
      "Chính thức mang tên Trường Đại học Công nghệ Kỹ Thuật Thủ Đức, khẳng định vị thế giáo dục kỹ thuật quốc gia.",
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
    videoUrl: "https://www.youtube.com/embed/2kM3ExnN1N0",
  },
];

// Constants for timeline layout
const ITEM_WIDTH = 120; // Width of each timeline item in pixels
const TICK_SPACING = ITEM_WIDTH / 5; // 4 minor ticks between major ticks
const AXIS_Y_POSITION = 52; // Fixed Y position for the axis line (in pixels from top)
const DECORATIVE_TICKS_COUNT = 8; // Extra ticks on each side for infinite feel

// Clock-Style Mobile Timeline Component
function MobileTimelineScroll({
  activeIndex,
  onIndexChange,
}: {
  activeIndex: number;
  onIndexChange: (index: number) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate padding needed to center first/last items
  const sidePadding = containerWidth / 2 - ITEM_WIDTH / 2;

  // Measure container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Scroll to center a specific item
  const scrollToItem = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      if (!scrollContainerRef.current || sidePadding <= 0) return;

      const scrollPosition = index * ITEM_WIDTH;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior,
      });
    },
    [sidePadding],
  );

  // Scroll to active item when it changes externally
  useEffect(() => {
    if (containerWidth > 0) {
      scrollToItem(activeIndex);
    }
  }, [activeIndex, scrollToItem, containerWidth]);

  // Handle scroll end to detect which item is centered
  const handleScrollEnd = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const centeredIndex = Math.round(scrollLeft / ITEM_WIDTH);
    const clampedIndex = Math.max(
      0,
      Math.min(centeredIndex, TIMELINE_EVENTS.length - 1),
    );

    if (clampedIndex !== activeIndex) {
      onIndexChange(clampedIndex);
    }
  }, [activeIndex, onIndexChange]);

  // Debounced scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 80);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
    };
  }, [handleScrollEnd]);

  // Handle item click
  const handleItemClick = (index: number) => {
    onIndexChange(index);
    scrollToItem(index);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        if (index > 0) {
          onIndexChange(index - 1);
          itemRefs.current[index - 1]?.focus();
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (index < TIMELINE_EVENTS.length - 1) {
          onIndexChange(index + 1);
          itemRefs.current[index + 1]?.focus();
        }
        break;
      case "Home":
        e.preventDefault();
        onIndexChange(0);
        itemRefs.current[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        onIndexChange(TIMELINE_EVENTS.length - 1);
        itemRefs.current[TIMELINE_EVENTS.length - 1]?.focus();
        break;
    }
  };

  // Generate clock-style tick marks
  const renderTickMarks = () => {
    const ticks = [];
    const totalItems = TIMELINE_EVENTS.length;

    // LEFT decorative ticks (outside content, visual only)
    for (let i = DECORATIVE_TICKS_COUNT; i > 0; i--) {
      ticks.push(
        <div
          key={`left-deco-${i}`}
          className="absolute w-px h-2 bg-gray-200/60 z-[1]"
          style={{
            left: `${sidePadding - i * TICK_SPACING}px`,
            top: `${AXIS_Y_POSITION - 4}px`,
          }}
          aria-hidden="true"
        />,
      );
    }

    // Main timeline ticks
    for (let i = 0; i < totalItems; i++) {
      const isActiveTick = i === activeIndex;

      // Major tick at each event - HIDE when active (center line replaces it)
      ticks.push(
        <div
          key={`major-${i}`}
          className={cn(
            "absolute w-0.5 h-4 z-[-1] transition-opacity duration-200",
            isActiveTick ? "opacity-0" : "bg-gray-300 opacity-100",
          )}
          style={{
            left: `${sidePadding + i * ITEM_WIDTH + ITEM_WIDTH / 2}px`,
            top: `${AXIS_Y_POSITION - 8}px`,
          }}
          aria-hidden="true"
        />,
      );

      // Minor ticks between events (except after last item)
      if (i < totalItems - 1) {
        for (let j = 1; j < 5; j++) {
          ticks.push(
            <div
              key={`minor-${i}-${j}`}
              className="absolute w-px h-2 bg-gray-200 z-[1]"
              style={{
                left: `${sidePadding + i * ITEM_WIDTH + ITEM_WIDTH / 2 + j * TICK_SPACING}px`,
                top: `${AXIS_Y_POSITION - 4}px`,
              }}
              aria-hidden="true"
            />,
          );
        }
      }
    }

    // RIGHT decorative ticks (outside content, visual only)
    const lastItemEnd =
      sidePadding + (totalItems - 1) * ITEM_WIDTH + ITEM_WIDTH / 2;
    for (let i = 1; i <= DECORATIVE_TICKS_COUNT; i++) {
      ticks.push(
        <div
          key={`right-deco-${i}`}
          className="absolute w-px h-2 bg-gray-200/60 z-[1]"
          style={{
            left: `${lastItemEnd + i * TICK_SPACING}px`,
            top: `${AXIS_Y_POSITION - 4}px`,
          }}
          aria-hidden="true"
        />,
      );
    }

    return ticks;
  };

  // Calculate total timeline width
  const timelineWidth = sidePadding * 2 + TIMELINE_EVENTS.length * ITEM_WIDTH;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide py-4 touch-pan-x relative z-[5]"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
        role="listbox"
        aria-label="Mốc lịch sử phát triển trường"
        aria-activedescendant={`timeline-item-${activeIndex}`}
      >
        {/* Timeline track */}
        <div
          className="relative"
          style={{
            width: `${timelineWidth}px`,
            height: "100px",
          }}
        >
          {/* Tick marks */}
          {renderTickMarks()}

          {/* Timeline items */}
          {TIMELINE_EVENTS.map((event, index) => {
            const isActive = index === activeIndex;
            const startYear = event.yearRange.split(" - ")[0];

            return (
              <button
                key={event.yearRange}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                id={`timeline-item-${index}`}
                role="option"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleItemClick(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="absolute top-0 bottom-0 flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg z-[10]"
                style={{
                  left: `${sidePadding + index * ITEM_WIDTH}px`,
                  width: `${ITEM_WIDTH}px`,
                  scrollSnapAlign: "center",
                }}
              >
                {/* Year label - TOP with Y animation when selected */}
                <motion.div
                  className={cn(
                    "absolute text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap z-[15]",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  )}
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -4 : 0,
                  }}
                  style={{ top: "8px" }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  {startYear}
                </motion.div>

                {/* Title label - BOTTOM */}
                <motion.span
                  className={cn(
                    "absolute text-[11px] text-center rounded-3xl line-clamp-2 px-1 leading-tight w-full z-[15]",
                    isActive
                      ? "text-blue-600 font-semibold backdrop-blur-xl"
                      : "text-gray-500 backdrop-blur-xl rounded-3xl",
                  )}
                  style={{ top: `${AXIS_Y_POSITION + 12}px` }}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  {event.title}
                </motion.span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center indicator line - BEHIND items but visible */}
      <div
        className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none z-[2]"
        aria-hidden="true"
      >
        <div className="w-1 h-full bg-blue-600 rounded-full shadow-sm" />
      </div>

      {/* Edge fade gradients - highest z-index */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-[20]"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-[20]"
        aria-hidden="true"
      />

      {/* Navigation hints for screen readers */}
      <div className="sr-only" aria-live="polite">
        {`Đang chọn: ${TIMELINE_EVENTS[activeIndex].yearRange} - ${TIMELINE_EVENTS[activeIndex].title}`}
      </div>
    </div>
  );
}

export default function VideoIntroduction() {
  const [activeIndex, setActiveIndex] = useState(TIMELINE_EVENTS.length - 1);
  const activeEvent = TIMELINE_EVENTS[activeIndex];

  const tabItems = TIMELINE_EVENTS.map((event, index) => ({
    label: event.yearRange,
    value: index,
  }));

  return (
    <section
      id="history"
      className="bg-white h-auto relative py-12 overflow-hidden"
    >
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
            "inset-x-0 inset-y-[-30%] h-[100%] skew-y-12",
          )}
        />
      </div>

      <Container className="text-center relative">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            KHÁM PHÁ
            <AuroraText
              className="px-2"
              colors={["#0c4ebfff", "#1760dfff", "#ae0303ff"]}
            >
              HCM-UTE
            </AuroraText>
          </h2>
          <p className="text-base lg:text-lg text-gray-600 mx-auto">
            Hành trình 63 năm xây dựng và phát triển của Trường Đại học Công
            nghệ Kỹ thuật TP.HCM
          </p>
        </motion.div>

        {/* Desktop Tabs */}
        <motion.div
          className="mb-8 lg:mb-12 hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-center">
            <AnimatedTabs
              items={tabItems}
              activeIndex={activeIndex}
              onTabChange={setActiveIndex}
              className="w-full max-w-5xl overflow-x-auto scrollbar-hide"
              layoutId="timeline-tab-indicator"
            />
          </div>
        </motion.div>

        {/* Mobile Timeline Scroll */}
        <motion.div
          className="mb-6 md:hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MobileTimelineScroll
            activeIndex={activeIndex}
            onIndexChange={setActiveIndex}
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl">
              <div className="aspect-video">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
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
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <div className="text-foreground text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="space-y-6 lg:space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <div className="flex flex-col gap-2 mb-4">
                    <span className="text-2xl lg:text-4xl font-bold text-blue-600">
                      {activeEvent.yearRange}
                    </span>
                    <h3 className="text-xl lg:text-3xl font-bold text-foreground">
                      {activeEvent.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                    {activeEvent.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
