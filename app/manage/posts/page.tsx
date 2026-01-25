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
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { postsApi, type PostAuditView, PostStatus, AuthorType, getPostStatusLabel } from "@/features/posts";

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
  status: PostStatus
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
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải bài viết");
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
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa bài viết");
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
    { label: t.posts.filters.draft, value: String(PostStatus.DRAFT) },
    { label: t.posts.filters.pending, value: String(PostStatus.PENDING) },
    { label: t.posts.filters.published, value: String(PostStatus.PUBLISHED) },
    { label: t.posts.filters.rejected, value: String(PostStatus.REJECTED) },
  ];

  const columns: ColumnDef<PostAuditView>[] = useMemo(
    () => [
      {
        id: "title",
        header: t.posts.postTitle,
        accessorKey: "title",
        minWidth: 300,
        enableFiltering: true,
        filterType: "text",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="font-medium line-clamp-1">{row.title}</p>
              {row.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {row.description}
                </p>
              )}
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
          const owner = row.authors.find((a) => a.authorType === AuthorType.OWNER);
          if (!owner) return "-";
          return (
            <div className="flex items-start gap-2">
              {/* <Avatar className="size-6"> */}
                {/* <AvatarImage src={owner.avatarUrl} /> */}
                {/* <AvatarFallback className="text-xs">
                  {owner.fullName?.slice(0, 2).toUpperCase() || "??"}
                </AvatarFallback> */}
              {/* </Avatar> */}
              <span className="text-sm">
                {owner.fullName}
              </span>
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
          <Badge variant={getStatusBadgeVariant(row.status)}>
            {getPostStatusLabel(row.status)}
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
    [t, statusFilterOptions]
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

  const createButton = (
    <Button asChild>
      <Link href="/manage/posts/create">
        <Plus className="mr-2 size-4" />
        {t.posts.createPost}
      </Link>
    </Button>
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

      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.posts.deletePost}</AlertDialogTitle>
            <AlertDialogDescription>{t.posts.confirmDelete}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t.common.cancel}</AlertDialogCancel>
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
