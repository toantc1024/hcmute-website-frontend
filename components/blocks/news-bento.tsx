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
          <span className="text-2xl font-bold text-white/20">HCMUTE</span>
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
    <div className="flex items-center gap-3 text-xs text-white/60">
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
        "group relative block overflow-hidden rounded-2xl",
        className,
      )}
    >
      <CoverImage
        post={post}
        className="aspect-[4/3] sm:aspect-auto sm:h-full"
      />

      {/* Bottom content overlay */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-6">
        {post.categories?.[0] && (
          <span className="w-fit rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {post.categories[0].name}
          </span>
        )}
        <h3 className="line-clamp-3 text-lg font-bold leading-snug text-white sm:text-xl lg:text-2xl">
          {post.title}
        </h3>
        {post.excerpt && (
          <div
            className="line-clamp-2 hidden text-sm leading-relaxed text-white/70 sm:block"
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
        "group relative block overflow-hidden rounded-xl",
        className,
      )}
    >
      <CoverImage post={post} className="aspect-[16/10]" />

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-white sm:text-sm">
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
    <div className={cn("grid gap-3 lg:grid-cols-2", className)}>
      {/* Hero — left side, full height */}
      <BentoHeroCard post={hero} className="min-h-[280px] sm:min-h-[360px]" />

      {/* 4 small cards — right side, 2×2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {smallCards.map((post) => (
          <BentoSmallCard key={post.id} post={post} />
        ))}
        {/* If less than 4, fill with placeholders */}
        {smallCards.length < 4 &&
          [...Array(4 - smallCards.length)].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-300"
            >
              Sắp cập nhật
            </div>
          ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  News List Card — for the list/grid view in category detail         */
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
      <article className="relative h-full overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-lg">
        {/* Thumbnail with overlay */}
        <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
          <CoverImage post={post} />

          {/* Category badge */}
          {showCategory && post.categories?.[0] && (
            <div className="absolute left-3 top-3 z-10">
              <span className="inline-flex rounded-full border border-white/20 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-800 shadow-sm backdrop-blur-sm">
                {post.categories[0].name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5 p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-blue-600">
            {post.title}
          </h3>

          {/* Excerpt — slides open on hover */}
          {post.excerpt && (
            <div
              className="line-clamp-2 max-h-0 overflow-hidden text-xs leading-relaxed text-neutral-500 transition-all duration-300 group-hover:max-h-16"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 pt-1 text-xs text-neutral-400">
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
