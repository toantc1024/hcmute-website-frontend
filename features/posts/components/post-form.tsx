"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
  FolderOpen,
  Tags,
  Image as ImageIcon,
  Send,
  Eye,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Camera,
  User,
  FileText,
  Crop,
  Info,
  Sparkles,
  Type,
  AlignLeft,
  AlertTriangle,
  Lock,
} from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
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
  type ExtendedAttributes,
  type MediaMetadataRequest,
  getPostStatusLabel,
} from "@/features/posts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import { TagManagementModal } from "./tag-management-modal";
import { CategoryManagementModal } from "./category-management-modal";
import { ImageUploadModal } from "./image-upload-modal";
import {
  ImageCropper,
  COVER_IMAGE_SIZES,
  type CropPreset,
} from "./image-cropper";

// ============================================================================
// UTILITIES
// ============================================================================

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

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================================================

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  disabled?: boolean;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
  badge,
  disabled = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between py-3 px-4 rounded-xl",
          "bg-muted/30 hover:bg-muted/50 transition-colors",
          disabled && "opacity-60 pointer-events-none",
        )}
        disabled={disabled}
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className="font-medium text-sm">{title}</span>
          {badge !== undefined && (
            <Badge className="text-xs bg-primary text-primary-foreground">
              {badge}
            </Badge>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 px-1 overflow-hidden min-w-0">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================================
// FORM FIELD COMPONENT
// ============================================================================

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function FormField({
  label,
  htmlFor,
  required,
  description,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-1.5">
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </Label>
        {required && <span className="text-destructive">*</span>}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}

// ============================================================================
// MAIN POST FORM COMPONENT
// ============================================================================

interface PostFormProps {
  post?: PostDetailView | null;
  isLocked?: boolean;
  lockError?: string | null;
  hasLock?: boolean;
  onSave?: (postId: string) => void;
  backUrl?: string;
}

export function PostForm({
  post,
  isLocked = false,
  lockError,
  hasLock = false,
  onSave,
  backUrl = "/manage/posts",
}: PostFormProps) {
  const router = useRouter();

  const isEditMode = !!post;

  // ========== State ==========
  const [isSaving, setIsSaving] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core fields
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [contentJson, setContentJson] = useState<JSONContent | undefined>(
    undefined,
  );
  const [description, setDescription] = useState(post?.description || "");

  // Categories & Tags
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

  // Cover Image
  const [coverImage, setCoverImage] = useState<FileDto | null>(null);
  const [coverImageCleared, setCoverImageCleared] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [photoCredit, setPhotoCredit] = useState(post?.photoCredit || "");

  // Extended Attributes
  const [extendedAttributes, setExtendedAttributes] =
    useState<ExtendedAttributes>(
      post?.extendedAttributes || { Author: "", Photographer: "" },
    );

  // SEO & Advanced
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    post?.metaDescription || "",
  );
  const [allowCloning, setAllowCloning] = useState(post?.allowCloning ?? true);

  // Modals
  const [showTagModal, setShowTagModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  // ========== Effects ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingCategories(true);
        setIsLoadingTags(true);

        const [categoriesData, tagsData] = await Promise.all([
          categoriesApi.getCategories({ size: 100 }),
          tagsApi.getTags({ size: 100 }),
        ]);

        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoadingCategories(false);
        setIsLoadingTags(false);
      }
    };

    fetchData();
  }, []);

  // ========== Handlers ==========
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

  const handleAIAssist = useCallback(
    async (action: string, selectedText?: string): Promise<string> => {
      // This would connect to your AI service
      // For now, return a placeholder
      toast.info("Tính năng AI đang được phát triển");
      return selectedText || "";
    },
    [],
  );

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

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  }, []);

  const handleRemoveCategory = useCallback((categoryId: string) => {
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
  }, []);

  const handleCoverImageSelect = useCallback((file: FileDto | null) => {
    setCoverImage(file);
    setCroppedImageUrl(null);
    setCroppedImageBlob(null);

    if (file === null) {
      setCoverImageCleared(true);
    } else {
      setCoverImageCleared(false);
      // Open cropper after selecting image
      if (file?.publicUrl) {
        setImageToCrop(file.publicUrl);
        setShowImageCropper(true);
      }
    }
  }, []);

  const handleCropComplete = useCallback((blob: Blob, url: string) => {
    setCroppedImageBlob(blob);
    setCroppedImageUrl(url);
    toast.success("Đã cắt ảnh thành công");
  }, []);

  const handleExtendedAttributeChange = useCallback(
    (key: string, value: string) => {
      setExtendedAttributes((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const addExtendedAttribute = useCallback(() => {
    const key = `Custom_${Date.now()}`;
    setExtendedAttributes((prev) => ({
      ...prev,
      [key]: "",
    }));
  }, []);

  const removeExtendedAttribute = useCallback((key: string) => {
    setExtendedAttributes((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // ========== Validation ==========
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

  // ========== Save Handlers ==========
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      // If we have a cropped image, upload it first
      let finalCoverImageId = coverImage?.id;
      if (croppedImageBlob) {
        const file = new File([croppedImageBlob], "cover-cropped.jpg", {
          type: "image/jpeg",
        });
        const uploaded = await filesApi.uploadFile(file);
        finalCoverImageId = uploaded.id;
      }

      let postId: string;

      if (isEditMode && post) {
        const getCoverImageId = () => {
          if (finalCoverImageId) return finalCoverImageId;
          if (coverImageCleared) return undefined;
          return post.coverImageId || undefined;
        };

        // updatePost now returns void
        await postsApi.updatePost(post.id, {
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
          extendedAttributes:
            Object.keys(extendedAttributes).length > 0
              ? extendedAttributes
              : undefined,
          allowCloning,
          version: post.version,
        });
        postId = post.id;
      } else {
        const slug = generateSlug(title.trim());
        if (!slug) {
          toast.error("Không thể tạo slug từ tiêu đề");
          return;
        }

        // createPost now returns the post ID
        postId = await postsApi.createPost({
          title: title.trim(),
          slug,
          content: content.trim(),
          contentFormat: ContentFormat.TIPTAP_JSON,
          description: description.trim() || undefined,
          categoryIds:
            selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
          tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
          coverImageId: finalCoverImageId,
          photoCredit: photoCredit.trim() || undefined,
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          extendedAttributes:
            Object.keys(extendedAttributes).length > 0
              ? extendedAttributes
              : undefined,
          allowCloning,
        });
      }

      toast.success(
        isEditMode ? "Cập nhật bài viết thành công" : "Tạo bài viết thành công",
      );

      if (onSave) {
        onSave(postId);
      } else {
        // Navigate to manage posts list after success (both create and update)
        router.push("/manage/posts");
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

  // ========== Computed ==========
  const selectedCategories = categories.filter((c) =>
    selectedCategoryIds.includes(c.id),
  );
  const currentCoverImageUrl =
    croppedImageUrl ||
    coverImage?.publicUrl ||
    (!coverImageCleared ? post?.coverImageUrl : undefined);

  // ========== Render ==========
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Lock Status Messages */}
      {(lockError || hasLock) && (
        <div className="shrink-0 px-4 pt-3 pb-0 space-y-2">
          {lockError && (
            <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
              <AlertTriangle className="size-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{lockError}</p>
            </div>
          )}

          {hasLock && !lockError && (
            <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <Lock className="size-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-600">
                Bạn đang giữ quyền chỉnh sửa bài viết này
              </p>
              <Badge variant="default" className="bg-green-500 ml-auto text-xs">
                <Lock className="mr-1 size-3" />
                Đã khóa
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Header with Title */}
      <motion.header
        variants={itemVariants}
        className="shrink-0 bg-background border-b"
      >
        <div className="flex items-center gap-2 px-4 py-2">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            asChild
          >
            <Link href={backUrl}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          {/* Title Input - Notion Style */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <Type className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isEditMode ? "Tiêu đề bài viết..." : "Tiêu đề bài viết mới..."
              }
              disabled={isLocked}
              className={cn(
                "flex-1 min-w-0 bg-transparent border-none outline-none",
                "text-base font-semibold",
                "placeholder:text-muted-foreground/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            />
          </div>

          {/* Status Badge */}
          {isEditMode && post && (
            <Badge variant="outline" className="text-xs shrink-0">
              {getPostStatusLabel(post.status)}
            </Badge>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isEditMode && post?.status === PostStatus.DRAFT && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSubmitDialog(true)}
                disabled={isSaving || isLocked}
              >
                <Send className="mr-1.5 size-3.5" />
                Gửi duyệt
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || isLocked}
            >
              {isSaving ? (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              ) : (
                <Save className="mr-1.5 size-3.5" />
              )}
              Lưu
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Full Height */}
      <div className="flex-1 flex min-h-0 w-full overflow-hidden">
        {/* Editor Area - Properly constrained */}
        <motion.div
          variants={itemVariants}
          className="flex-1 min-w-0 flex flex-col overflow-hidden"
        >
          <div className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-6">
            <div className="w-full max-w-4xl mx-auto h-full">
              <TiptapEditor
                content={content}
                contentJson={contentJson}
                onChange={handleContentChange}
                onImageUpload={handleImageUpload}
                onAIAssist={handleAIAssist}
                editable={!isLocked}
                placeholder="Bắt đầu viết nội dung bài viết..."
                minHeight={400}
                className="h-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Sidebar - Scrollable */}
        <motion.aside
          variants={itemVariants}
          className="
    hidden lg:flex lg:flex-col
    w-80 xl:w-[360px]
    shrink-0
    min-w-0
    border-l bg-muted/10
    overflow-hidden
  "
        >
          <ScrollArea className="flex-1 h-full">
            <div className="p-4 pb-8 space-y-4 max-w-full overflow-hidden">
              {/* Description - First in Sidebar */}
              <CollapsibleSection
                title="Mô tả"
                icon={<AlignLeft className="size-4" />}
                defaultOpen={true}
              >
                <div className="space-y-2">
                  <Textarea
                    value={description}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 250) {
                        setDescription(value);
                      }
                    }}
                    placeholder="Mô tả ngắn gọn về bài viết..."
                    disabled={isLocked}
                    rows={4}
                    maxLength={250}
                    className="rounded-lg border-border resize-none text-sm w-full break-all overflow-wrap-anywhere [word-break:break-word] [overflow-wrap:break-word]"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Hiển thị trong danh sách và preview
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        description.length >= 900
                          ? "text-orange-500"
                          : "text-muted-foreground",
                        description.length >= 250 && "text-destructive",
                      )}
                    >
                      {description.length}/250
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <Separator />

              {/* Cover Image */}
              <CollapsibleSection
                title="Ảnh đại diện"
                icon={<ImageIcon className="size-4" />}
                defaultOpen={true}
              >
                <div className="space-y-3">
                  {currentCoverImageUrl ? (
                    <div className="relative group">
                      <img
                        src={currentCoverImageUrl}
                        alt="Cover"
                        className="w-full aspect-video object-cover rounded-lg border border-border"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {coverImage?.publicUrl && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setImageToCrop(coverImage.publicUrl);
                              setShowImageCropper(true);
                            }}
                          >
                            <Crop className="mr-1.5 size-3.5" />
                            Cắt ảnh
                          </Button>
                        )}
                        <Button
                          // variant="destructive"
                          size="sm"
                          onClick={() => handleCoverImageSelect(null)}
                          disabled={isLocked}
                        >
                          <X className="mr-1.5 size-3.5" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => !isLocked && setShowImageModal(true)}
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                    >
                      <ImageIcon className="mx-auto size-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Nhấn để chọn ảnh đại diện
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Khuyến nghị: 1200×630px
                      </p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full rounded-lg"
                    onClick={() => setShowImageModal(true)}
                    disabled={isLocked}
                  >
                    <ImageIcon className="mr-2 size-4" />
                    {currentCoverImageUrl ? "Thay đổi ảnh" : "Chọn ảnh"}
                  </Button>
                  {currentCoverImageUrl && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Camera className="size-3" />
                        Photo Credit
                      </Label>
                      <Input
                        value={photoCredit}
                        onChange={(e) => setPhotoCredit(e.target.value)}
                        placeholder="Tên người chụp ảnh..."
                        disabled={isLocked}
                        className="text-sm rounded-lg border-border"
                      />
                    </div>
                  )}
                </div>
              </CollapsibleSection>

              <Separator />

              {/* Categories */}
              <CollapsibleSection
                title="Danh mục"
                icon={<FolderOpen className="size-4" />}
                badge={selectedCategoryIds.length}
              >
                <div className="space-y-3">
                  {isLoadingCategories ? (
                    <Skeleton className="h-9 w-full rounded-lg" />
                  ) : (
                    <>
                      <Combobox
                        items={categories}
                        itemToStringValue={(category: CategorySimpleView) =>
                          category.name
                        }
                        multiple
                        value={categories.filter((c) =>
                          selectedCategoryIds.includes(c.id),
                        )}
                        onValueChange={(values: CategorySimpleView[]) => {
                          if (!isLocked) {
                            setSelectedCategoryIds(values.map((v) => v.id));
                          }
                        }}
                        disabled={isLocked}
                      >
                        <ComboboxChips className="min-h-10 rounded-lg">
                          {categories
                            .filter((c) => selectedCategoryIds.includes(c.id))
                            .map((category) => (
                              <ComboboxChip
                                key={category.id}
                                className="bg-primary/10 text-primary border-primary/20"
                              >
                                {category.name}
                              </ComboboxChip>
                            ))}
                          <ComboboxChipsInput
                            placeholder={
                              selectedCategoryIds.length === 0
                                ? "Tìm kiếm danh mục..."
                                : "Thêm danh mục..."
                            }
                            disabled={isLocked}
                          />
                        </ComboboxChips>
                        <ComboboxContent>
                          <ComboboxEmpty>Không tìm thấy danh mục</ComboboxEmpty>
                          <ComboboxList>
                            {(category: CategorySimpleView) => (
                              <ComboboxItem key={category.id} value={category}>
                                <FolderOpen className="size-4 text-muted-foreground" />
                                {category.name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <Button
                        variant="outline"
                        className="w-full rounded-lg"
                        onClick={() => setShowCategoryModal(true)}
                        disabled={isLocked}
                      >
                        <Plus className="mr-2 size-4" />
                        Tạo danh mục mới
                      </Button>
                    </>
                  )}
                </div>
              </CollapsibleSection>

              <Separator />

              {/* Tags */}
              <CollapsibleSection
                title="Thẻ"
                icon={<Tags className="size-4" />}
                badge={selectedTagIds.length}
              >
                <div className="space-y-3">
                  {isLoadingTags ? (
                    <Skeleton className="h-9 w-full rounded-lg" />
                  ) : (
                    <>
                      <Combobox
                        items={tags}
                        itemToStringValue={(tag: TagSimpleView) => tag.name}
                        multiple
                        value={tags.filter((t) =>
                          selectedTagIds.includes(t.id),
                        )}
                        onValueChange={(values: TagSimpleView[]) => {
                          if (!isLocked) {
                            setSelectedTagIds(values.map((v) => v.id));
                          }
                        }}
                        disabled={isLocked}
                      >
                        <ComboboxChips className="min-h-10 rounded-lg">
                          {tags
                            .filter((t) => selectedTagIds.includes(t.id))
                            .map((tag) => (
                              <ComboboxChip
                                key={tag.id}
                                className="bg-primary/10 text-primary border-primary/20"
                              >
                                {tag.name}
                              </ComboboxChip>
                            ))}
                          <ComboboxChipsInput
                            placeholder={
                              selectedTagIds.length === 0
                                ? "Tìm kiếm thẻ..."
                                : "Thêm thẻ..."
                            }
                            disabled={isLocked}
                          />
                        </ComboboxChips>
                        <ComboboxContent>
                          <ComboboxEmpty>Không tìm thấy thẻ</ComboboxEmpty>
                          <ComboboxList>
                            {(tag: TagSimpleView) => (
                              <ComboboxItem key={tag.id} value={tag}>
                                <Tags className="size-4 text-muted-foreground" />
                                {tag.name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <Button
                        variant="outline"
                        className="w-full rounded-lg"
                        onClick={() => setShowTagModal(true)}
                        disabled={isLocked}
                      >
                        <Plus className="mr-2 size-4" />
                        Tạo thẻ mới
                      </Button>
                    </>
                  )}
                </div>
              </CollapsibleSection>

              <Separator />

              {/* Extended Attributes */}
              <CollapsibleSection
                title="Thông tin mở rộng"
                icon={<User className="size-4" />}
                badge={
                  Object.keys(extendedAttributes).filter(
                    (k) => extendedAttributes[k],
                  ).length
                }
              >
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Tác giả / Biên tập viên
                    </Label>
                    <Input
                      value={extendedAttributes.Author || ""}
                      onChange={(e) =>
                        handleExtendedAttributeChange("Author", e.target.value)
                      }
                      placeholder="Phòng Truyền thông"
                      disabled={isLocked}
                      className="rounded-lg border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Nhiếp ảnh gia
                    </Label>
                    <Input
                      value={extendedAttributes.Photographer || ""}
                      onChange={(e) =>
                        handleExtendedAttributeChange(
                          "Photographer",
                          e.target.value,
                        )
                      }
                      placeholder="Nguyễn Văn A"
                      disabled={isLocked}
                      className="rounded-lg border-border"
                    />
                  </div>

                  {/* Custom attributes */}
                  {Object.entries(extendedAttributes)
                    .filter(
                      ([key]) => !["Author", "Photographer"].includes(key),
                    )
                    .map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Input
                            value={key}
                            onChange={(e) => {
                              const newKey = e.target.value;
                              const newAttrs = { ...extendedAttributes };
                              delete newAttrs[key];
                              newAttrs[newKey] = value;
                              setExtendedAttributes(newAttrs);
                            }}
                            placeholder="Tên trường"
                            className="flex-1 text-xs h-7 rounded-md border-border"
                            disabled={isLocked}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 ml-1"
                            onClick={() => removeExtendedAttribute(key)}
                            disabled={isLocked}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                        <Input
                          value={value || ""}
                          onChange={(e) =>
                            handleExtendedAttributeChange(key, e.target.value)
                          }
                          placeholder="Giá trị"
                          disabled={isLocked}
                          className="rounded-lg border-border"
                        />
                      </div>
                    ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-lg"
                    onClick={addExtendedAttribute}
                    disabled={isLocked}
                  >
                    <Plus className="mr-1.5 size-3.5" />
                    Thêm trường mới
                  </Button>
                </div>
              </CollapsibleSection>

              <Separator />

              {/* SEO */}
              <CollapsibleSection
                title="SEO & Meta"
                icon={<FileText className="size-4" />}
              >
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Meta Title
                    </Label>
                    <Input
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={title || "Tiêu đề SEO..."}
                      disabled={isLocked}
                      className="rounded-lg border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Meta Description
                    </Label>
                    <Textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder={description || "Mô tả SEO..."}
                      disabled={isLocked}
                      rows={3}
                      className="rounded-lg border-border resize-none"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              <Separator />

              {/* Settings */}
              <CollapsibleSection
                title="Cài đặt"
                icon={<Eye className="size-4" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Cho phép sao chép</Label>
                      <p className="text-xs text-muted-foreground">
                        Cho phép đơn vị khác nhân bản bài viết
                      </p>
                    </div>
                    <Switch
                      checked={allowCloning}
                      onCheckedChange={setAllowCloning}
                      disabled={isLocked}
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Quick Guide */}
              {!isEditMode && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Info className="size-4 text-blue-500" />
                    Hướng dẫn
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li>
                      • Bài viết sẽ được lưu ở trạng thái <strong>Nháp</strong>
                    </li>
                    <li>• Sau khi lưu, bạn có thể gửi để duyệt</li>
                    <li>
                      • Nhấn{" "}
                      <Sparkles className="inline size-3 text-violet-500" /> AI
                      để sử dụng trợ lý viết
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.aside>
      </div>

      {/* Modals */}
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
        selectedImageUrl={currentCoverImageUrl}
        onSelect={handleCoverImageSelect}
        title="Chọn ảnh đại diện"
        description="Tải lên hoặc chọn ảnh đại diện cho bài viết"
      />

      {imageToCrop && (
        <ImageCropper
          open={showImageCropper}
          onOpenChange={setShowImageCropper}
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          preset="desktop"
          title="Cắt ảnh đại diện"
        />
      )}

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
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
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
