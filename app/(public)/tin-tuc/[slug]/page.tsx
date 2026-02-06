"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  Eye,
  Share2,
  User,
  ChevronRight,
  ArrowLeft,
  Hash,
  Camera,
  ZoomIn,
  ZoomOut,
  List,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  GraduationCap,
  Search,
  BookOpen,
  Building2,
  Award,
  FileText,
  ExternalLink,
  Bookmark,
  Printer,
  MessageCircle,
  Sparkles,
  Volume2,
  Languages,
  FileDigit,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  postsApi,
  type PostDetailView,
  type PostAuditView,
} from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FLOWER_WHITE = "/assets/FLOWER_UTE_WHITE.png";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const calculateReadTime = (content: string) => {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} phút đọc`;
};

// Extract headings from HTML content for outline
const extractHeadings = (html: string) => {
  if (typeof window === "undefined") return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const headings: Array<{ level: number; text: string; id: string }> = [];

  doc.querySelectorAll("h1, h2, h3").forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1));
    const text = heading.textContent || "";
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ level, text, id });
  });

  return headings;
};

// Quick action links
const quickActions = [
  {
    title: "Khoa & Đơn vị",
    icon: Building2,
    items: [
      { name: "Khoa Công nghệ Thông tin", href: "/khoa/cntt" },
      { name: "Khoa Điện - Điện tử", href: "/khoa/dien" },
      { name: "Khoa Cơ khí", href: "/khoa/co-khi" },
      { name: "Khoa Kinh tế", href: "/khoa/kinh-te" },
    ],
  },
  {
    title: "Học bổng",
    icon: Award,
    items: [
      { name: "Học bổng khuyến khích", href: "/hoc-bong/khuyen-khich" },
      { name: "Học bổng tài trợ", href: "/hoc-bong/tai-tro" },
      { name: "Học bổng du học", href: "/hoc-bong/du-hoc" },
    ],
  },
  {
    title: "Tra cứu thông tin",
    icon: Search,
    items: [
      { name: "Tra cứu điểm thi", href: "/tra-cuu/diem-thi" },
      { name: "Tra cứu học phí", href: "/tra-cuu/hoc-phi" },
      { name: "Tra cứu lịch học", href: "/tra-cuu/lich-hoc" },
    ],
  },
];

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<PostDetailView | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<PostAuditView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [shareOpen, setShareOpen] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [processedContent, setProcessedContent] = useState("");

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsApi.getPostBySlug(slug);
      setPost(data);

      // Process content - add IDs to headings for navigation
      if (typeof window !== "undefined") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.content, "text/html");

        doc.querySelectorAll("h1, h2, h3").forEach((heading) => {
          if (!heading.id) {
            const id = (heading.textContent || "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
            heading.id = id;
          }
        });

        setProcessedContent(doc.body.innerHTML);
      } else {
        setProcessedContent(data.content);
      }

      // Fetch related posts
      if (data.categories?.[0]) {
        const related = await postsApi.getPublishedPosts({
          categoryId: data.categories[0].id,
          limit: 5,
        });
        setRelatedPosts(
          related.content.filter((p) => p.id !== data.id).slice(0, 4),
        );
      }
    } catch (err) {
      setError("Không tìm thấy bài viết");
      console.error("Failed to fetch post:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, fetchPost]);

  const headings = useMemo(() => {
    if (!processedContent) return [];
    return extractHeadings(processedContent);
  }, [processedContent]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: string) => {
    if (!post) return;
    const title = encodeURIComponent(post.title);
    const url = encodeURIComponent(shareUrl);

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      setShareOpen(false);
      return;
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setOutlineOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-xl font-medium text-foreground mb-2">
            {error || "Không tìm thấy bài viết"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Bài viết không tồn tại hoặc đã bị xóa
          </p>
          <Link href="/tin-tuc">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Hero Section - Full Width Cover Image with Title Overlay */}
        <section className="relative w-full overflow-hidden">
          {/* Cover Image - Full Width */}
          {post.coverImageUrl ? (
            <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh]">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                unoptimized
                className="object-cover"
                priority
              />
              {/* Blue Gradient Overlay from Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-800/60 via-slate-600/40 to-slate-900/20" />

              {/* White UTE Flower - Decorative (overflow hidden like footer) */}
              <motion.div
                className="absolute -top-32 -left-32 w-96 h-96 opacity-10 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Image
                  src={FLOWER_WHITE}
                  alt=""
                  fill
                  className="object-contain"
                />
              </motion.div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end">
                <div className="px-4 sm:px-8 lg:px-32 pb-8 sm:pb-12 lg:pb-16">
                  {/* Back Button & Breadcrumb */}
                  <motion.div
                    className="flex items-center gap-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Link href="/tin-tuc">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại
                      </Button>
                    </Link>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-white/70">
                      <Link
                        href="/"
                        className="hover:text-white transition-colors"
                      >
                        Trang chủ
                      </Link>
                      <ChevronRight className="w-4 h-4" />
                      <Link
                        href="/tin-tuc"
                        className="hover:text-white transition-colors"
                      >
                        Tin tức
                      </Link>
                      {post.categories?.[0] && (
                        <>
                          <ChevronRight className="w-4 h-4" />
                          <span className="text-white">
                            {post.categories[0].name}
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    {post.title}
                  </motion.h1>

                  {/* Meta Info */}
                  <motion.div
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    {/* Authors */}
                    <div className="flex flex-wrap items-center gap-x-2">
                      {post.authors?.map((author, i) => (
                        <span
                          key={author.id}
                          className="flex items-center gap-1"
                        >
                          {i > 0 && <span>,</span>}
                          <span className="font-medium text-white">
                            {author.displayName}
                          </span>
                        </span>
                      ))}
                      {post.extendedAttributes?.Author && (
                        <span className="font-medium text-white">
                          {post.extendedAttributes.Author}
                        </span>
                      )}
                    </div>

                    <span className="text-white/50">·</span>
                    <time className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.publishedAt || post.createdAt)}
                    </time>
                    <span className="text-white/50">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {calculateReadTime(post.content)}
                    </span>
                    <span className="text-white/50">·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.viewCount} lượt xem
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          ) : (
            /* Fallback when no cover image */
            <div className="relative w-full bg-gradient-to-br from-primary/90 via-primary to-primary/80 py-16 sm:py-20 lg:py-24 overflow-hidden">
              {/* White UTE Flower - Decorative */}
              <motion.div
                className="absolute -top-32 -left-32 w-96 h-96 opacity-15 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Image
                  src={FLOWER_WHITE}
                  alt=""
                  fill
                  className="object-contain"
                />
              </motion.div>

              <div className="px-4 sm:px-8 lg:px-32">
                {/* Back Button & Breadcrumb */}
                <motion.div
                  className="flex items-center gap-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Link href="/tin-tuc">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Quay lại
                    </Button>
                  </Link>
                  <div className="hidden sm:flex items-center gap-2 text-sm text-white/70">
                    <Link
                      href="/"
                      className="hover:text-white transition-colors"
                    >
                      Trang chủ
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link
                      href="/tin-tuc"
                      className="hover:text-white transition-colors"
                    >
                      Tin tức
                    </Link>
                    {post.categories?.[0] && (
                      <>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white">
                          {post.categories[0].name}
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Category Badge */}
                {post.categories?.[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Link href={`/tin-tuc?category=${post.categories[0].id}`}>
                      <Badge className="bg-white/20 hover:bg-white/30 text-white mb-4">
                        {post.categories[0].name}
                      </Badge>
                    </Link>
                  </motion.div>
                )}

                {/* Title */}
                <motion.h1
                  className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  {post.title}
                </motion.h1>

                {/* Meta Info */}
                <motion.div
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {post.authors?.map((author, i) => (
                    <span key={author.id} className="flex items-center gap-1">
                      {i > 0 && <span>,</span>}
                      <span className="font-medium text-white">
                        {author.displayName}
                      </span>
                    </span>
                  ))}
                  <span className="text-white/50">·</span>
                  <time className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </time>
                  <span className="text-white/50">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {calculateReadTime(post.content)}
                  </span>
                  <span className="text-white/50">·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {post.viewCount} lượt xem
                  </span>
                </motion.div>
              </div>
            </div>
          )}
        </section>

        {/* Main Content Area */}
        <div className="px-4 sm:px-8 lg:px-32 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Sidebar - Floating Actions (Fixed on scroll) */}
            <aside className="hidden lg:block w-16 flex-shrink-0">
              <div className="sticky top-24 flex flex-col gap-3">
                {/* AI Assistant Button */}
                <Popover open={aiOpen} onOpenChange={setAiOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-700 hover:from-blue-600 hover:via-blue-500 hover:to-blue-800 text-white shadow-xl shadow-blue-500/30 border-0 ring-4 ring-blue-300/30"
                        >
                          <Sparkles className="w-7 h-7" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">Trợ lý AI</TooltipContent>
                  </Tooltip>
                  <PopoverContent side="right" align="start" className="w-64">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">
                      TRỢ LÝ AI
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          // TODO: Implement voice summary
                          setAiOpen(false);
                        }}
                        className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                      >
                        <Volume2 className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Nghe tóm tắt</div>
                          <div className="text-xs text-muted-foreground">
                            AI đọc tóm tắt bài viết
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement full article audio
                          setAiOpen(false);
                        }}
                        className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                      >
                        <Headphones className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Nghe toàn bài</div>
                          <div className="text-xs text-muted-foreground">
                            AI đọc toàn bộ nội dung
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement AI summary
                          setAiOpen(false);
                        }}
                        className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                      >
                        <FileDigit className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Tóm tắt nội dung</div>
                          <div className="text-xs text-muted-foreground">
                            AI tóm tắt điểm chính
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement translate
                          setAiOpen(false);
                        }}
                        className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                      >
                        <Languages className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Dịch bài viết</div>
                          <div className="text-xs text-muted-foreground">
                            Dịch sang ngôn ngữ khác
                          </div>
                        </div>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Outline */}
                {headings.length > 0 && (
                  <Popover open={outlineOpen} onOpenChange={setOutlineOpen}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            className="rounded-full w-14 h-14 bg-white hover:bg-gray-100 text-gray-900 shadow-md border border-gray-200"
                          >
                            <List className="w-7 h-7" />
                          </Button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right">Mục lục</TooltipContent>
                    </Tooltip>
                    <PopoverContent
                      side="right"
                      align="start"
                      className="w-72 max-h-96 overflow-y-auto"
                    >
                      <p className="text-xs font-semibold text-muted-foreground mb-3">
                        MỤC LỤC
                      </p>
                      <div className="space-y-1">
                        {headings.map((h, i) => (
                          <button
                            key={i}
                            onClick={() => scrollToHeading(h.id)}
                            className={cn(
                              "block w-full text-left py-1.5 text-sm hover:text-primary transition-colors truncate",
                              h.level === 1 && "font-medium",
                              h.level === 2 && "pl-3 text-muted-foreground",
                              h.level === 3 &&
                                "pl-6 text-muted-foreground text-xs",
                            )}
                          >
                            {h.text}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Zoom Out */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full w-14 h-14 bg-white hover:bg-gray-100 text-gray-900 shadow-md border border-gray-200"
                      onClick={() =>
                        setFontSize((prev) => Math.max(14, prev - 2))
                      }
                    >
                      <ZoomOut className="w-7 h-7" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Thu nhỏ chữ</TooltipContent>
                </Tooltip>

                {/* Zoom In */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full w-14 h-14 bg-white hover:bg-gray-100 text-gray-900 shadow-md border border-gray-200"
                      onClick={() =>
                        setFontSize((prev) => Math.min(24, prev + 2))
                      }
                    >
                      <ZoomIn className="w-7 h-7" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Phóng to chữ</TooltipContent>
                </Tooltip>

                {/* Share */}
                <Popover open={shareOpen} onOpenChange={setShareOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full w-14 h-14 bg-white hover:bg-gray-100 text-gray-900 shadow-md border border-gray-200"
                        >
                          <Share2 className="w-7 h-7" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">Chia sẻ</TooltipContent>
                  </Tooltip>
                  <PopoverContent side="right" align="start" className="w-52">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">
                      CHIA SẺ BÀI VIẾT
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-sky-50 hover:text-sky-500 rounded-lg transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Link2 className="w-4 h-4" />
                        Sao chép link
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Print */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full w-14 h-14 bg-white hover:bg-gray-100 text-gray-900 shadow-md border border-gray-200"
                      onClick={() => window.print()}
                    >
                      <Printer className="w-7 h-7" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">In bài viết</TooltipContent>
                </Tooltip>
              </div>
            </aside>

            {/* Main Content */}
            <article className="flex-1 min-w-0 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Excerpt */}
                {post.excerpt && (
                  <div
                    className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 pb-8 border-b tiptap font-medium italic"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                )}

                {/* Extended Attributes */}
                {((post.extendedAttributes as any)?.["Photographer"] ||
                  (post.extendedAttributes as any)?.["Người chụp ảnh"] ||
                  (post.extendedAttributes as any)?.["Editor"] ||
                  (post.extendedAttributes as any)?.["Biên tập viên"]) && (
                  <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
                    {((post.extendedAttributes as any)?.["Photographer"] ||
                      (post.extendedAttributes as any)?.["Người chụp ảnh"]) && (
                      <span className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Ảnh:</span>
                        <span className="font-medium text-foreground">
                          {(post.extendedAttributes as any)?.["Photographer"] ||
                            (post.extendedAttributes as any)?.[
                              "Người chụp ảnh"
                            ]}
                        </span>
                      </span>
                    )}
                    {((post.extendedAttributes as any)?.["Editor"] ||
                      (post.extendedAttributes as any)?.["Biên tập viên"]) && (
                      <span className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                        <User className="w-3.5 h-3.5" />
                        <span>Biên tập:</span>
                        <span className="font-medium text-foreground">
                          {(post.extendedAttributes as any)?.["Editor"] ||
                            (post.extendedAttributes as any)?.["Biên tập viên"]}
                        </span>
                      </span>
                    )}
                  </div>
                )}

                {/* Content - TipTap HTML Render with Justified Text */}
                <div
                  className="tiptap-content text-justify"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                      THẺ BÀI VIẾT
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/tin-tuc?tag=${tag.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-primary hover:text-white transition-colors"
                        >
                          <Hash className="w-3 h-3" />
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Actions */}
                <div className="flex lg:hidden items-center justify-center gap-2 mt-8 pt-8 border-t flex-wrap">
                  <Button
                    size="sm"
                    className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-md"
                    onClick={() =>
                      setFontSize((prev) => Math.max(14, prev - 2))
                    }
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-md"
                    onClick={() =>
                      setFontSize((prev) => Math.min(24, prev + 2))
                    }
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Popover open={shareOpen} onOpenChange={setShareOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-md"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Chia sẻ
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <div className="space-y-1">
                        <button
                          onClick={() => handleShare("facebook")}
                          className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md"
                        >
                          <Facebook className="w-4 h-4" /> Facebook
                        </button>
                        <button
                          onClick={() => handleShare("twitter")}
                          className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md"
                        >
                          <Twitter className="w-4 h-4" /> Twitter
                        </button>
                        <button
                          onClick={() => handleShare("linkedin")}
                          className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md"
                        >
                          <Linkedin className="w-4 h-4" /> LinkedIn
                        </button>
                        <button
                          onClick={() => handleShare("copy")}
                          className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md"
                        >
                          <Link2 className="w-4 h-4" /> Sao chép link
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    size="sm"
                    className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-md"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    In
                  </Button>
                </div>
              </motion.div>
            </article>

            {/* Right Sidebar - Related News First (Fixed on scroll) */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Related Posts - Sidebar Version */}
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Tin liên quan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {relatedPosts.length > 0 ? (
                      <div className="space-y-4">
                        {relatedPosts.slice(0, 4).map((related, idx) => (
                          <Link
                            key={related.id}
                            href={`/tin-tuc/${related.slug}`}
                            className="group flex gap-3"
                          >
                            {related.coverImageUrl && (
                              <div className="relative w-20 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                <Image
                                  src={related.coverImageUrl}
                                  alt={related.title}
                                  fill
                                  unoptimized
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                {related.title}
                              </h4>
                              <time className="text-xs text-muted-foreground mt-1 block">
                                {formatDate(
                                  related.publishedAt || related.createdAt,
                                )}
                              </time>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Chưa có bài viết liên quan
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Category Card */}
                {post.categories?.[0] && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Danh mục
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Link
                        href={`/tin-tuc?category=${post.categories[0].id}`}
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        {post.categories[0].name}
                      </Link>
                      {post.categories[0].description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {post.categories[0].description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Truy cập nhanh</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {quickActions.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <section.icon className="w-4 h-4 text-primary" />
                            {section.title}
                          </div>
                          <div className="space-y-1 pl-6">
                            {section.items.map((item, i) => (
                              <Link
                                key={i}
                                href={item.href}
                                className="flex items-center justify-between py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item.name}
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>

          {/* Related Posts - Bottom Grid */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-8 border-t">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Bài viết liên quan khác
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/tin-tuc/${related.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      {related.coverImageUrl && (
                        <div className="relative aspect-video bg-muted">
                          <Image
                            src={related.coverImageUrl}
                            alt={related.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                          {related.title}
                        </h3>
                        <time className="text-xs text-muted-foreground">
                          {formatDate(related.publishedAt || related.createdAt)}
                        </time>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
