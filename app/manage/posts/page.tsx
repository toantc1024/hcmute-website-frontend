"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  Send,
  Copy,
  Download,
  CircleDashed,
  Clock,
  CheckCircle,
  XCircle,
  List,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import {
  postsApi,
  type PostAuditView,
  PostStatus,
  AuthorType,
  getPostStatusLabel,
} from "@/features/posts";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageLoader } from "@/components/ui/loader";

function getStatusBadgeVariant(
  status: PostStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case PostStatus.PUBLISHED:
      return "default"; // Primary blue - success
    case PostStatus.PENDING:
      return "outline"; // Yellow/warning
    case PostStatus.DRAFT:
      return "secondary"; // Gray - neutral
    case PostStatus.REJECTED:
      return "destructive"; // Red - danger
    default:
      return "outline";
  }
}

// Status color classes for visual distinction
function getStatusColorClass(status: PostStatus): string {
  switch (status) {
    case PostStatus.PUBLISHED:
      return "bg-green-100 text-green-800 border-green-200";
    case PostStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case PostStatus.DRAFT:
      return "bg-gray-100 text-gray-600 border-gray-200";
    case PostStatus.REJECTED:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "";
  }
}

// Status icon for visual distinction
function getStatusIcon(status: PostStatus) {
  switch (status) {
    case PostStatus.PUBLISHED:
      return <CheckCircle className="size-3" />;
    case PostStatus.PENDING:
      return <Clock className="size-3" />;
    case PostStatus.DRAFT:
      return <CircleDashed className="size-3" />;
    case PostStatus.REJECTED:
      return <XCircle className="size-3" />;
    default:
      return null;
  }
}

function PostsContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<PostAuditView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusFilter = searchParams.get("status") || "";
  const titleFilter = searchParams.get("title") || "";
  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: Record<string, unknown> = {
        size,
        sort: searchParams.get("sort") || "createdDate,desc",
      };

      if (titleFilter) {
        params.title = titleFilter;
      }

      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await postsApi.getPosts(params);
      setPosts(response.content);
      setHasNextPage(response.hasMore);
      setTotalElements(response.content.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải bài viết",
      );
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, titleFilter, size, searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      setIsDeleting(true);
      await postsApi.deletePost(deletePostId);
      setDeletePostId(null);
      fetchPosts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa bài viết",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusFilterOptions = [
    {
      label: t.posts.filters.draft,
      value: String(PostStatus.DRAFT),
      icon: <CircleDashed className="size-4 text-gray-500" />,
    },
    {
      label: t.posts.filters.pending,
      value: String(PostStatus.PENDING),
      icon: <Clock className="size-4 text-yellow-600" />,
    },
    {
      label: t.posts.filters.published,
      value: String(PostStatus.PUBLISHED),
      icon: <CheckCircle className="size-4 text-green-600" />,
    },
    {
      label: t.posts.filters.rejected,
      value: String(PostStatus.REJECTED),
      icon: <XCircle className="size-4 text-red-600" />,
    },
  ];

  const columns: ColumnDef<PostAuditView>[] = useMemo(
    () => [
      {
        id: "title",
        header: t.posts.postTitle,
        accessorKey: "title",
        minWidth: 200,
        maxWidth: 350,
        enableFiltering: true,
        filterType: "text",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 max-w-[350px]">
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate" title={row.title}>
                {row.title}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "author",
        header: t.posts.postAuthor,
        enableFiltering: false,
        enableSorting: false,
        cell: ({ row }) => {
          const owner = row.authors.find(
            (a) => a.authorType === AuthorType.OWNER,
          );
          if (!owner) return "-";
          return (
            <div className="flex items-start gap-2">
              {/* <Avatar className="size-6"> */}
              {/* <AvatarImage src={owner.avatarUrl} /> */}
              {/* <AvatarFallback className="text-xs">
                  {owner.fullName?.slice(0, 2).toUpperCase() || "??"}
                </AvatarFallback> */}
              {/* </Avatar> */}
              <span className="text-sm">{owner.fullName}</span>
            </div>
          );
        },
      },
      {
        id: "status",
        header: t.posts.postStatus,
        accessorKey: "status",
        enableFiltering: true,
        filterType: "select",
        filterOptions: statusFilterOptions,
        cell: ({ row }) => (
          <Badge className={getStatusColorClass(row.status)}>
            {getStatusIcon(row.status)}
            <span className="ml-1">{getPostStatusLabel(row.status)}</span>
          </Badge>
        ),
      },
      {
        id: "viewCount",
        header: "Lượt xem",
        accessorKey: "viewCount",
        enableFiltering: false,
        cell: ({ value }) => (
          <span className="text-muted-foreground">
            {(value as number).toLocaleString()}
          </span>
        ),
      },
      {
        id: "createdDate",
        header: t.posts.postDate,
        accessorKey: "createdDate",
        enableFiltering: false,
        cell: ({ value }) => (
          <span className="text-muted-foreground">
            {formatDate(value as string)}
          </span>
        ),
      },
    ],
    [t, statusFilterOptions],
  );

  const renderActions = (row: PostAuditView) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/manage/posts/${row.id}`}>
            <Eye className="mr-2 size-4" />
            {t.common.view}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/manage/posts/${row.id}/edit`}>
            <Edit className="mr-2 size-4" />
            {t.common.edit}
          </Link>
        </DropdownMenuItem>
        {row.status === PostStatus.DRAFT && (
          <DropdownMenuItem>
            <Send className="mr-2 size-4" />
            {t.posts.actions.submitReview}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Copy className="mr-2 size-4" />
          {t.posts.actions.duplicate}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 size-4" />
          Xuất DOCX
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeletePostId(row.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t.common.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.set("page", "0");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const createButton = (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg border bg-muted/30 p-1">
        <Button
          variant={
            !statusFilter || statusFilter === "all" ? "secondary" : "ghost"
          }
          size="sm"
          className="h-7 px-3 text-xs"
          onClick={() => handleStatusFilter("all")}
        >
          <List className="mr-1.5 size-3.5" />
          Tất cả
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-3 text-xs ${
            statusFilter === String(PostStatus.DRAFT)
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : ""
          }`}
          onClick={() => handleStatusFilter(String(PostStatus.DRAFT))}
        >
          <CircleDashed className="mr-1.5 size-3.5" />
          Nháp
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-3 text-xs ${
            statusFilter === String(PostStatus.PENDING)
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : ""
          }`}
          onClick={() => handleStatusFilter(String(PostStatus.PENDING))}
        >
          <Clock className="mr-1.5 size-3.5" />
          Chờ duyệt
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-3 text-xs ${
            statusFilter === String(PostStatus.PUBLISHED)
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : ""
          }`}
          onClick={() => handleStatusFilter(String(PostStatus.PUBLISHED))}
        >
          <CheckCircle className="mr-1.5 size-3.5" />
          Đã xuất bản
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-3 text-xs ${
            statusFilter === String(PostStatus.REJECTED)
              ? "bg-red-100 text-red-800 hover:bg-red-200"
              : ""
          }`}
          onClick={() => handleStatusFilter(String(PostStatus.REJECTED))}
        >
          <XCircle className="mr-1.5 size-3.5" />
          Từ chối
        </Button>
      </div>
      <Button asChild>
        <Link href="/manage/posts/create">
          <Plus className="mr-2 size-4" />
          {t.posts.createPost}
        </Link>
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <DataTable
        data={posts}
        columns={columns}
        isLoading={isLoading}
        error={error}
        totalElements={totalElements}
        totalPages={Math.ceil(totalElements / size)}
        pageSize={size}
        currentPage={page}
        hasNextPage={hasNextPage}
        hasPreviousPage={page > 0}
        onRefresh={fetchPosts}
        onCreate={createButton}
        onRowClick={(row) => router.push(`/manage/posts/${row.id}`)}
        rowKey="id"
        emptyMessage={t.posts.noPostsFound}
        emptyIcon={<FileText className="size-12" />}
        actions={renderActions}
        syncWithUrl={true}
      />

      <AlertDialog
        open={!!deletePostId}
        onOpenChange={() => setDeletePostId(null)}
      >
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
              <Trash2 className="mr-2 size-4" />
              {t.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense fallback={<PageLoader text="Đang tải..." />}>
      <PostsContent />
    </Suspense>
  );
}
