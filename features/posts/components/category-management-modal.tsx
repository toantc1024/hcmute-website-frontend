"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  FolderOpen,
  X,
  Check,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import {
  categoriesApi,
  type CategorySimpleView,
  type CategoryAuditView,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NO_PARENT_VALUE = "__none__";

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

interface CategoryManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategoryIds: string[];
  onSelectionChange: (categoryIds: string[]) => void;
  onCategoriesChange?: (categories: CategorySimpleView[]) => void;
}

export function CategoryManagementModal({
  open,
  onOpenChange,
  selectedCategoryIds,
  onSelectionChange,
  onCategoriesChange,
}: CategoryManagementModalProps) {
  const [categories, setCategories] = useState<CategoryAuditView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newParentId, setNewParentId] = useState<string>(NO_PARENT_VALUE);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);

  // Initialize local selection when modal opens
  useEffect(() => {
    if (open) {
      setLocalSelectedIds(selectedCategoryIds);
    }
  }, [open, selectedCategoryIds]);

  const [editingCategory, setEditingCategory] =
    useState<CategoryAuditView | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteCategory, setDeleteCategory] =
    useState<CategoryAuditView | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query),
    );
  }, [categories, searchQuery]);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await categoriesApi.getAdminCategories({ size: 100 });
      setCategories(data);

      if (onCategoriesChange) {
        const simpleCategories: CategorySimpleView[] = data.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          parentId: c.parentId,
        }));
        onCategoriesChange(simpleCategories);
      }
    } catch (err) {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setIsLoading(false);
    }
  }, [onCategoriesChange]);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  const handleCreateCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    const existing = categories.find(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existing) {
      toast.error("Danh mục đã tồn tại");
      return;
    }

    try {
      setIsCreating(true);
      const createdCategory = await categoriesApi.createCategory({
        name: trimmedName,
        slug: generateSlug(trimmedName),
        description: newCategoryDescription.trim() || undefined,
        parentId: newParentId !== NO_PARENT_VALUE ? newParentId : undefined,
      });
      setCategories((prev) => [...prev, createdCategory]);
      setNewCategoryName("");
      setNewCategoryDescription("");
      setNewParentId(NO_PARENT_VALUE);
      setShowCreateForm(false);
      toast.success(`Đã tạo danh mục "${createdCategory.name}"`);

      setLocalSelectedIds((prev) => [...prev, createdCategory.id]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tạo danh mục";
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    const trimmedName = editName.trim();
    if (!trimmedName) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    if (
      trimmedName === editingCategory.name &&
      editDescription.trim() === (editingCategory.description || "")
    ) {
      setEditingCategory(null);
      return;
    }

    const existing = categories.find(
      (c) =>
        c.id !== editingCategory.id &&
        c.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existing) {
      toast.error("Danh mục đã tồn tại");
      return;
    }

    try {
      setIsUpdating(true);
      const updatedCategory = await categoriesApi.updateCategory(
        editingCategory.id,
        {
          name: trimmedName,
          description: editDescription.trim() || undefined,
          version: editingCategory.version,
        },
      );

      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? updatedCategory : c)),
      );
      setEditingCategory(null);
      toast.success(`Đã cập nhật danh mục "${updatedCategory.name}"`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể cập nhật danh mục";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;

    try {
      setIsDeleting(true);
      await categoriesApi.deleteCategory(deleteCategory.id);

      setCategories((prev) => prev.filter((c) => c.id !== deleteCategory.id));
      if (localSelectedIds.includes(deleteCategory.id)) {
        setLocalSelectedIds((prev) =>
          prev.filter((id) => id !== deleteCategory.id),
        );
      }

      toast.success(`Đã xóa danh mục "${deleteCategory.name}"`);
      setDeleteCategory(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể xóa danh mục";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    if (localSelectedIds.includes(categoryId)) {
      setLocalSelectedIds((prev) => prev.filter((id) => id !== categoryId));
    } else {
      setLocalSelectedIds((prev) => [...prev, categoryId]);
    }
  };

  const handleSave = () => {
    onSelectionChange(localSelectedIds);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalSelectedIds(selectedCategoryIds);
    onOpenChange(false);
  };

  const startEdit = (category: CategoryAuditView) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || "");
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditName("");
    setEditDescription("");
  };

  const getParentName = (parentId?: string) => {
    if (!parentId) return null;
    const parent = categories.find((c) => c.id === parentId);
    return parent?.name;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="size-5" />
              Quản lý danh mục
            </DialogTitle>
            <DialogDescription>
              Tạo, chỉnh sửa hoặc xóa danh mục. Nhấn vào danh mục để chọn.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!showCreateForm ? (
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="mr-2 size-4" />
                Tạo danh mục mới
              </Button>
            ) : (
              <div className="space-y-3 p-4 border rounded-xl bg-muted/30">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Tên danh mục *"
                  className="rounded-lg"
                />
                <Input
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Mô tả (tùy chọn)"
                  className="rounded-lg"
                />
                <Select value={newParentId} onValueChange={setNewParentId}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Danh mục cha (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_PARENT_VALUE}>Không có</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateCategory}
                    disabled={isCreating || !newCategoryName.trim()}
                    className="flex-1 rounded-lg"
                  >
                    {isCreating ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 size-4" />
                    )}
                    Tạo
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-lg"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewCategoryName("");
                      setNewCategoryDescription("");
                      setNewParentId(NO_PARENT_VALUE);
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm danh mục..."
                className="pl-9 rounded-xl"
              />
            </div>

            <ScrollArea className="h-[280px] rounded-xl border p-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : categories.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Chưa có danh mục nào. Tạo danh mục đầu tiên!
                </p>
              ) : filteredCategories.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Không tìm thấy danh mục phù hợp
                </p>
              ) : (
                <div className="space-y-1.5">
                  {filteredCategories.map((category) => {
                    const isSelected = localSelectedIds.includes(category.id);
                    const isEditing = editingCategory?.id === category.id;
                    const parentName = getParentName(category.parentId);

                    if (isEditing) {
                      return (
                        <div
                          key={category.id}
                          className="space-y-2 p-3 rounded-xl bg-muted border border-border"
                        >
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-9 rounded-lg"
                            autoFocus
                            placeholder="Tên danh mục"
                          />
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="h-9 rounded-lg"
                            placeholder="Mô tả (tùy chọn)"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleUpdateCategory}
                              disabled={isUpdating}
                              className="flex-1 rounded-lg"
                            >
                              {isUpdating ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                              ) : (
                                <Check className="mr-2 size-4" />
                              )}
                              Lưu
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              disabled={isUpdating}
                              className="rounded-lg"
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={category.id}
                        onClick={() => handleSelectCategory(category.id)}
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
                          <FolderOpen className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium text-sm truncate ${isSelected ? "text-primary" : ""}`}
                            >
                              {category.name}
                            </span>
                            {parentName && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                              >
                                {parentName}
                              </Badge>
                            )}
                          </div>
                          {category.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(category);
                            }}
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteCategory(category);
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
                  {localSelectedIds.map((categoryId) => {
                    const category = categories.find(
                      (c) => c.id === categoryId,
                    );
                    if (!category) return null;
                    return (
                      <Badge
                        key={categoryId}
                        variant="secondary"
                        className="rounded-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 cursor-pointer px-3 py-1.5"
                        onClick={() => handleSelectCategory(categoryId)}
                      >
                        {category.name}
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

      <AlertDialog
        open={!!deleteCategory}
        onOpenChange={() => setDeleteCategory(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục &quot;{deleteCategory?.name}
              &quot;? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
