"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryTab {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

interface CategoryTabsProps {
  categories: CategoryTab[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
}

export function CategoryTabs({
  categories,
  activeId,
  onSelect,
  className,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, categories]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative", className)}>
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg sm:-left-3"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4 text-neutral-600" />
        </button>
      )}

      {/* Scrollable area with blur masks */}
      <div className="relative overflow-hidden">
        {/* Left blur */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent transition-opacity duration-300",
            canScrollLeft ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Right blur */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent transition-opacity duration-300",
            canScrollRight ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth py-1"
        >
          {/* "Tất cả" tab */}
          <button
            onClick={() => onSelect(null)}
            className={cn(
              "flex-shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              activeId === null
                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
            )}
          >
            Tất cả
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "flex-shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                activeId === cat.id
                  ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
              )}
            >
              {cat.name}
              {cat.postCount !== undefined && cat.postCount > 0 && (
                <span
                  className={cn(
                    "ml-1.5 text-xs",
                    activeId === cat.id ? "text-white/70" : "text-neutral-400",
                  )}
                >
                  ({cat.postCount})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg sm:-right-3"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4 text-neutral-600" />
        </button>
      )}
    </div>
  );
}
