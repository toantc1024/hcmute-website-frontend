"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Lock, Loader2, ArrowLeft } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const LOCK_HEARTBEAT_INTERVAL = 60000;

function needsLock(status: PostStatus): boolean {
  return (
    status === PostStatus.PENDING ||
    status === PostStatus.APPROVED_BY_UNIT_EDITOR ||
    status === PostStatus.APPROVED_BY_UNIT_LEADER ||
    status === PostStatus.APPROVED_BY_UNIT_ADMIN ||
    status === PostStatus.APPROVED_BY_SCHOOL_ADMIN ||
    status === PostStatus.PUBLISHED
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

  const releaseLock = useCallback(async () => {
    if (hasLock && postId) {
      try {
        await postsApi.releaseLock(postId);
      } catch {
      }
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    setHasLock(false);
  }, [hasLock, postId]);

  const acquireLock = useCallback(async () => {
    try {
      await postsApi.acquireLock(postId);
      setHasLock(true);
      setLockError(null);

      heartbeatRef.current = setInterval(async () => {
        try {
          await postsApi.renewLock(postId);
        } catch {
          setLockError(t.posts.lock.lockExpired);
          setHasLock(false);
          if (heartbeatRef.current) {
            clearInterval(heartbeatRef.current);
          }
        }
      }, LOCK_HEARTBEAT_INTERVAL);
    } catch (err) {
      setLockError(err instanceof Error ? err.message : t.posts.lock.lockError);
    }
  }, [postId, t]);

  const checkLockStatus = useCallback(async () => {
    try {
      const status = await postsApi.getLockStatus(postId);
      setLockStatus(status);
      return status;
    } catch {
      return null;
    }
  }, [postId]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await postsApi.getPostById(postId);
        setPost(data);

        if (needsLock(data.status)) {
          const status = await checkLockStatus();
          if (status?.isLocked && !status.isOwnLock) {
            setLockError(
              `${t.posts.lock.lockedBy} ${status.lockedByName || "Unknown"}`
            );
          } else {
            await acquireLock();
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải bài viết");
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }

    return () => {
      releaseLock();
    };
  }, [postId, checkLockStatus, acquireLock, releaseLock, t]);

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

  const handleSave = useCallback(
    (savedPost: PostDetailView) => {
      releaseLock();
      router.push(`/manage/posts/${savedPost.id}?updated=true`);
    },
    [releaseLock, router]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
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

  return (
    <div className="space-y-6">
      {lockError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertTriangle className="size-5 text-destructive shrink-0" />
          <p className="text-destructive">{lockError}</p>
        </div>
      )}

      {hasLock && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <Lock className="size-5 text-green-600 shrink-0" />
          <p className="text-green-600">Bạn đang giữ quyền chỉnh sửa bài viết này</p>
          <Badge variant="default" className="bg-green-500 ml-auto">
            <Lock className="mr-1 size-3" />
            Đã khóa
          </Badge>
        </div>
      )}

      <PostForm
        post={post}
        isLocked={isLocked}
        onSave={handleSave}
        backUrl={`/manage/posts/${postId}`}
      />
    </div>
  );
}
