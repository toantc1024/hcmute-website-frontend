"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, Eye, ChevronDown, Loader2 } from "lucide-react";
import {
  postsApi,
  categoriesApi,
  type PostAuditView,
  type CategoryView,
} from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ITEMS_PER_PAGE = 12;

export default function TinTucPage() {
  const [posts, setPosts] = useState<PostAuditView[]>([]);
  const [categories, setCategories] = useState<CategoryView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef<string | undefined>(undefined);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Fetch posts (initial or load more)
  const fetchPosts = useCallback(
    async (loadMore = false) => {
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
          categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
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
    [selectedCategory, debouncedSearch],
  );

  // Initial load and filter changes
  useEffect(() => {
    fetchPosts(false);
  }, [selectedCategory, debouncedSearch, fetchPosts]);

  const selectedCategoryName =
    selectedCategory !== "all"
      ? categories?.find((c) => c.id === selectedCategory)?.name
      : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="px-4 sm:px-8 lg:px-32 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Trang chủ
          </Link>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm tin tức..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>

          {/* Category Dropdown */}
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-[180px] h-10">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                  {category.postCount !== undefined && (
                    <span className="ml-1 text-muted-foreground">
                      ({category.postCount})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Page Title & Stats */}
      <div className="px-4 sm:px-8 lg:px-32 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {selectedCategoryName || "Tin tức"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {loading
                ? "Đang tải..."
                : `${posts.length} bài viết${hasMore ? "+" : ""}`}
              {debouncedSearch && ` cho "${debouncedSearch}"`}
            </p>
          </div>

          {/* Category Tags - Quick Filter */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap justify-end max-w-xl">
            {categories.slice(0, 5).map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? "all" : category.id,
                  )
                }
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-video rounded-xl bg-muted" />
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
                setSelectedCategory("all");
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        ) : (
          /* Grid View */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <Link href={`/tin-tuc/${post.slug}`} className="group block">
                  {/* Thumbnail */}
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
                      <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                        <span className="text-primary-foreground/50 text-2xl font-bold">
                          HCMUTE
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    {post.categories?.[0] && (
                      <Badge variant="secondary" className="text-xs">
                        {post.categories[0].name}
                      </Badge>
                    )}

                    <h2 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <div
                        className="text-sm text-muted-foreground line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
                    )}

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
        )}

        {/* Load More - Creative Button */}
        {hasMore && !loading && (
          <div className="mt-16 flex flex-col items-center gap-4">
            {/* Progress indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Đang hiển thị {posts.length} bài viết</span>
              <div className="w-8 h-px bg-border" />
              <span className="text-primary font-medium">Còn thêm nữa</span>
            </div>

            {/* Load more button */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => fetchPosts(true)}
              disabled={loadingMore}
              className="gap-3 px-8 py-6 text-base rounded-full border-2 hover:border-primary hover:bg-primary/5 transition-all"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tải thêm...
                </>
              ) : (
                <>
                  <span>Xem thêm bài viết</span>
                  <ChevronDown className="w-5 h-5" />
                </>
              )}
            </Button>

            {/* Decorative dots */}
            <div className="flex items-center gap-1 mt-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary/40"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* End of content indicator */}
        {!hasMore && posts.length > 0 && (
          <div className="mt-16 flex flex-col items-center gap-2 text-muted-foreground">
            <div className="w-12 h-px bg-border" />
            <span className="text-sm">
              Đã hiển thị tất cả {posts.length} bài viết
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
