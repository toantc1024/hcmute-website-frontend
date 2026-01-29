"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  Tag,
  Folder,
  ChevronRight,
  X,
  ArrowUp,
  FileText,
  Send,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import {
  postsApi,
  categoriesApi,
  tagsApi,
  PostStatus,
  getPostStatusLabel,
  type PostAuditView,
  type CategorySimpleView,
  type TagSimpleView,
} from "@/features/posts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function getStatusBadgeVariant(
  status: PostStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case PostStatus.PUBLISHED:
      return "default";
    case PostStatus.DRAFT:
      return "secondary";
    case PostStatus.REJECTED:
      return "destructive";
    default:
      return "outline";
  }
}

interface PostsByCategory {
  category: CategorySimpleView | null;
  posts: PostAuditView[];
}

export default function BlogBrowsePage() {
  const { t } = useI18n();

  const [posts, setPosts] = useState<PostAuditView[]>([]);
  const [categories, setCategories] = useState<CategorySimpleView[]>([]);
  const [tags, setTags] = useState<TagSimpleView[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef<string | undefined>(undefined);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        const params: Record<string, unknown> = {
          cursor: reset ? undefined : cursorRef.current,
          size: 20,
        };

        if (selectedCategory && selectedCategory !== "all") {
          params.categoryId = selectedCategory;
        }
        if (selectedTags.length > 0) {
          params.tagIds = selectedTags;
        }
        if (searchQuery) {
          params.title = searchQuery;
        }
        if (selectedStatus && selectedStatus !== "all") {
          params.status = selectedStatus;
        }

        const response = await postsApi.getPosts(params);

        if (reset) {
          setPosts(response.content);
        } else {
          setPosts((prev) => [...prev, ...response.content]);
        }

        setHasMore(response.hasMore);
        cursorRef.current = response.nextCursor;
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, selectedTags, searchQuery, selectedStatus],
  );

  const fetchFilters = useCallback(async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        categoriesApi.getCategories({ size: 50 }),
        tagsApi.getTags({ size: 50 }),
      ]);
      setCategories(categoriesRes);
      setTags(tagsRes);
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    cursorRef.current = undefined;
    fetchPosts(true);
  }, [fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const postsByCategory = useMemo<PostsByCategory[]>(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const category = categories.find((c) => c.id === selectedCategory);
      return [{ category: category || null, posts }];
    }

    const grouped = new Map<string, PostAuditView[]>();
    const uncategorized: PostAuditView[] = [];

    posts.forEach((post) => {
      // Get category IDs from the post - they might be in a different property
      // For PostAuditView, categories might not be available directly
      // We'll group by the first category if available from the response
      // Since PostAuditView doesn't have categories, we'll show all in one group
      uncategorized.push(post);
    });

    // Group posts - since we don't have category info in audit view,
    // we'll display them as a flat list
    return [{ category: null, posts: uncategorized }];
  }, [posts, selectedCategory, categories]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedTags([]);
    setSelectedStatus("all");
    setSearchQuery("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== "all") ||
    selectedTags.length > 0 ||
    (selectedStatus && selectedStatus !== "all") ||
    searchQuery;

  const tagOptions = tags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: String(PostStatus.DRAFT), label: "Nháp" },
    { value: String(PostStatus.PENDING), label: "Chờ duyệt" },
    { value: String(PostStatus.PUBLISHED), label: "Đã xuất bản" },
    { value: String(PostStatus.REJECTED), label: "Từ chối" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Duyệt bài viết
          </h1>
          <p className="text-muted-foreground mt-1">
            Xem và quản lý tất cả bài viết theo danh mục
          </p>
        </div>
        <Button asChild>
          <Link href="/manage/posts/create">
            <Plus className="size-4 mr-2" />
            {t.posts.createPost}
          </Link>
        </Button>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Row */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Folder className="size-4" />
                    Danh mục
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="size-4" />
                    Thẻ
                  </label>
                  <MultiSelect
                    options={tagOptions}
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Chọn thẻ..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="size-4" />
                    Trạng thái
                  </label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      <X className="size-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Đang lọc:
                  </span>
                  {selectedCategory && selectedCategory !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      {categories.find((c) => c.id === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory("")}>
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    return tag ? (
                      <Badge key={tagId} variant="secondary" className="gap-1">
                        #{tag.name}
                        <button
                          onClick={() =>
                            setSelectedTags((prev) =>
                              prev.filter((id) => id !== tagId),
                            )
                          }
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                  {selectedStatus && selectedStatus !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      {
                        statusOptions.find((s) => s.value === selectedStatus)
                          ?.label
                      }
                      <button onClick={() => setSelectedStatus("all")}>
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {loading && posts.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="size-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Không tìm thấy bài viết
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Thử thay đổi bộ lọc hoặc tạo bài viết mới
              </p>
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                )}
                <Button asChild>
                  <Link href="/manage/posts/create">
                    <Plus className="size-4 mr-2" />
                    Tạo bài viết
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          {postsByCategory.map((group, groupIndex) => (
            <motion.div key={groupIndex} variants={itemVariants}>
              {group.category && (
                <div className="flex items-center gap-2 mb-4">
                  <Folder className="size-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {group.category.name}
                  </h2>
                  <Badge variant="secondary">{group.posts.length}</Badge>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link href={`/manage/blog/${post.id}`}>
                      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer border-transparent hover:border-primary/20">
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          {post.coverImageUrl ? (
                            <Image
                              src={post.coverImageUrl}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <FileText className="size-12 text-primary/30" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge variant={getStatusBadgeVariant(post.status)}>
                              {getPostStatusLabel(post.status)}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          {post.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {post.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3.5" />
                                {new Date(post.createdDate).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </span>
                              {post.viewCount > 0 && (
                                <span className="flex items-center gap-1">
                                  <Eye className="size-3.5" />
                                  {post.viewCount}
                                </span>
                              )}
                            </div>
                            <ChevronRight className="size-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {hasMore && (
            <motion.div variants={itemVariants} className="text-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => fetchPosts(false)}
                disabled={loading}
              >
                {loading ? "Đang tải..." : "Xem thêm bài viết"}
              </Button>
            </motion.div>
          )}
        </>
      )}

      {/* Scroll to Top */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </motion.div>
  );
}
