"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, AlertTriangle, Globe } from "lucide-react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n";
import {
  postsApi,
  PostForm,
  type PostDetailView,
  type LockDto,
  PostStatus,
} from "@/features/posts";

import { Button } from "@/components/ui/button";
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

const LOCK_HEARTBEAT_INTERVAL = 60000;

// Status that needs lock (excluding PUBLISHED - handled separately)
function needsLock(status: PostStatus): boolean {
  return (
    status === PostStatus.PENDING ||
    status === PostStatus.APPROVED_BY_UNIT_EDITOR ||
    status === PostStatus.APPROVED_BY_UNIT_LEADER ||
    status === PostStatus.APPROVED_BY_UNIT_ADMIN ||
    status === PostStatus.APPROVED_BY_SCHOOL_ADMIN
  );
}

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const postId = params.id as string;

  const [post, setPost] = useState<PostDetailView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [lockStatus, setLockStatus] = useState<LockDto | null>(null);
  const [hasLock, setHasLock] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const hasLockRef = useRef(false);
  const hasFetchedRef = useRef(false);

  // For published post - show unpublish dialog
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);

  // Keep ref in sync with state
  useEffect(() => {
    hasLockRef.current = hasLock;
  }, [hasLock]);

  const releaseLock = useCallback(async () => {
    if (hasLockRef.current && postId) {
      try {
        await postsApi.releaseLock(postId);
      } catch {}
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    setHasLock(false);
    hasLockRef.current = false;
  }, [postId]);

  useEffect(() => {
    // Prevent double fetch in development StrictMode
    if (hasFetchedRef.current) return;

    const fetchPost = async () => {
      hasFetchedRef.current = true;

      try {
        setIsLoading(true);
        setError(null);

        const data = await postsApi.getPostById(postId);
        setPost(data);

        // If published, show unpublish dialog instead of locking
        if (data.status === PostStatus.PUBLISHED) {
          setShowUnpublishDialog(true);
          return;
        }

        if (needsLock(data.status)) {
          // Check lock status
          let status: LockDto | null = null;
          try {
            status = await postsApi.getLockStatus(postId);
            setLockStatus(status);
          } catch {
            status = null;
          }

          if (status?.isLocked && !status.isOwnLock) {
            setLockError(
              `${t.posts.lock.lockedBy} ${status.lockedByName || "Unknown"}`,
            );
          } else {
            // Acquire lock
            try {
              await postsApi.acquireLock(postId);
              setHasLock(true);
              hasLockRef.current = true;
              setLockError(null);

              heartbeatRef.current = setInterval(async () => {
                try {
                  await postsApi.renewLock(postId);
                } catch {
                  setLockError(t.posts.lock.lockExpired);
                  setHasLock(false);
                  hasLockRef.current = false;
                  if (heartbeatRef.current) {
                    clearInterval(heartbeatRef.current);
                  }
                }
              }, LOCK_HEARTBEAT_INTERVAL);
            } catch (err) {
              setLockError(
                err instanceof Error ? err.message : t.posts.lock.lockError,
              );
            }
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải bài viết",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }

    return () => {
      // Only release lock on unmount, not on re-render
      if (hasLockRef.current && postId) {
        postsApi.releaseLock(postId).catch(() => {});
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [postId, t]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasLock) {
        navigator.sendBeacon(`/api/release-lock/${postId}`);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasLock, postId]);

  const handleSave = useCallback((_savedPostId: string) => {
    // Don't navigate on update, just stay on the edit page
    // The toast is already shown in PostForm
  }, []);

  const handleUnpublish = async () => {
    try {
      setIsUnpublishing(true);
      await postsApi.unpublishPost(postId);
      toast.success("Đã hủy đăng bài viết. Bạn có thể chỉnh sửa ngay bây giờ.");

      // Refetch post to get updated status
      const updatedPost = await postsApi.getPostById(postId);
      setPost(updatedPost);
      setShowUnpublishDialog(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Không thể hủy đăng bài viết",
      );
    } finally {
      setIsUnpublishing(false);
    }
  };

  const handleCancelUnpublish = () => {
    setShowUnpublishDialog(false);
    router.push(`/manage/posts/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="-m-4 md:-m-6 h-[calc(100%+2rem)] md:h-[calc(100%+3rem)] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="-m-4 md:-m-6 h-[calc(100%+2rem)] md:h-[calc(100%+3rem)] flex flex-col items-center justify-center text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" asChild>
          <Link href="/manage/posts">
            <ArrowLeft className="mr-2 size-4" />
            {t.common.back}
          </Link>
        </Button>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const isLocked = needsLock(post.status) && !hasLock;
  const isPublished = post.status === PostStatus.PUBLISHED;

  return (
    <>
      <div className="-m-4 md:-m-6 h-[calc(100%+2rem)] md:h-[calc(100%+3rem)]">
        <PostForm
          post={post}
          isLocked={isLocked || isPublished}
          lockError={lockError}
          hasLock={hasLock}
          onSave={handleSave}
          backUrl={`/manage/posts/${postId}`}
        />
      </div>

      {/* Unpublish Dialog for Published Posts */}
      <AlertDialog
        open={showUnpublishDialog}
        onOpenChange={setShowUnpublishDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <Globe className="size-5 text-orange-600" />
              </div>
              <AlertDialogTitle>Bài viết đã được đăng</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-2">
              <p>
                Bài viết này đang được hiển thị công khai. Để chỉnh sửa, bạn cần
                hủy đăng bài trước.
              </p>
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-3">
                <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Sau khi hủy đăng, bài viết sẽ không còn hiển thị công khai cho
                  đến khi bạn đăng lại.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelUnpublish}
              disabled={isUnpublishing}
            >
              Quay lại
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnpublish}
              disabled={isUnpublishing}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isUnpublishing ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Hủy đăng để chỉnh sửa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
