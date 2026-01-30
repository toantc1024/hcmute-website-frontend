"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
  FolderOpen,
  Tags,
  Image as ImageIcon,
  Send,
  Settings2,
  Eye,
} from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n";
import {
  postsApi,
  filesApi,
  categoriesApi,
  tagsApi,
  TiptapEditor,
  ContentFormat,
  PostStatus,
  type PostDetailView,
  type CategorySimpleView,
  type TagSimpleView,
  type FileDto,
  getPostStatusLabel,
} from "@/features/posts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { TagManagementModal } from "./tag-management-modal";
import { CategoryManagementModal } from "./category-management-modal";
import { ImageUploadModal } from "./image-upload-modal";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface PostFormProps {
  post?: PostDetailView | null;
  isLocked?: boolean;
  onSave?: (post: PostDetailView) => void;
  backUrl?: string;
}

export function PostForm({
  post,
  isLocked = false,
  onSave,
  backUrl = "/manage/posts",
}: PostFormProps) {
  const router = useRouter();
  const { t } = useI18n();

  const isEditMode = !!post;

  const [isSaving, setIsSaving] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [contentJson, setContentJson] = useState<JSONContent | undefined>(
    undefined,
  );
  const [description, setDescription] = useState(post?.description || "");

  const [categories, setCategories] = useState<CategorySimpleView[]>([]);
  const [tags, setTags] = useState<TagSimpleView[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    post?.categories?.map((c) => c.id) || [],
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    post?.tags?.map((t) => t.id) || [],
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const [coverImage, setCoverImage] = useState<FileDto | null>(null);
  const [coverImageCleared, setCoverImageCleared] = useState(false);
  const [photoCredit, setPhotoCredit] = useState(post?.photoCredit || "");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    post?.metaDescription || "",
  );
  const [allowCloning, setAllowCloning] = useState(post?.allowCloning ?? true);

  const [showTagModal, setShowTagModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await categoriesApi.getCategories({ size: 100 });
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    const fetchTags = async () => {
      try {
        setIsLoadingTags(true);
        const data = await tagsApi.getTags({ size: 100 });
        setTags(data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const handleContentChange = useCallback((html: string, json: JSONContent) => {
    setContent(html);
    setContentJson(json);
  }, []);

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    try {
      const results = await filesApi.uploadStreaming([file]);
      return results[0].publicUrl;
    } catch {
      const result = await filesApi.uploadFile(file);
      return result.publicUrl;
    }
  }, []);

  const handleTagToggle = useCallback((tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  }, []);

  const handleRemoveTag = useCallback((tagId: string) => {
    setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
  }, []);

  const handleCoverImageSelect = useCallback((file: FileDto | null) => {
    setCoverImage(file);
    if (file === null) {
      setCoverImageCleared(true);
    } else {
      setCoverImageCleared(false);
    }
  }, []);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết");
      return false;
    }

    if (!content.trim() || content === "<p></p>") {
      toast.error("Vui lòng nhập nội dung bài viết");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      let savedPost: PostDetailView;

      if (isEditMode && post) {
        const getCoverImageId = () => {
          if (coverImage?.id) return coverImage.id;
          if (coverImageCleared) return undefined;
          return post.coverImageId || undefined;
        };

        savedPost = await postsApi.updatePost(post.id, {
          title: title.trim(),
          content: content.trim(),
          contentFormat: ContentFormat.TIPTAP_JSON,
          description: description.trim() || undefined,
          categoryIds:
            selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
          tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
          coverImageId: getCoverImageId(),
          photoCredit: photoCredit.trim() || undefined,
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          allowCloning,
          version: post.version,
        });
      } else {
        const slug = generateSlug(title.trim());
        if (!slug) {
          toast.error("Không thể tạo slug từ tiêu đề");
          return;
        }

        savedPost = await postsApi.createPost({
          title: title.trim(),
          slug,
          content: content.trim(),
          contentFormat: ContentFormat.TIPTAP_JSON,
          description: description.trim() || undefined,
          categoryIds:
            selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
          tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
          coverImageId: coverImage?.id,
          photoCredit: photoCredit.trim() || undefined,
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          allowCloning,
        });
      }

      if (!savedPost || !savedPost.id) {
        throw new Error("Không thể lưu bài viết. Vui lòng thử lại.");
      }

      toast.success(
        isEditMode ? "Cập nhật bài viết thành công" : "Tạo bài viết thành công",
      );

      if (onSave) {
        onSave(savedPost);
      } else {
        router.push(`/manage/posts/${savedPost.id}`);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu bài viết";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!validateForm()) return;
    if (!post) return;

    try {
      setIsSubmitting(true);

      await postsApi.updatePost(post.id, {
        title: title.trim(),
        content: content.trim(),
        contentFormat: ContentFormat.TIPTAP_JSON,
        description: description.trim() || undefined,
        categoryIds:
          selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        coverImageId: coverImage?.id || post.coverImageId || undefined,
        photoCredit: photoCredit.trim() || undefined,
        version: post.version,
      });

      await postsApi.submitPost(post.id, { version: post.version + 1 });

      toast.success("Đã gửi bài viết để duyệt");
      router.push("/manage/posts");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi gửi duyệt";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={backUrl}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditMode ? t.posts.editPost : t.posts.createPost}
            </h1>
            {isEditMode && post && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  {getPostStatusLabel(post.status)}
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode && post?.status === PostStatus.DRAFT && (
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(true)}
              disabled={isSaving || isLocked}
            >
              <Send className="mr-2 size-4" />
              {t.posts.actions.submitReview}
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving || isLocked}>
            {isSaving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            {t.common.save}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.posts.postTitle} *</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                disabled={isLocked}
                className="text-lg"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.posts.postContent} *</CardTitle>
              <CardDescription>
                Sử dụng thanh công cụ để định dạng nội dung
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <TiptapEditor
                content={content}
                contentJson={contentJson}
                onChange={handleContentChange}
                onImageUpload={handleImageUpload}
                editable={!isLocked}
                placeholder="Bắt đầu viết nội dung bài viết..."
                minHeight={400}
                className="border-0 rounded-none"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="size-4" />
                Ảnh đại diện
              </CardTitle>
              <CardDescription>Hình ảnh đại diện cho bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {coverImage?.publicUrl ||
              (!coverImageCleared && post?.coverImageUrl) ? (
                <div className="relative">
                  <img
                    src={coverImage?.publicUrl || post?.coverImageUrl}
                    alt="Cover"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 size-7"
                    onClick={() => handleCoverImageSelect(null)}
                    disabled={isLocked}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => !isLocked && setShowImageModal(true)}
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                >
                  <ImageIcon className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Nhấn để chọn ảnh
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowImageModal(true)}
                disabled={isLocked}
              >
                <ImageIcon className="mr-2 size-4" />
                {coverImage || (!coverImageCleared && post?.coverImageUrl)
                  ? "Thay đổi ảnh"
                  : "Chọn ảnh"}
              </Button>
              {(coverImage || (!coverImageCleared && post?.coverImageUrl)) && (
                <Input
                  value={photoCredit}
                  onChange={(e) => setPhotoCredit(e.target.value)}
                  placeholder="Photo credit (tùy chọn)"
                  disabled={isLocked}
                  className="text-sm"
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="size-4" />
                Danh mục
              </CardTitle>
              <CardDescription>Chọn danh mục cho bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingCategories ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <>
                  {selectedCategoryIds.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedCategoryIds.map((categoryId) => {
                        const category = categories.find(
                          (c) => c.id === categoryId,
                        );
                        if (!category) return null;
                        return (
                          <Badge
                            key={categoryId}
                            variant="secondary"
                            className="cursor-pointer gap-1 pr-1 rounded-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                          >
                            {category.name}
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(categoryId)}
                              className="ml-1 rounded-full p-0.5 hover:bg-primary/30"
                              disabled={isLocked}
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Chưa chọn danh mục
                    </p>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowCategoryModal(true)}
                    disabled={isLocked}
                  >
                    <FolderOpen className="mr-2 size-4" />
                    Quản lý danh mục
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="size-4" />
                Thẻ
              </CardTitle>
              <CardDescription>
                Chọn các thẻ liên quan đến bài viết
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedTagIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTagIds.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="cursor-pointer gap-1 pr-1"
                      >
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag.id)}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                          disabled={isLocked}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
              {isLoadingTags ? (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
                  {tags
                    .filter((tag) => !selectedTagIds.includes(tag.id))
                    .slice(0, 10)
                    .map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => !isLocked && handleTagToggle(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowTagModal(true)}
                disabled={isLocked}
              >
                <Tags className="mr-2 size-4" />
                Quản lý thẻ
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mô tả</CardTitle>
              <CardDescription>
                Mô tả ngắn gọn về bài viết (tùy chọn)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả ngắn gọn..."
                className="w-full min-h-[120px] p-3 rounded-md border bg-background resize-y text-sm"
                disabled={isLocked}
              />
            </CardContent>
          </Card>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Settings2 className="size-4" />
                      SEO & Nâng cao
                    </span>
                    <Badge variant="outline" className="font-normal">
                      {showAdvanced ? "Thu gọn" : "Mở rộng"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-cloning">Cho phép sao chép</Label>
                      <p className="text-xs text-muted-foreground">
                        Cho phép người khác nhân bản bài viết này
                      </p>
                    </div>
                    <Switch
                      id="allow-cloning"
                      checked={allowCloning}
                      onCheckedChange={setAllowCloning}
                      disabled={isLocked}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Meta Title</Label>
                    <Input
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Tiêu đề SEO (mặc định: tiêu đề bài viết)"
                      disabled={isLocked}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Meta Description
                    </Label>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Mô tả SEO (mặc định: mô tả bài viết)"
                      className="w-full min-h-[80px] p-3 rounded-md border bg-background resize-y text-sm mt-1.5"
                      disabled={isLocked}
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {!isEditMode && (
            <Card>
              <CardHeader>
                <CardTitle>Hướng dẫn</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  • Bài viết sẽ được lưu ở trạng thái <strong>Nháp</strong>
                </p>
                <p>
                  • Sau khi lưu, bạn có thể chỉnh sửa thêm hoặc gửi để duyệt
                </p>
                <p>• Sử dụng các công cụ định dạng để tạo nội dung phong phú</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      <TagManagementModal
        open={showTagModal}
        onOpenChange={setShowTagModal}
        selectedTagIds={selectedTagIds}
        onSelectionChange={setSelectedTagIds}
        onTagsChange={setTags}
      />

      <CategoryManagementModal
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        selectedCategoryIds={selectedCategoryIds}
        onSelectionChange={setSelectedCategoryIds}
        onCategoriesChange={setCategories}
      />

      <ImageUploadModal
        open={showImageModal}
        onOpenChange={setShowImageModal}
        selectedImageId={
          coverImage?.id ||
          (!coverImageCleared ? post?.coverImageId : undefined)
        }
        selectedImageUrl={
          coverImage?.publicUrl ||
          (!coverImageCleared ? post?.coverImageUrl : undefined)
        }
        onSelect={handleCoverImageSelect}
        title="Chọn ảnh đại diện"
        description="Tải lên hoặc chọn ảnh đại diện cho bài viết"
      />

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
    </motion.div>
  );
}
