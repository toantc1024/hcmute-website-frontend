"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, Calendar, Eye, ChevronDown, X } from "lucide-react";
import {
  postsApi,
  categoriesApi,
  type PostAuditView,
  type CategoryView,
} from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function TinTucPage() {
  const [posts, setPosts] = useState<PostAuditView[]>([]);
  const [categories, setCategories] = useState<CategoryView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAllCategories({});
        setCategories(response.content);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch posts
  const fetchPosts = useCallback(
    async (loadMore = false) => {
      try {
        if (loadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setPosts([]);
        }

        const response = await postsApi.getPublishedPosts({
          cursor: loadMore ? cursor : undefined,
          limit: 12,
          categoryId: selectedCategory,
          search: searchQuery || undefined,
        });

        if (loadMore) {
          setPosts((prev) => [...prev, ...response.content]);
        } else {
          setPosts(response.content);
        }

        setHasMore(response.hasNext);
        setCursor(response.cursor);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [cursor, selectedCategory, searchQuery],
  );

  // Initial load and filter changes
  useEffect(() => {
    fetchPosts(false);
  }, [selectedCategory, searchQuery]);

  const selectedCategoryName = categories?.find(
    (c) => c.id === selectedCategory,
  )?.name;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="px-4 sm:px-8 lg:px-32 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Trang chủ
          </Link>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm tin tức..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? "secondary" : "ghost"}
            size="sm"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Lọc</span>
            {selectedCategory && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>

        {/* Category Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t overflow-hidden"
            >
              <div className="px-4 sm:px-8 lg:px-32 py-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground mr-2">
                    Danh mục:
                  </span>

                  <Button
                    variant={!selectedCategory ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setSelectedCategory(undefined)}
                  >
                    Tất cả
                  </Button>

                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "secondary" : "ghost"
                      }
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category.id
                            ? undefined
                            : category.id,
                        )
                      }
                    >
                      {category.name}
                      {category.postCount !== undefined && (
                        <span className="ml-1 text-muted-foreground">
                          ({category.postCount})
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page Title */}
      <div className="px-4 sm:px-8 lg:px-32 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-bold">
            {selectedCategoryName || "Tin tức"}
          </h1>
          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedCategory(undefined)}
            >
              <X className="w-3 h-3 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-video rounded-lg bg-muted" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Không tìm thấy tin tức</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(undefined);
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Link href={`/tin-tuc/${post.slug}`} className="group block">
                    {/* Thumbnail with gradient overlay */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted mb-3">
                      {post.coverImageUrl ? (
                        <Image
                          src={post.coverImageUrl}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white/50 text-2xl font-bold">
                            HCM-UTE
                          </span>
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      {/* Category */}
                      {post.categories?.[0] && (
                        <span className="text-xs font-medium text-primary">
                          {post.categories[0].name}
                        </span>
                      )}

                      {/* Title */}
                      <h2 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <div
                          className="text-sm text-muted-foreground line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        {post.viewCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.viewCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button
                  variant="outline"
                  onClick={() => fetchPosts(true)}
                  disabled={loadingMore}
                  className="gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-muted-foreground border-t-primary rounded-full animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      Xem thêm
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
