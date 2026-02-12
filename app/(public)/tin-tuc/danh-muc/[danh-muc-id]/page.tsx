"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Search, ChevronDown, Loader2, ChevronRight } from "lucide-react";
import {
  postsApi,
  categoriesApi,
  tagsApi,
  type PostAuditView,
  type CategoryView,
  type TagView,
} from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout";
import { NewsListCard } from "@/components/blocks/news-bento";
import { NewsCardSkeleton } from "@/components/blocks/news-skeletons";

const ITEMS_PER_PAGE = 12;

export default function DanhMucPage() {
  const params = useParams();
  const categorySlug = params["danh-muc-id"] as string;

  const [category, setCategory] = useState<CategoryView | null>(null);
  const [posts, setPosts] = useState<PostAuditView[]>([]);
  const [tags, setTags] = useState<TagView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef<string | undefined>(undefined);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Resolve category from slug
  useEffect(() => {
    const resolveCategory = async () => {
      try {
        const response = await categoriesApi.getAllCategories({
          slug: categorySlug,
        });
        if (response.content.length > 0) {
          setCategory(response.content[0]);
        }
      } catch (error) {
        console.error("Failed to resolve category:", error);
      }
    };

    resolveCategory();
  }, [categorySlug]);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagsApi.getAllTags({});
        setTags(response.content);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags();
  }, []);

  // Fetch posts
  const fetchPosts = useCallback(
    async (loadMore = false) => {
      if (!category) return;

      try {
        if (loadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setPosts([]);
          cursorRef.current = undefined;
        }

        const response = await postsApi.getPublishedPosts({
          cursor: loadMore ? cursorRef.current : undefined,
          limit: ITEMS_PER_PAGE,
          categoryId: category.id,
          tagId: selectedTagId || undefined,
          search: debouncedSearch || undefined,
        });

        if (loadMore) {
          setPosts((prev) => [...prev, ...response.content]);
        } else {
          setPosts(response.content);
        }

        setHasMore(response.hasNext);
        cursorRef.current = response.cursor;
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, selectedTagId, debouncedSearch],
  );

  useEffect(() => {
    if (category) {
      fetchPosts(false);
    }
  }, [category, selectedTagId, debouncedSearch, fetchPosts]);

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="border-b border-neutral-200 bg-white">
        <Container className="py-10">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-neutral-400">
            <Link href="/" className="transition-colors hover:text-neutral-600">
              Trang chủ
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href="/tin-tuc"
              className="transition-colors hover:text-neutral-600"
            >
              Tin tức
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-neutral-700">
              {category?.name || "..."}
            </span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                {category?.name || "Đang tải..."}
              </h1>
              {category?.description && (
                <p className="mt-1.5 text-neutral-500">
                  {category.description}
                </p>
              )}
              <p className="mt-1 text-sm text-neutral-400">
                {loading
                  ? "Đang tải..."
                  : `${posts.length} bài viết${hasMore ? "+" : ""}`}
                {debouncedSearch && ` cho "${debouncedSearch}"`}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm trong danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-full border-neutral-200 bg-neutral-50 pl-11 transition-colors focus:bg-white"
              />
            </div>
          </div>

          {/* Tag filter */}
          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge
                variant={selectedTagId === null ? "default" : "outline"}
                className="cursor-pointer rounded-full px-3 py-1 text-xs transition-colors"
                onClick={() => setSelectedTagId(null)}
              >
                Tất cả
              </Badge>
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTagId === tag.id ? "default" : "outline"}
                  className="cursor-pointer rounded-full px-3 py-1 text-xs transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() =>
                    setSelectedTagId(selectedTagId === tag.id ? null : tag.id)
                  }
                >
                  {tag.name}
                  {tag.postCount != null && (
                    <span className="ml-1 text-neutral-400">
                      {tag.postCount}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </Container>
      </div>

      {/* ─── Content ────────────────────────────────────────── */}
      <Container className="py-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-neutral-400">
              Không tìm thấy bài viết
            </p>
            <p className="mt-1 text-sm text-neutral-400">
              {debouncedSearch
                ? "Thử tìm kiếm với từ khoá khác"
                : "Chưa có tin tức nào trong danh mục này"}
            </p>
            {(debouncedSearch || selectedTagId) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTagId(null);
                }}
              >
                Xoá bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => (
              <NewsListCard key={post.id} post={post} showCategory={false} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <p className="text-sm text-neutral-400">
              Đang hiển thị {posts.length} bài viết
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => fetchPosts(true)}
              disabled={loadingMore}
              className="gap-2 rounded-full border-2 px-8 transition-all hover:border-blue-300 hover:bg-blue-50"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  Xem thêm
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-1.5 text-neutral-400">
            <div className="h-px w-12 bg-neutral-200" />
            <span className="text-sm">
              Đã hiển thị tất cả {posts.length} bài viết
            </span>
          </div>
        )}
      </Container>
    </div>
  );
}
