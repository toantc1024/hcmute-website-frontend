"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  X,
  ChevronRight,
  Clock,
  Eye,
  Calendar,
  Tag,
  Folder,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  postsApi,
  categoriesApi,
  tagsApi,
  type PostAuditView,
  type CategoryView,
  type TagView,
} from "@/lib/api-client";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function NewsPage() {
  const [posts, setPosts] = useState<PostAuditView[]>([]);
  const [categories, setCategories] = useState<CategoryView[]>([]);
  const [tags, setTags] = useState<TagView[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        const response = await postsApi.getPublishedPosts({
          cursor: reset ? undefined : cursor,
          limit: 12,
          categoryId: selectedCategory || undefined,
          tagId: selectedTags.length > 0 ? selectedTags[0] : undefined,
          search: searchQuery || undefined,
        });

        if (reset) {
          setPosts(response.content);
        } else {
          setPosts((prev) => [...prev, ...response.content]);
        }

        setHasMore(response.hasNext);
        setCursor(response.cursor);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [cursor, selectedCategory, selectedTags, searchQuery]
  );

  const fetchFilters = useCallback(async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        categoriesApi.getAllCategories({ size: 50 }),
        tagsApi.getAllTags({ size: 50 }),
      ]);
      setCategories(categoriesRes.content);
      setTags(tagsRes.content);
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    setCursor(undefined);
    fetchPosts(true);
  }, [selectedCategory, selectedTags, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setSearchQuery("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    selectedCategory || selectedTags.length > 0 || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="px-4 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Tin tức & Sự kiện
            </h1>
            <p className="text-blue-100 text-lg lg:text-xl leading-relaxed">
              Cập nhật những tin tức, sự kiện và thông báo mới nhất từ Trường Đại
              học Sư phạm Kỹ thuật TP.HCM
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm tin tức..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 h-12 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60 rounded-full focus:bg-white/20"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-16 xl:px-24 py-8 lg:py-12">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Folder className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Danh mục</h3>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Tất cả danh mục
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {category.name}
                      {category.postCount !== undefined && (
                        <span className="ml-2 text-xs text-gray-400">
                          ({category.postCount})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Thẻ</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedTags.includes(tag.id)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(true)}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
                {hasActiveFilters && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {(selectedCategory ? 1 : 0) + selectedTags.length}
                  </span>
                )}
              </Button>
            </div>

            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-wrap items-center gap-2"
              >
                <span className="text-sm text-gray-500">Đang lọc:</span>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId);
                  return tag ? (
                    <span
                      key={tagId}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      #{tag.name}
                      <button
                        onClick={() => handleTagToggle(tagId)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Xóa tất cả
                </button>
              </motion.div>
            )}

            {loading && posts.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
                  >
                    <div className="aspect-video bg-gray-200" />
                    <div className="p-5">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                      <div className="h-6 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-gray-500 mb-6">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/tin-tuc/${post.slug}`}>
                        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                          <div className="relative aspect-video overflow-hidden">
                            {post.coverImageUrl ? (
                              <Image
                                src={post.coverImageUrl}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <span className="text-white/50 text-4xl font-bold">
                                  HCMUTE
                                </span>
                              </div>
                            )}
                            {post.categories[0] && (
                              <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                                {post.categories[0].name}
                              </span>
                            )}
                          </div>
                          <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(
                                  post.publishedAt || post.createdAt
                                )}
                              </span>
                              {post.viewCount > 0 && (
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" />
                                  {post.viewCount}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-sm text-gray-500 line-clamp-2 flex-1">
                                {post.excerpt}
                              </p>
                            )}
                            <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                              Đọc thêm
                              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-10 text-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => fetchPosts(false)}
                      disabled={loading}
                      className="px-8"
                    >
                      {loading ? "Đang tải..." : "Xem thêm bài viết"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-64px)]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Folder className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Danh mục</h4>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      !selectedCategory
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    Tất cả danh mục
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Thẻ</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        selectedTags.includes(tag.id)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={() => {
                    clearFilters();
                    setShowMobileFilters(false);
                  }}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
