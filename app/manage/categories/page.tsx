"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  FolderTree,
  FolderOpen,
  FileText,
  Calendar,
  Hash,
  X,
  Save,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import {
  categoriesApi,
  type CategoryView,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
} from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loader";

// ── Mock Data ───────────────────────────────────────────────────────
const MOCK_CATEGORIES: CategoryView[] = [
  {
    id: "1",
    name: "Tin tức",
    slug: "tin-tuc",
    description: "Tin tức chung của trường",
    parentId: "",
    parentName: "",
    postCount: 156,
    createdAt: "2024-03-15T08:00:00Z",
    updatedAt: "2025-02-10T10:30:00Z",
  },
  {
    id: "2",
    name: "Thông báo",
    slug: "thong-bao",
    description: "Thông báo từ nhà trường",
    parentId: "",
    parentName: "",
    postCount: 89,
    createdAt: "2024-03-15T08:00:00Z",
    updatedAt: "2025-02-08T14:20:00Z",
  },
  {
    id: "3",
    name: "Đào tạo",
    slug: "dao-tao",
    description: "Tin tức về đào tạo, chương trình học",
    parentId: "",
    parentName: "",
    postCount: 67,
    createdAt: "2024-04-01T09:00:00Z",
    updatedAt: "2025-01-25T16:45:00Z",
  },
  {
    id: "4",
    name: "Tuyển sinh",
    slug: "tuyen-sinh",
    description: "Thông tin tuyển sinh các hệ đào tạo",
    parentId: "3",
    parentName: "Đào tạo",
    postCount: 34,
    createdAt: "2024-04-10T10:00:00Z",
    updatedAt: "2025-02-01T11:00:00Z",
  },
  {
    id: "5",
    name: "Nghiên cứu khoa học",
    slug: "nghien-cuu-khoa-hoc",
    description: "Hoạt động nghiên cứu khoa học",
    parentId: "",
    parentName: "",
    postCount: 45,
    createdAt: "2024-05-01T07:00:00Z",
    updatedAt: "2025-01-30T09:15:00Z",
  },
  {
    id: "6",
    name: "Sinh viên",
    slug: "sinh-vien",
    description: "Tin tức dành cho sinh viên",
    parentId: "",
    parentName: "",
    postCount: 120,
    createdAt: "2024-03-20T08:30:00Z",
    updatedAt: "2025-02-12T13:00:00Z",
  },
  {
    id: "7",
    name: "Học bổng",
    slug: "hoc-bong",
    description: "Thông tin học bổng và hỗ trợ tài chính",
    parentId: "6",
    parentName: "Sinh viên",
    postCount: 28,
    createdAt: "2024-06-01T09:00:00Z",
    updatedAt: "2025-01-20T15:30:00Z",
  },
  {
    id: "8",
    name: "Sự kiện",
    slug: "su-kien",
    description: "Sự kiện, hội thảo, hội nghị",
    parentId: "",
    parentName: "",
    postCount: 73,
    createdAt: "2024-04-15T10:00:00Z",
    updatedAt: "2025-02-05T12:00:00Z",
  },
  {
    id: "9",
    name: "Hợp tác quốc tế",
    slug: "hop-tac-quoc-te",
    description: "Hoạt động hợp tác quốc tế và trao đổi sinh viên",
    parentId: "",
    parentName: "",
    postCount: 31,
    createdAt: "2024-07-01T08:00:00Z",
    updatedAt: "2025-01-15T10:45:00Z",
  },
  {
    id: "10",
    name: "Việc làm",
    slug: "viec-lam",
    description: "Thông tin việc làm, thực tập cho sinh viên",
    parentId: "6",
    parentName: "Sinh viên",
    postCount: 52,
    createdAt: "2024-05-20T09:30:00Z",
    updatedAt: "2025-02-11T14:00:00Z",
  },
];

// ── Animation variants ──────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

// ── Stat Card ───────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient?: string;
  description?: string;
}

function StatCard({
  title,
  value,
  icon,
  gradient,
  description,
}: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card
        className={`h-full relative overflow-hidden ${gradient ? "text-white border-0" : ""}`}
      >
        {gradient && <div className={`absolute inset-0 ${gradient}`} />}
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className={`text-sm font-medium ${gradient ? "text-white/90" : ""}`}
          >
            {title}
          </CardTitle>
          <div className={gradient ? "text-white/80" : "text-muted-foreground"}>
            {icon}
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p
              className={`text-xs mt-1 ${gradient ? "text-white/70" : "text-muted-foreground"}`}
            >
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Main Content ────────────────────────────────────────────────────
function CategoriesContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<CategoryView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Dialog state
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create/Edit dialog
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryView | null>(
    null,
  );
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: "",
    slug: "",
    description: "",
    parentId: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use mock data (replace with API call when backend is ready)
      let filtered = [...MOCK_CATEGORIES];

      const nameFilter = searchParams.get("name");
      if (nameFilter) {
        const q = nameFilter.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.slug.toLowerCase().includes(q),
        );
      }

      setTotalElements(filtered.length);
      setTotalPages(Math.ceil(filtered.length / size));

      const start = page * size;
      const paged = filtered.slice(start, start + size);
      setCategories(paged);
      setHasNextPage(start + size < filtered.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải danh mục",
      );
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, size, searchParams]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ── Form handlers ───────────────────────────────────────────────
  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "", parentId: "" });
    setFormDialogOpen(true);
  };

  const openEditDialog = (category: CategoryView) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: category.parentId || "",
    });
    setFormDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        parentId: formData.parentId || undefined,
      };

      if (editingCategory) {
        await categoriesApi.updateCategory(editingCategory.id, payload);
      } else {
        await categoriesApi.createCategory(payload);
      }

      setFormDialogOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.categories.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategoryId) return;
    try {
      setIsDeleting(true);
      await categoriesApi.deleteCategory(deleteCategoryId);
      setDeleteCategoryId(null);
      fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa danh mục",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ── Stats ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const rootCategories = categories.filter((c) => !c.parentId);
    const childCategories = categories.filter((c) => c.parentId);
    const totalPosts = categories.reduce(
      (sum, c) => sum + (c.postCount || 0),
      0,
    );

    return [
      {
        title: t.categories.allCategories,
        value: totalElements,
        icon: <FolderTree className="size-4" />,
        description: t.categories.description,
        gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
      },
      {
        title: "Danh mục gốc",
        value: rootCategories.length,
        icon: <FolderOpen className="size-4" />,
        description: "Không có danh mục cha",
        gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
      },
      {
        title: "Danh mục con",
        value: childCategories.length,
        icon: <FolderTree className="size-4" />,
        description: "Thuộc danh mục cha",
      },
      {
        title: "Tổng bài viết",
        value: totalPosts,
        icon: <FileText className="size-4" />,
        description: "Trong tất cả danh mục",
      },
    ];
  }, [categories, totalElements, t]);

  // ── Table columns ───────────────────────────────────────────────
  const columns: ColumnDef<CategoryView>[] = useMemo(
    () => [
      {
        id: "name",
        header: t.categories.categoryName,
        accessorKey: "name",
        minWidth: 250,
        enableFiltering: true,
        filterType: "text" as const,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
              {row.parentId ? (
                <FolderTree className="size-4 text-primary" />
              ) : (
                <FolderOpen className="size-4 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium line-clamp-1">{row.name}</p>
              {row.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {row.description}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "slug",
        header: t.categories.slug,
        accessorKey: "slug",
        enableFiltering: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <Hash className="size-3.5 text-muted-foreground" />
            <code className="text-sm text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {row.slug}
            </code>
          </div>
        ),
      },
      {
        id: "parentName",
        header: t.categories.parentCategory,
        enableFiltering: false,
        enableSorting: false,
        cell: ({ row }) =>
          row.parentName ? (
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
            >
              <FolderOpen className="size-2.5 mr-1" />
              {row.parentName}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        id: "postCount",
        header: t.categories.postCount,
        accessorKey: "postCount",
        enableFiltering: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <FileText className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {(row.postCount || 0).toLocaleString()}
            </span>
          </div>
        ),
      },
      {
        id: "createdAt",
        header: "Ngày tạo",
        accessorKey: "createdAt",
        enableFiltering: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>{formatDate(row.createdAt)}</span>
          </div>
        ),
      },
    ],
    [t],
  );

  // ── Row actions ─────────────────────────────────────────────────
  const renderActions = (row: CategoryView) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openEditDialog(row)}>
          <Edit className="mr-2 size-4" />
          {t.categories.editCategory}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeleteCategoryId(row.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t.categories.deleteCategory}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ── Create button ───────────────────────────────────────────────
  const createButton = (
    <Button onClick={openCreateDialog}>
      <Plus className="mr-2 size-4" />
      {t.categories.createCategory}
    </Button>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 relative"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-400/15 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent rounded-3xl blur-xl" />
        <div className="relative bg-white/50 dark:bg-background/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 p-6 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white">
              <FolderTree className="size-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent">
              {t.categories.title}
            </h1>
          </div>
          <p className="text-muted-foreground">{t.categories.description}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Data Table */}
      <motion.div variants={itemVariants}>
        <DataTable
          data={categories}
          columns={columns}
          isLoading={isLoading}
          error={error}
          totalElements={totalElements}
          totalPages={totalPages}
          pageSize={size}
          currentPage={page}
          hasNextPage={hasNextPage}
          hasPreviousPage={page > 0}
          onRefresh={fetchCategories}
          onCreate={createButton}
          rowKey="id"
          emptyMessage={t.categories.noCategoriesFound}
          emptyIcon={<FolderTree className="size-12" />}
          searchPlaceholder={t.categories.searchPlaceholder}
          actions={renderActions}
          syncWithUrl={true}
        />
      </motion.div>

      {/* Create/Edit Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? t.categories.editCategory
                : t.categories.createCategory}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Chỉnh sửa thông tin danh mục"
                : "Tạo danh mục mới để phân loại bài viết"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.categories.categoryName} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nhập tên danh mục..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">{t.categories.slug}</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="tu-dong-tao-tu-ten"
              />
              <p className="text-xs text-muted-foreground">
                Để trống để tự động tạo từ tên danh mục
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t.common.details}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả ngắn về danh mục..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentId">{t.categories.parentCategory}</Label>
              <Select
                value={formData.parentId || "none"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentId: value === "none" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.categories.noParent} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t.categories.noParent}</SelectItem>
                  {categories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormDialogOpen(false)}
              disabled={isSaving}
            >
              {t.common.cancel}
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !formData.name}>
              <Save className="mr-2 size-4" />
              {t.common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteCategoryId}
        onOpenChange={() => setDeleteCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.categories.deleteCategory}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.categories.confirmDelete}
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
    </motion.div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<PageLoader text="Đang tải..." />}>
      <CategoriesContent />
    </Suspense>
  );
}
