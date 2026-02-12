"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface NewsCardProps {
  post: PostAuditView;
  /** Show category badge. Default true */
  showCategory?: boolean;
  className?: string;
}

export function NewsCard({
  post,
  showCategory = true,
  className,
}: NewsCardProps) {
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className={cn("group block", className)}
    >
      <article className="relative h-full overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
              <span className="text-xl font-bold text-white/40">HCMUTE</span>
            </div>
          )}

          {/* Hover overlay with arrow */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/10">
            <div className="flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4 text-neutral-800" />
            </div>
          </div>

          {/* Category badge */}
          {showCategory && post.categories?.[0] && (
            <div className="absolute left-3 top-3">
              <Badge
                variant="secondary"
                className="border border-white/20 bg-white/90 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur-sm"
              >
                {post.categories[0].name}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-blue-600">
            {post.title}
          </h3>

          {/* Excerpt — revealed on hover */}
          {post.excerpt && (
            <div
              className="line-clamp-2 max-h-0 overflow-hidden text-xs leading-relaxed text-neutral-500 transition-all duration-300 group-hover:max-h-20"
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
