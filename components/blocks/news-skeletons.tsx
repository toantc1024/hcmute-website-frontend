"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Category Tabs Skeleton                                             */
/* ------------------------------------------------------------------ */
export function CategoryTabsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-2 overflow-hidden py-1", className)}>
      {[80, 96, 88, 104, 72, 92, 84].map((w, i) => (
        <Skeleton
          key={i}
          className="h-9 flex-shrink-0 rounded-full"
          style={{ width: `${w}px` }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bento Grid Skeleton                                                */
/* ------------------------------------------------------------------ */
export function BentoGridSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-2.5 sm:gap-3 lg:grid-cols-2", className)}>
      {/* Hero skeleton */}
      <Skeleton className="min-h-[240px] rounded-lg sm:min-h-[320px] md:min-h-[400px]" />

      {/* 4 small cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="aspect-[16/10] rounded-lg" />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category Carousel Section Skeleton                                 */
/* ------------------------------------------------------------------ */
export function CategoryCarouselSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Header: title + xem thêm */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40 rounded" />
        <Skeleton className="h-5 w-20 rounded" />
      </div>

      {/* Card track */}
      <div className="flex gap-3 overflow-hidden sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-[280px] shrink-0 sm:w-[300px] md:w-[320px] lg:w-[340px]"
          >
            <div className="overflow-hidden rounded-xl bg-white">
              <Skeleton className="aspect-[3/2] w-full" />
              <div className="flex flex-col gap-2.5 p-4 sm:p-5">
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  All Category Sections Skeleton                                     */
/* ------------------------------------------------------------------ */
export function AllCategoriesLoadingSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("space-y-10 sm:space-y-14", className)}>
      {[...Array(3)].map((_, i) => (
        <CategoryCarouselSkeleton key={i} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category Section Skeleton (tabs + grid + view more)                */
/* ------------------------------------------------------------------ */
export function NewsSectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <CategoryTabsSkeleton />
      <BentoGridSkeleton />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  News List Card Skeleton (for category detail page)                 */
/* ------------------------------------------------------------------ */
export function NewsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl bg-white", className)}>
      <Skeleton className="aspect-[3/2] w-full" />
      <div className="flex flex-col gap-2.5 p-4 sm:p-5">
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
