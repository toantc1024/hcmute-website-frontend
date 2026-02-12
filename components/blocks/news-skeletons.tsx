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
    <div className={cn("grid gap-3 lg:grid-cols-2", className)}>
      {/* Hero skeleton */}
      <Skeleton className="min-h-[280px] rounded-2xl sm:min-h-[360px]" />

      {/* 4 small cards */}
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="aspect-[16/10] rounded-xl" />
        ))}
      </div>
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
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-neutral-200 bg-white",
        className,
      )}
    >
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
