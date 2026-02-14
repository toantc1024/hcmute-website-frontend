"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  Copy,
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
  X,
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
import { Container } from "@/components/layout";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "numeric",
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

export default function NewsDetailContent() {
  const params = useParams();
  const router = useRouter();
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
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Reading progress — update DOM directly to avoid re-renders
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress}%`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  const handleZoom = (direction: "in" | "out") => {
    setFontSize((prev) => {
      const newSize = direction === "in" ? prev + 2 : prev - 2;
      return Math.min(Math.max(newSize, 14), 24);
    });
  };

  const handleAiSummary = async () => {
    if (!post) return;
    setIsAiSummarizing(true);
    setAiSummary(null);

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: post.content,
          title: post.title,
        }),
      });

      if (!res.ok || !res.body) {
        let errMsg = "Không thể tóm tắt bài viết.";
        try {
          const data = await res.json();
          errMsg = data.error || errMsg;
        } catch {}
        setAiSummary(errMsg);
        setIsAiSummarizing(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const payload = trimmed.slice(6);
          if (payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.error) {
              setAiSummary(parsed.error);
              setIsAiSummarizing(false);
              return;
            }
            if (parsed.token) {
              accumulated += parsed.token;
              setAiSummary(accumulated);
            }
          } catch {
            // skip
          }
        }
      }

      if (!accumulated) {
        setAiSummary("Không nhận được phản hồi từ AI.");
      }
    } catch {
      setAiSummary("Đã xảy ra lỗi khi kết nối. Vui lòng thử lại sau.");
    } finally {
      setIsAiSummarizing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[60]">
          <div
            ref={progressBarRef}
            className="h-full bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.6)] transition-[width] duration-150"
            style={{ width: "0%" }}
          />
        </div>

        <main className="w-full">
          {/* Hero Section */}
          <section
            ref={heroRef}
            className="relative w-full h-[50vh] sm:h-[55vh] lg:h-[65vh] min-h-[400px] lg:min-h-[500px] overflow-hidden group"
          >
            {/* Background Image */}
            {post.coverImageUrl ? (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                  priority
                />
                {/* Gradient Overlay - Lighter */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary via-primary/90 to-primary/80">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            {/* Photo/Author Credit on Cover */}
            {((post.extendedAttributes as any)?.["Photographer"] ||
              (post.extendedAttributes as any)?.["Người chụp ảnh"] ||
              post.authors?.[0] ||
              (post.extendedAttributes as any)?.["Author"]) && (
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex flex-col items-end gap-1 text-xs text-white/80">
                {((post.extendedAttributes as any)?.["Photographer"] ||
                  (post.extendedAttributes as any)?.["Người chụp ảnh"]) && (
                  <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Camera className="w-3 h-3" />
                    <span>
                      Ảnh:{" "}
                      {(post.extendedAttributes as any)?.["Photographer"] ||
                        (post.extendedAttributes as any)?.["Người chụp ảnh"]}
                    </span>
                  </span>
                )}
                {(post.authors?.[0] ||
                  (post.extendedAttributes as any)?.["Author"]) && (
                  <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <User className="w-3 h-3" />
                    <span>
                      Tác giả:{" "}
                      {post.authors?.[0]?.displayName ||
                        (post.extendedAttributes as any)?.["Author"]}
                    </span>
                  </span>
                )}
              </div>
            )}

            {/* Top Bar — uses Container padding for alignment */}
            <div className="absolute top-0 left-0 w-full z-20">
              <Container className="flex justify-between items-start py-4 sm:py-6">
                <Button
                  variant="secondary"
                  size="sm"
                  className="group/btn bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:pr-5"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover/btn:-translate-x-1" />
                  <span>Quay lại</span>
                </Button>

                {/* Mobile Share */}
                <div className="md:hidden">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                    onClick={copyLink}
                  >
                    {copied ? (
                      <span className="text-xs">OK</span>
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </Container>
            </div>
          </section>

          {/* Breadcrumb + Main Layout */}
          <Container className="py-8 sm:py-10 lg:py-14 pb-20 lg:pb-32">
            {/* Back + Breadcrumb row — same layout as /tin-tuc and /danh-muc */}
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="group/back inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
                <span className="hidden sm:inline">Quay lại</span>
              </button>
              <div className="h-4 w-px bg-border" />
              <nav className="flex items-center gap-1.5 overflow-hidden text-sm text-muted-foreground">
                <Link
                  href="/"
                  className="shrink-0 transition-colors hover:text-foreground"
                >
                  Trang chủ
                </Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                <Link
                  href="/tin-tuc"
                  className="shrink-0 transition-colors hover:text-foreground"
                >
                  Tin tức
                </Link>
                {post.categories?.[0] && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    <Link
                      href={`/tin-tuc/danh-muc/${post.categories[0].slug || post.categories[0].id}`}
                      className="shrink-0 transition-colors hover:text-foreground"
                    >
                      {post.categories[0].name}
                    </Link>
                  </>
                )}
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                <span className="max-w-[200px] truncate font-medium text-foreground">
                  {post.title}
                </span>
              </nav>
            </div>

            {/* Full Width Article Header */}
            <div className="mb-8 lg:mb-12">
              {/* Category Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories?.map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`/tin-tuc/danh-muc/${cat.slug || cat.id}`}
                  >
                    <Badge
                      variant={i === 0 ? "default" : "secondary"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        i === 0
                          ? "bg-primary hover:bg-primary/90"
                          : "hover:bg-muted",
                      )}
                    >
                      {cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6 tracking-tight">
                {post.title}
              </h1>

              {/* Meta Info Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>

                <div className="w-1 h-1 bg-muted-foreground/40 rounded-full hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{post.viewCount} lượt xem</span>
                </div>

                <div className="w-1 h-1 bg-muted-foreground/40 rounded-full hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>{calculateReadTime(post.content)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Buttons - Sticky in grid */}
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24 flex flex-col gap-3 items-center">
                  {/* Text Controls */}
                  <div className="flex flex-col gap-2 p-2 rounded-full bg-white shadow-md border border-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full border border-border"
                          onClick={() => handleZoom("in")}
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Phóng to</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full border border-border"
                          onClick={() => handleZoom("out")}
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Thu nhỏ</TooltipContent>
                    </Tooltip>
                  </div>

                  {/* AI Voice Button */}
                  <div className="p-2.5 rounded-full bg-primary shadow-md">
                    <Popover open={aiOpen} onOpenChange={setAiOpen}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-full text-primary-foreground hover:text-primary-foreground hover:bg-primary/80 transition-all border-0"
                            >
                              <Sparkles className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="right">Trợ lý AI</TooltipContent>
                      </Tooltip>
                      <PopoverContent
                        side="right"
                        align="start"
                        className="w-64"
                      >
                        <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                          Trợ lý AI
                        </p>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              handleAiSummary();
                              setAiOpen(false);
                            }}
                            className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                          >
                            <FileDigit className="w-5 h-5" />
                            <div className="text-left">
                              <div className="font-medium">
                                Tóm tắt nội dung
                              </div>
                              <div className="text-xs text-muted-foreground">
                                AI tóm tắt điểm chính
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => setAiOpen(false)}
                            className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-accent rounded-lg transition-colors"
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
                            onClick={() => setAiOpen(false)}
                            className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-accent rounded-lg transition-colors"
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
                            onClick={() => setAiOpen(false)}
                            className="flex items-center gap-3 w-full py-2.5 px-3 text-sm hover:bg-accent rounded-lg transition-colors"
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
                  </div>

                  {/* Outline */}
                  {headings.length > 0 && (
                    <div className="p-2.5 rounded-full bg-white shadow-md border border-border">
                      <Popover open={outlineOpen} onOpenChange={setOutlineOpen}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                              >
                                <List className="w-4 h-4" />
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
                          <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                            Mục lục
                          </p>
                          <div className="space-y-1">
                            {headings.map((h, i) => (
                              <button
                                key={i}
                                onClick={() => scrollToHeading(h.id)}
                                className={cn(
                                  "block w-full text-left py-1.5 text-sm hover:text-primary transition-colors truncate",
                                  h.level === 1 &&
                                    "font-medium text-foreground",
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
                    </div>
                  )}

                  {/* Share Controls */}
                  <div className="flex flex-col gap-2 p-2 rounded-full bg-white shadow-md border border-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-[#1877F2] hover:bg-[#1877F2]/10 rounded-full transition-all"
                          onClick={() => handleShare("facebook")}
                        >
                          <Facebook className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Facebook</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-[#1DA1F2] hover:bg-[#1DA1F2]/10 rounded-full transition-all"
                          onClick={() => handleShare("twitter")}
                        >
                          <Twitter className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Twitter</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                          onClick={copyLink}
                        >
                          {copied ? (
                            <span className="text-xs text-green-600 font-semibold">
                              ✓
                            </span>
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {copied ? "Đã sao chép!" : "Sao chép link"}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                          onClick={() => window.print()}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">In bài viết</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <article ref={contentRef} className="col-span-1 lg:col-span-7">
                {/* AI Summary Card */}
                <div className="mb-8 relative">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-2xl transition-all duration-500",
                      aiSummary || isAiSummarizing
                        ? "bg-gradient-to-br from-primary/5 to-background border border-primary/20 shadow-sm"
                        : "bg-background",
                    )}
                  >
                    {!aiSummary && !isAiSummarizing ? (
                      <button
                        onClick={handleAiSummary}
                        className="w-full group flex items-center justify-between p-4 pl-5 rounded-2xl bg-muted/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 border border-border hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-foreground text-sm">
                              Tóm tắt nội dung
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Sử dụng AI để nắm bắt nhanh thông tin
                            </div>
                          </div>
                        </div>
                        <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </button>
                    ) : (
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            <span>AI Summary</span>
                            {isAiSummarizing && (
                              <span className="ml-1 text-[10px] font-normal text-muted-foreground normal-case tracking-normal animate-pulse">
                                Đang tạo...
                              </span>
                            )}
                          </div>
                          {!isAiSummarizing && aiSummary && (
                            <button
                              onClick={() => setAiSummary(null)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {isAiSummarizing && !aiSummary ? (
                          <div className="space-y-3">
                            <div className="h-2.5 ai-shadow-line rounded-full w-full" />
                            <div
                              className="h-2.5 ai-shadow-line rounded-full w-[92%]"
                              style={{ animationDelay: "0.15s" }}
                            />
                            <div
                              className="h-2.5 ai-shadow-line rounded-full w-[78%]"
                              style={{ animationDelay: "0.3s" }}
                            />
                            <div
                              className="h-2.5 ai-shadow-line rounded-full w-[60%]"
                              style={{ animationDelay: "0.45s" }}
                            />
                          </div>
                        ) : (
                          <p className="text-foreground/80 leading-relaxed text-[15px] transition-opacity duration-300">
                            {aiSummary}
                            {isAiSummarizing && (
                              <span className="inline-block w-0.5 h-[1em] bg-primary/60 ml-0.5 align-middle animate-pulse" />
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Excerpt */}
                {post.excerpt && (
                  <div
                    className="text-lg sm:text-xl text-foreground/70 leading-relaxed mb-8 pb-8 border-b-2 border-primary/20 font-medium tiptap italic pl-4 border-l-4 border-l-primary/40"
                    style={{ lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                )}

                {/* Main Content */}
                <div
                  className="tiptap-content article-content prose prose-slate prose-lg max-w-none"
                  style={
                    {
                      "--font-size": `${fontSize}px`,
                      fontSize: `${fontSize}px`,
                      lineHeight: 1.8,
                    } as React.CSSProperties
                  }
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-10 pt-8 border-t-2 border-border/50">
                    <h4 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5" />
                      Chủ đề liên quan
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/tin-tuc?tag=${tag.slug}`}
                          className="px-3.5 py-1.5 bg-muted/50 border border-border/50 text-muted-foreground rounded-full text-sm font-medium hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              {/* Right Sidebar - Related News & Links */}
              <aside className="col-span-1 lg:col-span-4 lg:border-l lg:border-border/30 lg:pl-8">
                <div className="lg:sticky lg:top-24 space-y-6">
                  {/* Related Posts */}
                  {relatedPosts.length > 0 && (
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-border/50 bg-muted/30">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                          <FileText className="w-4 h-4 text-primary" />
                          Tin liên quan
                        </h3>
                      </div>
                      <div className="p-4 space-y-4">
                        {relatedPosts.map((related, idx) => (
                          <Link
                            key={related.id}
                            href={`/tin-tuc/${related.slug}`}
                            className={cn(
                              "group flex gap-3",
                              idx !== relatedPosts.length - 1 &&
                                "pb-4 border-b border-border/30",
                            )}
                          >
                            {related.coverImageUrl && (
                              <div className="w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden relative">
                                <Image
                                  src={related.coverImageUrl}
                                  alt={related.title}
                                  fill
                                  unoptimized
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {related.title}
                              </h4>
                              <span className="text-[11px] text-muted-foreground mt-1 block">
                                {formatDate(
                                  related.publishedAt || related.createdAt,
                                )}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/50 bg-muted/30">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        Liên kết nhanh
                      </h3>
                    </div>
                    <div className="p-4 space-y-1">
                      {[
                        {
                          name: "Trang chủ HCM-UTE",
                          href: "https://hcmute.edu.vn",
                          icon: Building2,
                        },
                        {
                          name: "Cổng thông tin sinh viên",
                          href: "/sinh-vien",
                          icon: GraduationCap,
                        },
                        {
                          name: "Thư viện điện tử",
                          href: "/thu-vien",
                          icon: BookOpen,
                        },
                        {
                          name: "Tra cứu điểm",
                          href: "/tra-cuu/diem",
                          icon: Search,
                        },
                      ].map((link, i) => (
                        <Link
                          key={i}
                          href={link.href}
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-3 py-2.5 rounded-lg transition-all group"
                        >
                          <link.icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                          <span className="flex-1">{link.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Training Notices */}
                  <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg overflow-hidden relative">
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl -ml-6 -mb-6" />

                    <div className="px-5 py-4 border-b border-white/10 relative z-10">
                      <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                        <Award className="w-4 h-4" />
                        Thông báo Đào tạo
                      </h3>
                    </div>

                    <div className="p-4 space-y-3 relative z-10">
                      {[
                        {
                          text: "Thông báo lịch thi học kỳ II năm học 2025-2026",
                          time: "2 giờ trước",
                        },
                        {
                          text: "Kế hoạch đăng ký học phần đợt 3",
                          time: "Hôm qua",
                        },
                        {
                          text: "Quy định mới về chuẩn đầu ra Tiếng Anh 2026",
                          time: "3 ngày trước",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="group/item cursor-pointer p-3 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <p className="text-sm leading-snug font-medium mb-1">
                            {item.text}
                          </p>
                          <span className="text-[10px] opacity-70">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="px-4 pb-4 relative z-10">
                      <Link href="/thong-bao">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full bg-white/15 hover:bg-white/25 border-0 text-primary-foreground backdrop-blur-sm"
                        >
                          Xem tất cả thông báo
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Newsletter */}
                  <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/50 bg-muted/30">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        Đăng ký nhận tin
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-4">
                        Nhận thông báo mới nhất từ nhà trường qua email.
                      </p>
                      <div className="flex gap-2">
                        <input
                          className="w-full px-3 py-2.5 rounded-lg text-sm border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none bg-background transition-all"
                          placeholder="Email của bạn..."
                        />
                        <Button
                          size="icon"
                          className="flex-shrink-0 h-[42px] w-[42px]"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </main>

        {/* Mobile Sticky Action Bar */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-full px-5 py-3 flex items-center gap-4 z-50">
          <button
            onClick={() => handleZoom("in")}
            className="text-muted-foreground active:scale-90 transition-transform p-1"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleZoom("out")}
            className="text-muted-foreground active:scale-90 transition-transform p-1"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <div className="w-px h-5 bg-border" />
          <button
            onClick={() => handleShare("facebook")}
            className="text-[#1877F2] active:scale-90 transition-transform p-1"
          >
            <Facebook className="w-5 h-5" />
          </button>
          <button
            onClick={copyLink}
            className="text-muted-foreground active:scale-90 transition-transform p-1"
          >
            {copied ? (
              <span className="text-xs text-green-600 font-medium">OK</span>
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
          <div className="w-px h-5 bg-border" />
          <button
            onClick={handleAiSummary}
            className="text-primary active:scale-90 transition-transform p-1"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
}
