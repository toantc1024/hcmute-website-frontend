"use client";

import { useState, useEffect, useCallback } from "react";
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
import { CategoryTabs } from "@/components/blocks/category-tabs";
import { NewsBentoGrid, NewsListCard } from "@/components/blocks/news-bento";
import {
  NewsCardSkeleton,
  NewsSectionSkeleton,
  BentoGridSkeleton,
} from "@/components/blocks/news-skeletons";

const POSTS_PER_CATEGORY = 5; // 1 hero + 4 small

export default function TinTucPage() {
  const [categories, setCategories] = useState<CategoryView[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [categoryPostsMap, setCategoryPostsMap] = useState<
    Record<string, PostAuditView[]>
  >({});
  const [searchResults, setSearchResults] = useState<PostAuditView[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [searching, setSearching] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const catResponse = await categoriesApi.getAllCategories({});
        setCategories(catResponse.content);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch posts for a category (with caching)
  const fetchCategoryPosts = useCallback(
    async (categoryId: string | null) => {
      const cacheKey = categoryId ?? "__all__";
      if (categoryPostsMap[cacheKey]) return;

      try {
        setLoadingPosts(true);
        const res = await postsApi.getPublishedPosts({
          ...(categoryId && { categoryId }),
          limit: POSTS_PER_CATEGORY,
        });
        setCategoryPostsMap((prev) => ({
          ...prev,
          [cacheKey]: res.content,
        }));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    },
    [categoryPostsMap],
  );

  // Load posts when active category changes
  useEffect(() => {
    fetchCategoryPosts(activeCategoryId);
  }, [activeCategoryId, fetchCategoryPosts]);

  // Search
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

  const isSearchMode = debouncedSearch.length > 0;
  const cacheKey = activeCategoryId ?? "__all__";
  const currentPosts = categoryPostsMap[cacheKey] ?? [];

  // Build category detail link
  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* ─── Header ───────────────────────────────────────────── */}
      <div className="border-b border-neutral-200 bg-white">
        <Container className="py-6">
          <Link
            href="/"
            className="mb-3 inline-flex text-sm text-neutral-400 transition-colors hover:text-neutral-600"
          >
            ← Trang chủ
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <h1 className="shrink-0 text-2xl font-bold text-neutral-900 sm:text-3xl">
              Tin tức & Sự kiện
            </h1>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm tin tức..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-full border-neutral-200 bg-neutral-50 pl-11 text-sm transition-colors focus:bg-white sm:h-12"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* ─── Content ──────────────────────────────────────────── */}
      <Container className="py-8">
        {isSearchMode ? (
          /* ── Search results ── */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                {searching
                  ? "Đang tìm kiếm..."
                  : `${searchResults.length} kết quả cho "${debouncedSearch}"`}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Xoá tìm kiếm
              </Button>
            </div>

            {searching ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-neutral-400">
                  Không tìm thấy kết quả
                </p>
                <p className="mt-1 text-sm text-neutral-400">
                  Thử tìm kiếm với từ khoá khác
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((post) => (
                  <NewsListCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Category tabs + Bento grid ── */
          <div className="space-y-8">
            {/* Category tabs */}
            {loading ? (
              <NewsSectionSkeleton />
            ) : (
              <>
                <CategoryTabs
                  categories={categories}
                  activeId={activeCategoryId}
                  onSelect={setActiveCategoryId}
                />

                {/* Bento Grid */}
                {loadingPosts ? (
                  <BentoGridSkeleton />
                ) : currentPosts.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-lg font-medium text-neutral-400">
                      Chưa có tin tức nào
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                      Hãy quay lại sau nhé
                    </p>
                  </div>
                ) : (
                  <>
                    <NewsBentoGrid posts={currentPosts} />

                    {/* "Xem thêm" button */}
                    <div className="flex justify-center pt-2">
                      <Link
                        href={
                          activeCategory
                            ? `/tin-tuc/danh-muc/${activeCategory.slug}`
                            : "/tin-tuc/danh-muc/all"
                        }
                      >
                        <Button
                          variant="outline"
                          className="group gap-2 rounded-full border-neutral-300 px-6 hover:border-blue-600 hover:text-blue-600"
                        >
                          Xem thêm
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
