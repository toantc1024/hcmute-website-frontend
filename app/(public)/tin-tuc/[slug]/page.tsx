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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { postsApi, type PostDetailView, type PostAuditView } from "@/lib/api-client";
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
        setRelatedPosts(related.content.filter((p) => p.id !== data.id).slice(0, 4));
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
        {/* Breadcrumb with Back Button */}
        <div className="border-b">
          <div className="px-4 sm:px-8 lg:px-32 py-3">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Link href="/tin-tuc">
                <Button variant="ghost" size="sm" className="gap-2 -ml-2">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </Button>
              </Link>
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Trang chủ
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/tin-tuc" className="hover:text-foreground transition-colors">
                  Tin tức
                </Link>
                {post.categories?.[0] && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground">
                      {post.categories[0].name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout - Same padding as landing page */}
        <div className="px-4 sm:px-8 lg:px-32 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Tools */}
            <aside className="hidden lg:block w-12 flex-shrink-0">
              <div className="sticky top-24 flex flex-col gap-2">
                {/* Outline */}
                {headings.length > 0 && (
                  <Popover open={outlineOpen} onOpenChange={setOutlineOpen}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                            <List className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right">Mục lục</TooltipContent>
                    </Tooltip>
                    <PopoverContent side="right" align="start" className="w-72 max-h-96 overflow-y-auto">
                      <p className="text-xs font-semibold text-muted-foreground mb-3">MỤC LỤC</p>
                      <div className="space-y-1">
                        {headings.map((h, i) => (
                          <button
                            key={i}
                            onClick={() => scrollToHeading(h.id)}
                            className={cn(
                              "block w-full text-left py-1.5 text-sm hover:text-primary transition-colors truncate",
                              h.level === 1 && "font-medium",
                              h.level === 2 && "pl-3 text-muted-foreground",
                              h.level === 3 && "pl-6 text-muted-foreground text-xs"
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
                      variant="outline" 
                      size="icon"
                      className="rounded-full w-10 h-10"
                      onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Thu nhỏ chữ</TooltipContent>
                </Tooltip>

                {/* Zoom In */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="rounded-full w-10 h-10"
                      onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Phóng to chữ</TooltipContent>
                </Tooltip>

                {/* Share */}
                <Popover open={shareOpen} onOpenChange={setShareOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">Chia sẻ</TooltipContent>
                  </Tooltip>
                  <PopoverContent side="right" align="start" className="w-48">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">CHIA SẺ</p>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md transition-colors"
                      >
                        <Link2 className="w-4 h-4" />
                        Sao chép link
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </aside>

            {/* Main Content */}
            <article className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Category */}
                {post.categories?.[0] && (
                  <Link 
                    href={`/tin-tuc?category=${post.categories[0].id}`}
                    className="inline-block text-sm font-medium text-primary hover:underline mb-4"
                  >
                    {post.categories[0].name}
                  </Link>
                )}

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-foreground leading-tight mb-4">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <div 
                    className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6 tiptap"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-8 pb-8 border-b">
                  {/* Authors */}
                  {/* Authors */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {post.authors?.map((author, i) => (
                      <span key={author.id} className="flex items-center gap-1">
                        {i > 0 && <span>,</span>}
                        <span className="font-medium text-foreground">{author.displayName}</span>
                      </span>
                    ))}
                    {post.extendedAttributes?.Author && (
                      <span className="font-medium text-foreground">
                        {post.extendedAttributes.Author}
                      </span>
                    )}

                    {/* Extended Attributes: Photographer */}
                    {((post.extendedAttributes as any)?.["Photographer"] || (post.extendedAttributes as any)?.["Người chụp ảnh"]) && (
                       <span className="flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5" />
                        <span className="text-muted-foreground mr-1">Ảnh:</span>
                        <span className="font-medium text-foreground">
                          {(post.extendedAttributes as any)?.["Photographer"] || (post.extendedAttributes as any)?.["Người chụp ảnh"]}
                        </span>
                      </span>
                    )}

                    {/* Extended Attributes: Editor */}
                    {((post.extendedAttributes as any)?.["Editor"] || (post.extendedAttributes as any)?.["Biên tập viên"]) && (
                       <span className="flex items-center gap-1">
                         <User className="w-3.5 h-3.5" />
                        <span className="text-muted-foreground mr-1">Biên tập:</span>
                        <span className="font-medium text-foreground">
                          {(post.extendedAttributes as any)?.["Editor"] || (post.extendedAttributes as any)?.["Biên tập viên"]}
                        </span>
                      </span>
                    )}
                  </div>
                  
                  <span className="text-muted-foreground/50">·</span>
                  
                  <time>{formatDate(post.publishedAt || post.createdAt)}</time>
                  
                  <span className="text-muted-foreground/50">·</span>
                  
                  <span>{calculateReadTime(post.content)}</span>
                  
                  <span className="text-muted-foreground/50">·</span>
                  
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {post.viewCount}
                  </span>
                </div>

                {/* Cover Image */}
                {post.coverImageUrl && (
                  <figure className="mb-8">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        unoptimized
                        className="object-cover"
                        priority
                      />
                    </div>
                  </figure>
                )}

                {/* Content - TipTap HTML Render */}
                <div
                  className="tiptap-content"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link 
                          key={tag.id} 
                          href={`/tin-tuc?tag=${tag.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                        >
                          <Hash className="w-3 h-3" />
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Actions */}
                <div className="flex lg:hidden items-center justify-center gap-2 mt-8 pt-8 border-t">
                  <Button variant="outline" size="sm" onClick={() => setFontSize(prev => Math.max(14, prev - 2))}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setFontSize(prev => Math.min(24, prev + 2))}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Popover open={shareOpen} onOpenChange={setShareOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Chia sẻ
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <div className="space-y-1">
                        <button onClick={() => handleShare("facebook")} className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md">
                          <Facebook className="w-4 h-4" /> Facebook
                        </button>
                        <button onClick={() => handleShare("twitter")} className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md">
                          <Twitter className="w-4 h-4" /> Twitter
                        </button>
                        <button onClick={() => handleShare("linkedin")} className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md">
                          <Linkedin className="w-4 h-4" /> LinkedIn
                        </button>
                        <button onClick={() => handleShare("copy")} className="flex items-center gap-3 w-full py-2 px-2 text-sm hover:bg-accent rounded-md">
                          <Link2 className="w-4 h-4" /> Sao chép link
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </motion.div>
            </article>

            {/* Right Sidebar - Quick Actions */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Quick Actions Accordion */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Truy cập nhanh</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Always expanded quick actions */}
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

                {/* Category Card */}
                {post.categories?.[0] && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
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
              </div>
            </aside>
          </div>

          {/* Related Posts - Bottom */}
          <section className="mt-16 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-6">Bài viết liên quan</h2>
            {relatedPosts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/tin-tuc/${related.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground">Chưa có bài viết liên quan</p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>
    </TooltipProvider>
  );
}
