"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "@/components/blocks/news-card";
import { cn } from "@/lib/utils";
import type { PostAuditView } from "@/lib/api-client";
import type { CategoryView } from "@/lib/api-client";

const FOLDER_COLORS = [
  { bg: "bg-blue-600", border: "border-blue-600", fill: "#2563eb" },
  { bg: "bg-emerald-600", border: "border-emerald-600", fill: "#059669" },
  { bg: "bg-violet-600", border: "border-violet-600", fill: "#7c3aed" },
  { bg: "bg-amber-600", border: "border-amber-600", fill: "#d97706" },
  { bg: "bg-rose-600", border: "border-rose-600", fill: "#e11d48" },
  { bg: "bg-cyan-600", border: "border-cyan-600", fill: "#0891b2" },
  { bg: "bg-orange-600", border: "border-orange-600", fill: "#ea580c" },
  { bg: "bg-indigo-600", border: "border-indigo-600", fill: "#4f46e5" },
];

interface NewsCategoryRowProps {
  category: CategoryView;
  posts: PostAuditView[];
  colorIndex?: number;
}

export function NewsCategoryRow({
  category,
  posts,
  colorIndex = 0,
}: NewsCategoryRowProps) {
  if (posts.length === 0) return null;

  const color = FOLDER_COLORS[colorIndex % FOLDER_COLORS.length];

  return (
    <section className="relative">
      {/* Folder tab — single SVG shape with text overlay, no seams */}
      <div className="relative flex items-end">
        <div className="relative">
          <svg
            className="block h-[42px]"
            style={{ minWidth: "120px" }}
            viewBox="0 0 200 42"
            preserveAspectRatio="xMinYMid meet"
            fill="none"
          >
            {/* Tab shape: rounded top-left, flat left, flat bottom, smooth curve down on right */}
            <path
              d="M0,42 L0,10 Q0,0 10,0 L160,0 Q170,0 175,5 C180,14 185,42 200,42 Z"
              fill={color.fill}
            />
          </svg>
          {/* Text overlay positioned on top of SVG */}
          <div className="absolute inset-0 flex items-center gap-2 pl-5 pr-12 pb-0.5">
            <h2 className="truncate text-sm font-bold text-white sm:text-base">
              {category.name}
            </h2>
            {category.postCount != null && (
              <span className="shrink-0 text-xs text-white/60">
                {category.postCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card container — top-left connects to tab, no gap */}
      <div
        className={cn(
          "overflow-hidden rounded-b-xl rounded-tr-xl border-2 border-t-0 bg-white",
          color.border,
        )}
      >
        {/* Top border to replace border-t under tab area */}
        <div className={cn("h-0.5 w-full", color.bg)} />

        {/* Posts grid */}
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.slice(0, 4).map((post) => (
            <NewsCard key={post.id} post={post} showCategory={false} />
          ))}
        </div>

        {/* Footer — Xem thêm button */}
        <div className="flex justify-end px-5 pb-4">
          <Link
            href={`/tin-tuc/danh-muc/${category.slug}`}
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg",
              color.bg,
            )}
          >
            Xem thêm
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
