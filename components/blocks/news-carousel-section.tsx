"use client";

import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewsListCard } from "@/components/blocks/news-bento";
import type { PostAuditView } from "@/lib/api-client";
import type { CategoryView } from "@/lib/api-client";

/* ------------------------------------------------------------------ */
/*  Section: category title + "Xem thêm" + horizontal card carousel    */
/* ------------------------------------------------------------------ */

interface NewsCategoryCarouselProps {
  category: CategoryView;
  posts: PostAuditView[];
  className?: string;
}

export function NewsCategoryCarousel({
  category,
  posts,
  className,
}: NewsCategoryCarouselProps) {
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
  }, [checkScroll, posts]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 300;
    el.scrollBy({
      left: dir === "left" ? -cardWidth - 12 : cardWidth + 12,
      behavior: "smooth",
    });
  };

  if (posts.length === 0) return null;

  return (
    <section className={cn("space-y-3 sm:space-y-4", className)}>
      {/* ── Header row: Title left — "Xem thêm" right ── */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-neutral-900 sm:text-xl md:text-2xl">
          {category.name}
        </h2>
        <Link
          href={`/tin-tuc/danh-muc/${category.slug}`}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          Xem thêm
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* ── Carousel ── */}
      <div className="relative group/carousel">
        {/* Left nav */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg sm:-left-4 sm:h-10 sm:w-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-neutral-600 sm:h-5 sm:w-5" />
          </button>
        )}

        {/* Right nav */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg sm:-right-4 sm:h-10 sm:w-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-neutral-600 sm:h-5 sm:w-5" />
          </button>
        )}

        {/* Blur masks */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-neutral-50/80 to-transparent transition-opacity duration-300 sm:w-12",
            canScrollLeft ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-neutral-50/80 to-transparent transition-opacity duration-300 sm:w-12",
            canScrollRight ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-1 sm:gap-4"
        >
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-[260px] shrink-0 sm:w-[280px] md:w-[300px] lg:w-[320px]"
            >
              <NewsListCard post={post} showCategory={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
