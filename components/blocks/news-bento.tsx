"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostAuditView } from "@/lib/api-client";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ------------------------------------------------------------------ */
/*  Shared cover image + overlay                                       */
/* ------------------------------------------------------------------ */
function CoverImage({
  post,
  className,
}: {
  post: PostAuditView;
  className?: string;
}) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {post.coverImageUrl ? (
        <Image
          src={post.coverImageUrl}
          alt={post.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
          <span className="text-2xl font-bold text-white/20">HCM-UTE</span>
        </div>
      )}

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

      {/* "Xem chi tiết" button — revealed on hover */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex translate-y-3 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:text-sm">
          Xem chi tiết
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

function PostMeta({ post }: { post: PostAuditView }) {
  return (
    <div className="flex items-center gap-3 text-[11px] sm:text-xs text-white/70">
      <span className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {formatDate(post.publishedAt || post.createdAt)}
      </span>
      {post.viewCount > 0 && (
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {post.viewCount.toLocaleString("vi-VN")}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bento Hero Card — the large featured card                          */
/* ------------------------------------------------------------------ */
export function BentoHeroCard({
  post,
  className,
}: {
  post: PostAuditView;
  className?: string;
}) {
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-lg",
        className,
      )}
    >
      <CoverImage
        post={post}
        className="aspect-[4/3] sm:aspect-auto sm:h-full"
      />

      {/* Bottom content overlay */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 sm:gap-2 p-4 sm:p-5 md:p-6">
        {post.categories?.[0] && (
          <span className="w-fit rounded bg-white/20 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {post.categories[0].name}
          </span>
        )}
        <h3 className="line-clamp-2 sm:line-clamp-3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-snug text-white drop-shadow-sm">
          {post.title}
        </h3>
        {post.excerpt && (
          <div
            className="line-clamp-2 hidden text-sm leading-relaxed text-white/80 sm:block drop-shadow-sm"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}
        <PostMeta post={post} />
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Bento Small Card — the 4 cards in the bottom row                   */
/* ------------------------------------------------------------------ */
export function BentoSmallCard({
  post,
  className,
}: {
  post: PostAuditView;
  className?: string;
}) {
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-lg",
        className,
      )}
    >
      <CoverImage post={post} className="aspect-[16/10]" />

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 sm:gap-1 p-2.5 sm:p-3 md:p-4">
        <h3 className="line-clamp-2 text-xs sm:text-sm md:text-base font-semibold leading-snug text-white drop-shadow-sm">
          {post.title}
        </h3>
        <PostMeta post={post} />
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Bento Grid — 1 hero + 4 small                                     */
/* ------------------------------------------------------------------ */
export function NewsBentoGrid({
  posts,
  className,
}: {
  posts: PostAuditView[];
  className?: string;
}) {
  if (posts.length === 0) return null;

  const [hero, ...rest] = posts;
  const smallCards = rest.slice(0, 4);

  return (
    <div className={cn("grid gap-2.5 sm:gap-3 lg:grid-cols-2", className)}>
      {/* Hero — left side, full height */}
      <BentoHeroCard
        post={hero}
        className="min-h-[240px] sm:min-h-[320px] md:min-h-[400px]"
      />

      {/* 4 small cards — right side, 2×2 grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {smallCards.map((post) => (
          <BentoSmallCard key={post.id} post={post} />
        ))}
        {/* If less than 4, fill with placeholders */}
        {smallCards.length < 4 &&
          [...Array(4 - smallCards.length)].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-300"
            >
              Sắp cập nhật
            </div>
          ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  News List Card — bigger, description, inset hover overlay          */
/* ------------------------------------------------------------------ */
export function NewsListCard({
  post,
  showCategory = true,
  className,
}: {
  post: PostAuditView;
  showCategory?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className={cn("group block", className)}
    >
      <article className="relative h-full overflow-hidden rounded-xl bg-white transition-shadow duration-300">
        {/* Thumbnail — taller ratio for bigger visual impact */}
        <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
              <span className="text-2xl font-bold text-white/20">HCM-UTE</span>
            </div>
          )}

          {/* Inset black overlay on hover */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/50" />

          {/* Category badge — top-left */}
          {showCategory && post.categories?.[0] && (
            <div className="absolute left-3 top-3 z-10">
              <span className="inline-flex rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-800 shadow-sm backdrop-blur-sm sm:text-xs">
                {post.categories[0].name}
              </span>
            </div>
          )}

          {/* "Xem chi tiết" CTA — center of image on hover */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="inline-flex translate-y-3 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:text-sm">
              Xem chi tiết
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* Text Content — bigger padding, always visible description */}
        <div className="flex flex-col gap-1.5 p-4 sm:p-5">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 sm:text-base">
            {post.title}
          </h3>

          {post.excerpt && (
            <div
              className="line-clamp-2 text-xs leading-relaxed text-neutral-500 sm:text-sm"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          )}

          <div className="flex items-center gap-3 pt-1.5 text-[11px] text-neutral-400 sm:text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            {post.viewCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.viewCount.toLocaleString("vi-VN")}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
