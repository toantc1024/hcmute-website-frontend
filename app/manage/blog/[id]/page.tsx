"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Eye,
  User,
  Tag,
  Clock,
  FileText,
  Send,
  Edit,
  Trash2,
  Printer,
  Volume2,
  VolumeX,
  Pause,
  Play,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Rocket,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n";
import {
  postsApi,
  PostStatus,
  AuthorType,
  getPostStatusLabel,
  WorkflowProgress,
  type PostDetailView,
} from "@/features/posts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageLoader, ButtonLoader } from "@/components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

const extractHeadings = (content: string): TableOfContentsItem[] => {
  const headingRegex = /<h([2-4])[^>]*>([^<]*)<\/h[2-4]>/gi;
  const headings: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const id = match[2]
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    headings.push({
      level: parseInt(match[1]),
      id,
      text: match[2].trim(),
    });
  }

  return headings;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} phút đọc`;
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const postId = params.id as string;

  const [post, setPost] = useState<PostDetailView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    [],
  );
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [showOutline, setShowOutline] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Audio/TTS state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSpeechSupported("speechSynthesis" in window);
  }, []);

  const fetchPost = useCallback(
    async (showRefreshState = false) => {
      try {
        if (showRefreshState) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);
        const data = await postsApi.getPostById(postId);
        setPost(data);
        setTableOfContents(extractHeadings(data.content || ""));
        if (showRefreshState) {
          toast.success("Đã cập nhật dữ liệu");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải bài viết",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [postId],
  );

  const handleRefresh = useCallback(() => {
    fetchPost(true);
  }, [fetchPost]);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPost]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h2[id], h3[id], h4[id]");
      let currentHeading = "";

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          currentHeading = heading.id;
        }
      });

      setActiveHeading(currentHeading);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await postsApi.deletePost(postId);
      toast.success("Đã xóa bài viết");
      router.push("/manage/blog");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa bài viết",
      );
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!post) return;

    try {
      setIsSubmitting(true);
      await postsApi.submitPost(postId, { version: post.version });
      toast.success("Đã gửi bài viết để duyệt");

      const updatedPost = await postsApi.getPostById(postId);
      setPost(updatedPost);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi gửi duyệt",
      );
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  // TEMPORARY_POST: Force publish handler
  const handleForcePublish = async () => {
    if (!post) return;

    try {
      setIsPublishing(true);
      await postsApi.forcePublish(postId);
      toast.success("Đã đăng bài viết thành công!");

      const updatedPost = await postsApi.getPostById(postId);
      setPost(updatedPost);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi đăng bài",
      );
    } finally {
      setIsPublishing(false);
      setShowPublishDialog(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleAudio = () => {
    if (!isSpeechSupported || !post) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const textContent = post.content?.replace(/<[^>]*>/g, "") || "";
      const utterance = new SpeechSynthesisUtterance(textContent);
      utterance.lang = "vi-VN";
      utterance.rate = 1;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (isLoading) {
    return <PageLoader text="Đang tải bài viết..." />;
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-destructive mb-4">
          {error || "Không tìm thấy bài viết"}
        </p>
        <Button variant="outline" asChild>
          <Link href="/manage/blog">
            <ArrowLeft className="mr-2 size-4" />
            {t.common.back}
          </Link>
        </Button>
      </div>
    );
  }

  const owner = post.authors?.find((a) => a.authorType === AuthorType.OWNER);
  const canPublish = post.status !== PostStatus.PUBLISHED;

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Left side - Text controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/manage/blog">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          <TooltipProvider>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={handlePrint}
                  >
                    <Printer className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>In bài viết</TooltipContent>
              </Tooltip>

              {isSpeechSupported && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isPlaying ? "secondary" : "ghost"}
                      size="icon"
                      className="size-8"
                      onClick={handleToggleAudio}
                    >
                      {isPlaying ? (
                        <Pause className="size-4" />
                      ) : (
                        <Volume2 className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPlaying ? "Dừng đọc" : "Đọc bài viết"}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>

        {/* Center - Title */}
        <div className="flex-1 text-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight line-clamp-2">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <Badge variant={getStatusBadgeVariant(post.status)}>
              {getPostStatusLabel(post.status)}
            </Badge>
            {post.allowCloning && (
              <Badge variant="secondary">Cho phép sao chép</Badge>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
          {post.status === PostStatus.DRAFT && (
            <Button variant="outline" onClick={() => setShowSubmitDialog(true)}>
              <Send className="mr-2 size-4" />
              Gửi duyệt
            </Button>
          )}
          {/* TEMPORARY_POST: Force Publish Button */}
          {canPublish && (
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setShowPublishDialog(true)}
            >
              <Rocket className="mr-2 size-4" />
              Đăng bài
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/manage/posts/${postId}/edit`}>
              <Edit className="mr-2 size-4" />
              {t.common.edit}
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Workflow Progress with Running Animation */}
      <Card>
        <CardContent className="pt-6">
          <WorkflowProgressAnimated
            status={post.status}
            reviewers={post.reviewers}
          />
        </CardContent>
      </Card>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Cover Image */}
          {post.coverImageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-xl overflow-hidden"
            >
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              {post.photoCredit && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-sm">
                    Photo: {post.photoCredit}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {owner && (
              <div className="flex items-center gap-2">
                <User className="size-4" />
                <span>{owner.fullName}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>{formatDate(post.createdDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>{formatReadTime(post.content || "")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="size-4" />
              <span>{post.viewCount.toLocaleString()} lượt xem</span>
            </div>
          </div>

          {/* Categories & Tags */}
          {(post.categories?.length > 0 || post.tags?.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {post.categories?.map((category) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
              {post.tags?.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  <Tag className="mr-1 size-3" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          {post.description && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground italic">{post.description}</p>
            </div>
          )}

          {/* Content */}
          <Card className="print:shadow-none print:border-none">
            <CardContent className="pt-6 print:p-0">
              <div
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-24"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Table of Contents - Shows on hover */}
          {tableOfContents.length > 0 && (
            <Card
              className="sticky top-24"
              onMouseEnter={() => setShowOutline(true)}
              onMouseLeave={() => setShowOutline(false)}
            >
              <Collapsible open={showOutline} onOpenChange={setShowOutline}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="size-4" />
                        Mục lục
                      </CardTitle>
                      {showOutline ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <nav className="space-y-1">
                      {tableOfContents.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block py-1 text-sm transition-colors ${
                            item.level === 3 ? "pl-4" : ""
                          } ${item.level === 4 ? "pl-8" : ""} ${
                            activeHeading === item.id
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )}

          {/* Related Posts Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bài viết liên quan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Các bài viết cùng danh mục sẽ hiển thị ở đây
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.posts.deletePost}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.posts.confirmDelete}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <ButtonLoader />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              <span className="ml-2">{t.common.delete}</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gửi bài viết để duyệt?</AlertDialogTitle>
            <AlertDialogDescription>
              Bài viết sẽ được gửi đến người phê duyệt. Bạn sẽ không thể chỉnh
              sửa cho đến khi bài viết được phê duyệt hoặc bị từ chối.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              {t.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitForReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Send className="mr-2 size-4" />
              )}
              Gửi duyệt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* TEMPORARY_POST: Force Publish Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="size-5 text-yellow-500" />
              Đăng bài ngay?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="text-yellow-600 font-medium">
                [TEMPORARY_POST]
              </span>{" "}
              Bạn đang sử dụng tính năng đăng bài nhanh. Bài viết sẽ được xuất
              bản ngay lập tức mà không cần qua quy trình phê duyệt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>
              {t.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleForcePublish}
              disabled={isPublishing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPublishing ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Rocket className="mr-2 size-4" />
              )}
              Đăng bài
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .prose,
          .prose * {
            visibility: visible;
          }
          .prose {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

// Workflow Progress with running dashed line animation
import { cn } from "@/lib/utils";
import type { PostReviewerView } from "@/features/posts";

interface WorkflowProgressAnimatedProps {
  status: PostStatus;
  reviewers?: PostReviewerView[];
  className?: string;
}

function WorkflowProgressAnimated({
  status,
  reviewers = [],
  className,
}: WorkflowProgressAnimatedProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Tiến trình phê duyệt</h3>
        <Badge
          variant={status === PostStatus.REJECTED ? "destructive" : "outline"}
        >
          {status === PostStatus.PUBLISHED
            ? "Hoàn thành"
            : status === PostStatus.REJECTED
              ? "Bị từ chối"
              : "Đang xử lý"}
        </Badge>
      </div>

      <WorkflowProgress status={status} reviewers={reviewers} />

      {/* Running dashed line animation styles */}
      <style jsx global>{`
        @keyframes flow-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes dash-move {
          0% {
            stroke-dashoffset: 20;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .animate-dash-flow {
          animation: dash-move 0.5s linear infinite;
        }

        /* Running dashed line under workflow */
        .workflow-running-line {
          position: relative;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            hsl(var(--primary)) 50%,
            transparent 100%
          );
          overflow: hidden;
        }

        .workflow-running-line::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 4px,
            hsl(var(--background)) 4px,
            hsl(var(--background)) 8px
          );
          animation: dash-move 0.3s linear infinite;
        }
      `}</style>

      {/* Running dashed line indicator */}
      {status !== PostStatus.PUBLISHED && status !== PostStatus.REJECTED && (
        <div className="workflow-running-line mt-2" />
      )}
    </div>
  );
}
