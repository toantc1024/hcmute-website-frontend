"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import {
  postsApi,
  categoriesApi,
  type PostAuditView,
  type CategoryView,
} from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout";
import { cn } from "@/lib/utils";
import { NewsBentoGrid, NewsListCard } from "@/components/blocks/news-bento";
import { NewsCategoryCarousel } from "@/components/blocks/news-carousel-section";
import {
  NewsCardSkeleton,
  AllCategoriesLoadingSkeleton,
  CategoryTabsSkeleton,
} from "@/components/blocks/news-skeletons";

const POSTS_PER_CATEGORY = 10;

export default function TinTucPage() {
  /* ── state ── */
  const [categories, setCategories] = useState<CategoryView[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [categoryPostsMap, setCategoryPostsMap] = useState<
    Record<string, PostAuditView[]>
  >({});
  const [searchResults, setSearchResults] = useState<PostAuditView[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingAllPosts, setLoadingAllPosts] = useState(false);
  const [searching, setSearching] = useState(false);

  /* ── debounced search ── */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ── fetch categories ── */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const catResponse = await categoriesApi.getAllCategories({});
        setCategories(catResponse.content);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  /* ── fetch posts for ALL categories in parallel ── */
  useEffect(() => {
    if (categories.length === 0) return;
    if (Object.keys(categoryPostsMap).length > 0) return;

    const fetchAll = async () => {
      setLoadingAllPosts(true);
      try {
        const results = await Promise.allSettled(
          categories.map(async (cat) => {
            const res = await postsApi.getPublishedPosts({
              categoryId: cat.id,
              limit: POSTS_PER_CATEGORY,
            });
            return { categoryId: cat.id, posts: res.content };
          }),
        );

        const map: Record<string, PostAuditView[]> = {};
        results.forEach((r) => {
          if (r.status === "fulfilled") {
            map[r.value.categoryId] = r.value.posts;
          }
        });
        setCategoryPostsMap(map);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoadingAllPosts(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  /* ── search ── */
  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    const search = async () => {
      try {
        setSearching(true);
        const res = await postsApi.getPublishedPosts({
          search: debouncedSearch,
          limit: 12,
        });
        setSearchResults(res.content);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setSearching(false);
      }
    };
    search();
  }, [debouncedSearch]);

  /* ── derived ── */
  const isSearchMode = debouncedSearch.length > 0;

  /** Categories that actually have posts */
  const categoriesWithPosts = useMemo(
    () =>
      categories.filter(
        (cat) => (categoryPostsMap[cat.id]?.length ?? 0) > 0,
      ),
    [categories, categoryPostsMap],
  );

  /** If a specific category is selected, only show that one */
  const visibleCategories = useMemo(() => {
    if (activeCategoryId === null) return categoriesWithPosts;
    return categoriesWithPosts.filter((c) => c.id === activeCategoryId);
  }, [activeCategoryId, categoriesWithPosts]);

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* ─── Header ───────────────────────────────────────────── */}
      <div className="border-b border-neutral-200 bg-white">
        <Container className="py-4 sm:py-6">
          <Link
            href="/"
            className="mb-2 inline-flex text-xs text-neutral-400 transition-colors hover:text-neutral-600 sm:mb-3 sm:text-sm"
          >
            ← Trang chủ
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <h1 className="shrink-0 text-xl font-bold text-neutral-900 sm:text-2xl md:text-3xl">
              Tin tức &amp; Sự kiện
            </h1>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 sm:left-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm tin tức..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full border-neutral-200 bg-neutral-50 pl-10 text-sm transition-colors focus:bg-white sm:h-11 sm:pl-11 md:h-12"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* ─── Content ──────────────────────────────────────────── */}
      <Container className="py-5 sm:py-8">
        {isSearchMode ? (
          /* ── Search results ── */
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-xs text-neutral-500 sm:text-sm">
                {searching
                  ? "Đang tìm kiếm..."
                  : `${searchResults.length} kết quả cho "${debouncedSearch}"`}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-xs sm:text-sm"
                onClick={() => setSearchQuery("")}
              >
                Xoá tìm kiếm
              </Button>
            </div>

            {searching ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-12 text-center sm:py-20">
                <p className="text-base font-medium text-neutral-400 sm:text-lg">
                  Không tìm thấy kết quả
                </p>
                <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                  Thử tìm kiếm với từ khoá khác
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((post) => (
                  <NewsListCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Category filter badges + per-category carousels ── */
          <div className="space-y-8 sm:space-y-12">
            {/* ── Top filter badges ── */}
            {loadingCategories ? (
              <CategoryTabsSkeleton />
            ) : (
              <CategoryFilterBadges
                categories={categoriesWithPosts}
                activeId={activeCategoryId}
                onSelect={setActiveCategoryId}
              />
            )}

            {/* ── Category sections ── */}
            {loadingAllPosts || loadingCategories ? (
              <AllCategoriesLoadingSkeleton />
            ) : visibleCategories.length === 0 ? (
              <div className="py-12 text-center sm:py-20">
                <p className="text-base font-medium text-neutral-400 sm:text-lg">
                  Chưa có tin tức nào
                </p>
                <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                  Hãy quay lại sau nhé
                </p>
              </div>
            ) : (
              <div className="space-y-10 sm:space-y-14">
                {/* Featured bento for the first visible category */}
                {visibleCategories.length > 0 &&
                  (categoryPostsMap[visibleCategories[0].id]?.length ?? 0) >=
                    3 && (
                    <section className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-neutral-900 sm:text-xl md:text-2xl">
                          {activeCategoryId === null
                            ? "Nổi bật"
                            : visibleCategories[0].name}
                        </h2>
                        {activeCategoryId === null && (
                          <Link
                            href="/tin-tuc/danh-muc/all"
                            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                          >
                            Xem thêm
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        )}
                      </div>
                      <NewsBentoGrid
                        posts={
                          categoryPostsMap[visibleCategories[0].id]?.slice(
                            0,
                            5,
                          ) ?? []
                        }
                      />
                    </section>
                  )}

                {/* Remaining categories as horizontal carousels */}
                {visibleCategories
                  .slice(
                    activeCategoryId !== null ||
                      (categoryPostsMap[visibleCategories[0]?.id]?.length ??
                        0) < 3
                      ? 0
                      : 1,
                  )
                  .map((cat) => (
                    <NewsCategoryCarousel
                      key={cat.id}
                      category={cat}
                      posts={categoryPostsMap[cat.id] ?? []}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

/* ================================================================== */
/*  Category Filter Badges                                             */
/*  "Tất cả" is fixed left, rest scroll horizontally                   */
/* ================================================================== */

function CategoryFilterBadges({
  categories,
  activeId,
  onSelect,
}: {
  categories: CategoryView[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Fixed "Tất cả" badge */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
          activeId === null
            ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
        )}
      >
        Tất cả
      </button>

      {/* Separator */}
      <div className="h-6 w-px shrink-0 bg-neutral-200" />

      {/* Scrollable category badges */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(activeId === cat.id ? null : cat.id)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              activeId === cat.id
                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
