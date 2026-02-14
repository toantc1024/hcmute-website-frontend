"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewsListCard } from "@/components/blocks/news-bento";
import { CarouselNavButton } from "@/components/blocks/carousel-nav-button";
import { DecorativeLine } from "@/components/blocks/decorative-line";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import type { PostAuditView, CategoryView } from "@/lib/api-client";

/* ------------------------------------------------------------------ */
/*  Carousel Nav Buttons — rendered inside Carousel context            */
/*  Only visible on hover of the entire section                        */
/* ------------------------------------------------------------------ */
function CarouselNavOverlay({ visible }: { visible: boolean }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();

  return (
    <>
      {/* Previous */}
      <div
        className={cn(
          "pointer-events-none absolute left-2 top-1/2 z-20 -translate-y-1/2 transition-all duration-300 sm:left-4 lg:left-16 xl:left-24 2xl:left-56",
          visible && canScrollPrev
            ? "pointer-events-auto translate-x-0 opacity-100"
            : "-translate-x-4 opacity-0",
        )}
      >
        <CarouselNavButton
          direction="prev"
          onClick={scrollPrev}
          size="md"
          variant="light"
        />
      </div>

      {/* Next */}
      <div
        className={cn(
          "pointer-events-none absolute right-2 top-1/2 z-20 -translate-y-1/2 transition-all duration-300 sm:right-4 lg:right-16 xl:right-24 2xl:right-56",
          visible && canScrollNext
            ? "pointer-events-auto translate-x-0 opacity-100"
            : "translate-x-4 opacity-0",
        )}
      >
        <CarouselNavButton
          direction="next"
          onClick={scrollNext}
          size="md"
          variant="light"
        />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Full-width category carousel (Visa-style)                          */
/*  Header stays in container padding, carousel bleeds to screen edge  */
/*  Nav buttons use CarouselNavButton, shown only on hover             */
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
  const [hovered, setHovered] = useState(false);

  if (posts.length === 0) return null;

  return (
    <section
      className={cn("space-y-4 sm:space-y-5", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Header row: Decorative line + Title + "Xem thêm" ── */}
      <div className="space-y-2">
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
        <DecorativeLine variant="light" />
      </div>

      {/* ── Full-width carousel — breaks out of container ── */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            skipSnaps: false,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 pl-6 pr-6 sm:-ml-4 sm:pl-12 sm:pr-12 lg:pl-24 lg:pr-24 xl:pl-32 xl:pr-32 2xl:pl-64 2xl:pr-64">
            {posts.map((post) => (
              <CarouselItem
                key={post.id}
                className="basis-[70%] pl-3 sm:basis-[40%] sm:pl-4 md:basis-[32%] lg:basis-[26%] xl:basis-[22%]"
              >
                <NewsListCard post={post} showCategory={false} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Nav buttons — only visible on section hover */}
          <CarouselNavOverlay visible={hovered} />
        </Carousel>
      </div>
    </section>
  );
}
