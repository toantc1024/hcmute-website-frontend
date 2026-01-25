"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Edit2, Trash2, Loader2, FolderOpen, X, Check, Search } from "lucide-react";
import { toast } from "sonner";

import { categoriesApi, type CategorySimpleView, type CategoryAuditView } from "@/features/posts";
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
  selectedCategoryId: string;
  onSelectionChange: (categoryId: string) => void;
  onCategoriesChange?: (categories: CategorySimpleView[]) => void;
}

export function CategoryManagementModal({
  open,
  onOpenChange,
  selectedCategoryId,
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

  const [editingCategory, setEditingCategory] = useState<CategoryAuditView | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteCategory, setDeleteCategory] = useState<CategoryAuditView | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
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
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
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

      onSelectionChange(createdCategory.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể tạo danh mục";
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

    if (trimmedName === editingCategory.name && editDescription.trim() === (editingCategory.description || "")) {
      setEditingCategory(null);
      return;
    }

    const existing = categories.find(
      (c) => c.id !== editingCategory.id && c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      toast.error("Danh mục đã tồn tại");
      return;
    }

    try {
      setIsUpdating(true);
      const updatedCategory = await categoriesApi.updateCategory(editingCategory.id, {
        name: trimmedName,
        description: editDescription.trim() || undefined,
        version: editingCategory.version,
      });

      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? updatedCategory : c))
      );
      setEditingCategory(null);
      toast.success(`Đã cập nhật danh mục "${updatedCategory.name}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể cập nhật danh mục";
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
      if (selectedCategoryId === deleteCategory.id) {
        onSelectionChange("");
      }

      toast.success(`Đã xóa danh mục "${deleteCategory.name}"`);
      setDeleteCategory(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể xóa danh mục";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    onSelectionChange(selectedCategoryId === categoryId ? "" : categoryId);
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
                className="w-full"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="mr-2 size-4" />
                Tạo danh mục mới
              </Button>
            ) : (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Tên danh mục *"
                />
                <Input
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Mô tả (tùy chọn)"
                />
                <Select value={newParentId} onValueChange={setNewParentId}>
                  <SelectTrigger>
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
                    className="flex-1"
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
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[240px] rounded-md border p-4">
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
                <div className="space-y-2">
                  {filteredCategories.map((category) => {
                    const isSelected = selectedCategoryId === category.id;
                    const isEditing = editingCategory?.id === category.id;
                    const parentName = getParentName(category.parentId);

                    if (isEditing) {
                      return (
                        <div
                          key={category.id}
                          className="space-y-2 p-3 rounded-md bg-muted"
                        >
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8"
                            autoFocus
                            placeholder="Tên danh mục"
                          />
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="h-8"
                            placeholder="Mô tả (tùy chọn)"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleUpdateCategory}
                              disabled={isUpdating}
                              className="flex-1"
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
                        className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 group"
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleSelectCategory(category.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant={isSelected ? "default" : "outline"}>
                              <FolderOpen className="mr-1 size-3" />
                              {category.name}
                            </Badge>
                            {parentName && (
                              <span className="text-xs text-muted-foreground">
                                trong {parentName}
                              </span>
                            )}
                          </div>
                          {category.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            onClick={() => startEdit(category)}
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 text-destructive hover:text-destructive"
                            onClick={() => setDeleteCategory(category)}
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

            {selectedCategoryId && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Đã chọn:
                </p>
                <Badge variant="secondary" className="cursor-pointer gap-1 pr-1">
                  {categories.find((c) => c.id === selectedCategoryId)?.name}
                  <button
                    type="button"
                    onClick={() => onSelectionChange("")}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "{deleteCategory?.name}"? 
              Hành động này không thể hoàn tác.
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
