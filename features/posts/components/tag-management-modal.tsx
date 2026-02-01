"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Tag,
  X,
  Check,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import {
  tagsApi,
  type TagSimpleView,
  type TagAuditView,
} from "@/features/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

function generateSlug(name: string): string {
  return name
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

interface TagManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTagIds: string[];
  onSelectionChange: (tagIds: string[]) => void;
  onTagsChange?: (tags: TagSimpleView[]) => void;
}

export function TagManagementModal({
  open,
  onOpenChange,
  selectedTagIds,
  onSelectionChange,
  onTagsChange,
}: TagManagementModalProps) {
  const [tags, setTags] = useState<TagAuditView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);

  // Initialize local selection when modal opens
  useEffect(() => {
    if (open) {
      setLocalSelectedIds(selectedTagIds);
    }
  }, [open, selectedTagIds]);

  const [editingTag, setEditingTag] = useState<TagAuditView | null>(null);
  const [editName, setEditName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteTag, setDeleteTag] = useState<TagAuditView | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    const query = searchQuery.toLowerCase();
    return tags.filter((t) => t.name.toLowerCase().includes(query));
  }, [tags, searchQuery]);

  const fetchTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await tagsApi.getAdminTags({ size: 100 });
      setTags(data);

      if (onTagsChange) {
        const simpleTags: TagSimpleView[] = data.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
        }));
        onTagsChange(simpleTags);
      }
    } catch (err) {
      toast.error("Không thể tải danh sách thẻ");
    } finally {
      setIsLoading(false);
    }
  }, [onTagsChange]);

  useEffect(() => {
    if (open) {
      fetchTags();
    }
  }, [open, fetchTags]);

  const handleCreateTag = async () => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) {
      toast.error("Vui lòng nhập tên thẻ");
      return;
    }

    const existing = tags.find(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existing) {
      toast.error("Thẻ đã tồn tại");
      return;
    }

    try {
      setIsCreating(true);
      const createdTagId = await tagsApi.createTag(trimmedName);
      setNewTagName("");
      setShowCreateModal(false);
      toast.success(`Đã tạo thẻ "${trimmedName}"`);

      // Add the new tag to selection
      setLocalSelectedIds((prev) => [...prev, createdTagId]);

      // Refetch to get the latest data
      await fetchTags();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể tạo thẻ";
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag) return;

    const trimmedName = editName.trim();
    if (!trimmedName) {
      toast.error("Vui lòng nhập tên thẻ");
      return;
    }

    if (trimmedName === editingTag.name) {
      setEditingTag(null);
      return;
    }

    const existing = tags.find(
      (t) =>
        t.id !== editingTag.id &&
        t.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existing) {
      toast.error("Thẻ đã tồn tại");
      return;
    }

    try {
      setIsUpdating(true);
      await tagsApi.updateTag(editingTag.id, {
        name: trimmedName,
        version: editingTag.version,
      });

      setEditingTag(null);
      setShowEditModal(false);
      toast.success(`Đã cập nhật thẻ "${trimmedName}"`);

      // Refetch to get the latest data
      await fetchTags();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể cập nhật thẻ";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTag = async () => {
    if (!deleteTag) return;

    try {
      setIsDeleting(true);
      await tagsApi.deleteTag(deleteTag.id);

      setTags((prev) => prev.filter((t) => t.id !== deleteTag.id));
      setLocalSelectedIds((prev) => prev.filter((id) => id !== deleteTag.id));

      toast.success(`Đã xóa thẻ "${deleteTag.name}"`);
      setDeleteTag(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể xóa thẻ";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleTag = (tagId: string) => {
    if (localSelectedIds.includes(tagId)) {
      setLocalSelectedIds((prev) => prev.filter((id) => id !== tagId));
    } else {
      setLocalSelectedIds((prev) => [...prev, tagId]);
    }
  };

  const handleSave = () => {
    onSelectionChange(localSelectedIds);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalSelectedIds(selectedTagIds);
    onOpenChange(false);
  };

  const startEdit = (tag: TagAuditView) => {
    setEditingTag(tag);
    setEditName(tag.name);
    setShowEditModal(true);
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setEditName("");
    setShowEditModal(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="size-5" />
              Quản lý thẻ
            </DialogTitle>
            <DialogDescription>
              Tạo, chỉnh sửa hoặc xóa thẻ. Nhấn vào thẻ để chọn/bỏ chọn.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="mr-2 size-4" />
              Tạo thẻ mới
            </Button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm thẻ..."
                className="pl-9 rounded-xl"
              />
            </div>

            <ScrollArea className="h-[280px] rounded-xl border p-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : tags.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Chưa có thẻ nào. Tạo thẻ đầu tiên!
                </p>
              ) : filteredTags.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Không tìm thấy thẻ phù hợp
                </p>
              ) : (
                <div className="space-y-1.5">
                  {filteredTags.map((tag) => {
                    const isSelected = localSelectedIds.includes(tag.id);

                    return (
                      <div
                        key={tag.id}
                        onClick={() => handleToggleTag(tag.id)}
                        className={`
                          group flex items-center gap-3 p-3 rounded-xl cursor-pointer
                          border transition-all duration-200
                          ${
                            isSelected
                              ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20"
                              : "bg-background border-border hover:bg-muted/50 hover:border-muted-foreground/20"
                          }
                        `}
                      >
                        <div
                          className={`
                          flex items-center justify-center size-9 rounded-lg shrink-0
                          ${isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}
                        `}
                        >
                          <Tag className="size-4" />
                        </div>
                        <span
                          className={`font-medium text-sm flex-1 ${isSelected ? "text-primary" : ""}`}
                        >
                          {tag.name}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(tag);
                            }}
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="size-7 rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTag(tag);
                            }}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {localSelectedIds.length > 0 && (
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Đã chọn ({localSelectedIds.length})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => setLocalSelectedIds([])}
                  >
                    <X className="size-3.5 mr-1" />
                    Bỏ chọn tất cả
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localSelectedIds.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="cursor-pointer rounded-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1.5"
                        onClick={() => handleToggleTag(tag.id)}
                      >
                        {tag.name}
                        <X className="size-3 ml-1.5" />
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={handleCancel}
            >
              Hủy
            </Button>
            <Button className="rounded-xl" onClick={handleSave}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Tag Modal - Nested */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-5" />
              Tạo thẻ mới
            </DialogTitle>
            <DialogDescription>Nhập tên thẻ mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tên thẻ *"
                className="rounded-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => {
                setShowCreateModal(false);
                setNewTagName("");
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateTag}
              disabled={isCreating || !newTagName.trim()}
              className="rounded-lg"
            >
              {isCreating ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Plus className="mr-2 size-4" />
              )}
              Tạo thẻ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Modal - Nested */}
      <Dialog
        open={showEditModal}
        onOpenChange={(open) => {
          if (!open) cancelEdit();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="size-5" />
              Chỉnh sửa thẻ
            </DialogTitle>
            <DialogDescription>Cập nhật tên thẻ</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Tên thẻ *"
                className="rounded-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUpdateTag();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={cancelEdit}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateTag}
              disabled={isUpdating || !editName.trim()}
              className="rounded-lg"
            >
              {isUpdating ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Check className="mr-2 size-4" />
              )}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTag} onOpenChange={() => setDeleteTag(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa thẻ?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thẻ &quot;{deleteTag?.name}&quot;? Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="rounded-lg">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTag}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
