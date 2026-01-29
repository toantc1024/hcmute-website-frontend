"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  User,
  Eye,
  Tag,
  Clock,
  FileJson,
  Send,
  MessageSquare,
  History,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Rocket,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n";
import {
  postsApi,
  PostStatus,
  AuthorType,
  ReviewSessionStatus,
  ReviewCommentStatus,
  getPostStatusLabel,
  type PostDetailView,
  type PostReviewSessionAuditView,
  type PostReviewSessionDetailView,
  WorkflowProgress,
  WorkflowProgressVertical,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

interface ReviewSessionItemProps {
  session: PostReviewSessionAuditView;
  onViewDetails: (session: PostReviewSessionAuditView) => void;
}

function ReviewSessionItem({ session, onViewDetails }: ReviewSessionItemProps) {
  const isOpen = session.status === ReviewSessionStatus.OPEN;

  return (
    <div
      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onViewDetails(session)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={session.reviewerAvatar} />
            <AvatarFallback className="text-xs">
              {session.reviewerName?.slice(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{session.reviewerName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(session.createdDate).toLocaleDateString("vi-VN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <Badge variant={isOpen ? "default" : "secondary"}>
          {isOpen ? "Đang mở" : "Đã đóng"}
        </Badge>
      </div>
      {session.overallNote && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {session.overallNote}
        </p>
      )}
    </div>
  );
}

interface ReviewSessionDetailsPanelProps {
  session: PostReviewSessionDetailView | null;
  isLoading: boolean;
  onResolveComment: (commentId: string) => void;
}

function ReviewSessionDetailsPanel({
  session,
  isLoading,
  onResolveComment,
}: ReviewSessionDetailsPanelProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto size-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">
          Chọn một phiên đánh giá để xem chi tiết
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <Avatar>
          <AvatarImage src={session.reviewerAvatar} />
          <AvatarFallback>
            {session.reviewerName?.slice(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{session.reviewerName}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(session.createdDate).toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {session.overallNote && (
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Ghi chú tổng quan</h4>
          <p className="text-sm text-muted-foreground">{session.overallNote}</p>
        </div>
      )}

      {session.comments && session.comments.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">
            Nhận xét chi tiết ({session.comments.length})
          </h4>
          {session.comments.map((comment) => {
            const isResolved = comment.status === ReviewCommentStatus.RESOLVED;
            return (
              <div
                key={comment.id}
                className={`p-4 border rounded-lg ${isResolved ? "bg-green-50 dark:bg-green-950/20" : ""}`}
              >
                {comment.selectedText && (
                  <div className="mb-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                    <span className="text-muted-foreground">
                      Văn bản được chọn:{" "}
                    </span>
                    <span className="font-medium">
                      &quot;{comment.selectedText}&quot;
                    </span>
                  </div>
                )}
                <p className="text-sm">{comment.content}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge
                    variant={isResolved ? "default" : "secondary"}
                    className={isResolved ? "bg-green-500" : ""}
                  >
                    {isResolved ? (
                      <>
                        <CheckCircle2 className="mr-1 size-3" />
                        Đã giải quyết
                      </>
                    ) : (
                      <>
                        <Clock className="mr-1 size-3" />
                        Chờ xử lý
                      </>
                    )}
                  </Badge>
                  {!isResolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onResolveComment(comment.id)}
                    >
                      <CheckCircle2 className="mr-1 size-4" />
                      Đánh dấu đã xử lý
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const postId = params.id as string;

  const [post, setPost] = useState<PostDetailView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [reviewSessions, setReviewSessions] = useState<
    PostReviewSessionAuditView[]
  >([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<PostReviewSessionDetailView | null>(null);
  const [isLoadingSessionDetails, setIsLoadingSessionDetails] = useState(false);

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

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
    const updated = searchParams.get("updated");
    if (updated === "true") {
      fetchPost(true);
      router.replace(`/manage/posts/${postId}`, { scroll: false });
    }
  }, [searchParams, postId, router, fetchPost]);

  const fetchReviewSessions = useCallback(async () => {
    try {
      setIsLoadingReviews(true);
      const response = await postsApi.getReviewSessions(postId);
      setReviewSessions(response.content);
    } catch (err) {
      console.error("Failed to fetch review sessions:", err);
    } finally {
      setIsLoadingReviews(false);
    }
  }, [postId]);

  const handleViewSessionDetails = async (
    session: PostReviewSessionAuditView,
  ) => {
    try {
      setIsLoadingSessionDetails(true);
      const details = await postsApi.getReviewSessionById(session.id);
      setSelectedSession(details);
    } catch (err) {
      toast.error("Không thể tải chi tiết phiên đánh giá");
    } finally {
      setIsLoadingSessionDetails(false);
    }
  };

  const handleResolveComment = async (commentId: string) => {
    try {
      await postsApi.resolveReviewComment(commentId);
      toast.success("Đã đánh dấu nhận xét đã xử lý");

      if (selectedSession) {
        const updatedDetails = await postsApi.getReviewSessionById(
          selectedSession.id,
        );
        setSelectedSession(updatedDetails);
      }
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái nhận xét");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await postsApi.deletePost(postId);
      toast.success("Đã xóa bài viết");
      router.push("/manage/posts");
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

  // Unpublish handler
  const handleUnpublish = async () => {
    if (!post) return;

    try {
      setIsPublishing(true);
      await postsApi.unpublishPost(postId);
      toast.success("Đã hủy đăng bài viết!");

      const updatedPost = await postsApi.getPostById(postId);
      setPost(updatedPost);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi hủy đăng bài",
      );
    } finally {
      setIsPublishing(false);
      setShowPublishDialog(false);
    }
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
          <Link href="/manage/posts">
            <ArrowLeft className="mr-2 size-4" />
            {t.common.back}
          </Link>
        </Button>
      </div>
    );
  }

  const owner = post.authors?.find((a) => a.authorType === AuthorType.OWNER);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/manage/posts">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight line-clamp-1">
              {post.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusBadgeVariant(post.status)}>
                {getPostStatusLabel(post.status)}
              </Badge>
              {post.allowCloning && (
                <Badge variant="secondary">Cho phép sao chép</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" onClick={fetchReviewSessions}>
                <MessageSquare className="mr-2 size-4" />
                Đánh giá
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Phiên đánh giá</SheetTitle>
                <SheetDescription>
                  Xem lịch sử đánh giá và nhận xét
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <Tabs defaultValue="sessions">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sessions">Danh sách</TabsTrigger>
                    <TabsTrigger value="details">Chi tiết</TabsTrigger>
                  </TabsList>
                  <TabsContent value="sessions" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-280px)]">
                      {isLoadingReviews ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : reviewSessions.length === 0 ? (
                        <div className="text-center py-12">
                          <History className="mx-auto size-12 text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">
                            Chưa có phiên đánh giá nào
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 pr-4">
                          {reviewSessions.map((session) => (
                            <ReviewSessionItem
                              key={session.id}
                              session={session}
                              onViewDetails={handleViewSessionDetails}
                            />
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="details" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-280px)]">
                      <ReviewSessionDetailsPanel
                        session={selectedSession}
                        isLoading={isLoadingSessionDetails}
                        onResolveComment={handleResolveComment}
                      />
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>
          {post.status === PostStatus.DRAFT && (
            <Button variant="outline" onClick={() => setShowSubmitDialog(true)}>
              <Send className="mr-2 size-4" />
              Gửi duyệt
            </Button>
          )}
          {/* TEMPORARY_POST: Force Publish / Unpublish Button */}
          {post.status === PostStatus.PUBLISHED ? (
            <Button
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              onClick={() => setShowPublishDialog(true)}
            >
              <XCircle className="mr-2 size-4" />
              Hủy đăng bài
            </Button>
          ) : (
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
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 size-4" />
            {t.common.delete}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <WorkflowProgress status={post.status} reviewers={post.reviewers} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t.posts.postContent}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList>
                  <TabsTrigger value="content">Nội dung</TabsTrigger>
                  <TabsTrigger value="json">
                    <FileJson className="mr-2 size-4" />
                    JSON
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="mt-4">
                  {post.description && (
                    <div className="mb-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Mô tả
                      </p>
                      <p>{post.description}</p>
                    </div>
                  )}
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: post.content || "" }}
                  />
                </TabsContent>
                <TabsContent value="json" className="mt-4">
                  <pre className="p-4 bg-muted rounded-lg overflow-auto text-xs max-h-[500px]">
                    {JSON.stringify(post, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.common.details}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.posts.postAuthor}
                  </p>
                  <p className="font-medium">{owner?.fullName || "N/A"}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.posts.postDate}
                  </p>
                  <p className="font-medium">{formatDate(post.createdDate)}</p>
                </div>
              </div>
              {post.publishedAt && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Eye className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t.posts.publishedAt}
                      </p>
                      <p className="font-medium">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center gap-3">
                <Eye className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Lượt xem</p>
                  <p className="font-medium">
                    {post.viewCount.toLocaleString()}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phiên bản</p>
                  <p className="font-medium">{post.version}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {post.reviewers && post.reviewers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Người đánh giá</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkflowProgressVertical
                  status={post.status}
                  reviewers={post.reviewers}
                />
              </CardContent>
            </Card>
          )}

          {post.categories && post.categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t.posts.postCategory}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {post.tags && post.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t.posts.postTags}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      <Tag className="mr-1 size-3" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {post.coverImageUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full rounded-lg object-cover"
                />
                {post.photoCredit && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Photo: {post.photoCredit}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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

      {/* TEMPORARY_POST: Force Publish / Unpublish Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle
                className={`size-5 ${post.status === PostStatus.PUBLISHED ? "text-orange-500" : "text-yellow-500"}`}
              />
              {post.status === PostStatus.PUBLISHED
                ? "Hủy đăng bài?"
                : "Đăng bài ngay?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {post.status === PostStatus.PUBLISHED ? (
                <>
                  Bài viết sẽ được gỡ khỏi trang công khai. Người dùng sẽ không
                  thể xem bài viết này cho đến khi bạn đăng lại.
                </>
              ) : (
                <>
                  <span className="text-yellow-600 font-medium">
                    [TEMPORARY_POST]
                  </span>{" "}
                  Bạn đang sử dụng tính năng đăng bài nhanh. Bài viết sẽ được
                  xuất bản ngay lập tức mà không cần qua quy trình phê duyệt.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>
              {t.common.cancel}
            </AlertDialogCancel>
            {post.status === PostStatus.PUBLISHED ? (
              <AlertDialogAction
                onClick={handleUnpublish}
                disabled={isPublishing}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isPublishing ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 size-4" />
                )}
                Hủy đăng bài
              </AlertDialogAction>
            ) : (
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
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
