"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Layers,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  List,
  User,
  ExternalLink,
  Save,
  Power,
  PowerOff,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { apiClient, type ApiResponse } from "@/lib/api-client";

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
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loader";

// ── Types ───────────────────────────────────────────────────────────
type TenantStatus = "ACTIVE" | "INACTIVE" | "PENDING";

interface TenantView {
  id: string;
  name: string;
  code: string;
  domain?: string;
  description?: string;
  logoUrl?: string;
  status: TenantStatus;
  ownerName?: string;
  ownerEmail?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTenantRequest {
  name: string;
  code: string;
  domain?: string;
  description?: string;
}

// ── Mock Data ───────────────────────────────────────────────────────
const MOCK_TENANTS: TenantView[] = [
  {
    id: "1",
    name: "Khoa Công nghệ Thông tin",
    code: "khoa-cntt",
    domain: "fit.hcmute.edu.vn",
    description: "Website chính thức của Khoa Công nghệ Thông tin",
    status: "ACTIVE",
    ownerName: "Nguyễn Văn An",
    ownerEmail: "annv@hcmute.edu.vn",
    createdAt: "2024-06-15T08:00:00Z",
    updatedAt: "2025-01-10T10:30:00Z",
  },
  {
    id: "2",
    name: "Khoa Cơ khí Chế tạo máy",
    code: "khoa-ckctm",
    domain: "fme.hcmute.edu.vn",
    description: "Website Khoa Cơ khí Chế tạo máy",
    status: "ACTIVE",
    ownerName: "Trần Minh Tuấn",
    ownerEmail: "tuantm@hcmute.edu.vn",
    createdAt: "2024-07-01T09:00:00Z",
    updatedAt: "2025-02-05T14:20:00Z",
  },
  {
    id: "3",
    name: "Khoa Điện - Điện tử",
    code: "khoa-ddt",
    domain: "fee.hcmute.edu.vn",
    description: "Website Khoa Điện - Điện tử",
    status: "ACTIVE",
    ownerName: "Lê Thị Hương",
    ownerEmail: "huonglt@hcmute.edu.vn",
    createdAt: "2024-07-10T10:00:00Z",
    updatedAt: "2025-01-20T16:45:00Z",
  },
  {
    id: "4",
    name: "Khoa Kinh tế",
    code: "khoa-kt",
    domain: "feco.hcmute.edu.vn",
    description: "Website Khoa Kinh tế",
    status: "INACTIVE",
    ownerName: "Phạm Văn Đức",
    ownerEmail: "ducpv@hcmute.edu.vn",
    createdAt: "2024-08-01T08:30:00Z",
    updatedAt: "2024-12-15T11:00:00Z",
  },
  {
    id: "5",
    name: "Khoa Ngoại ngữ",
    code: "khoa-nn",
    domain: "ffl.hcmute.edu.vn",
    description: "Website Khoa Ngoại ngữ",
    status: "PENDING",
    ownerName: "Võ Thị Mai",
    ownerEmail: "maivt@hcmute.edu.vn",
    createdAt: "2025-01-05T07:00:00Z",
    updatedAt: "2025-01-05T07:00:00Z",
  },
  {
    id: "6",
    name: "Viện Sư phạm Kỹ thuật",
    code: "vien-spkt",
    domain: "ite.hcmute.edu.vn",
    description: "Website Viện Sư phạm Kỹ thuật",
    status: "ACTIVE",
    ownerName: "Hoàng Minh Quân",
    ownerEmail: "quanhm@hcmute.edu.vn",
    createdAt: "2024-06-20T09:15:00Z",
    updatedAt: "2025-02-01T13:00:00Z",
  },
  {
    id: "7",
    name: "Khoa Công nghệ May & Thời trang",
    code: "khoa-cnm",
    domain: "",
    description: "Website Khoa Công nghệ May & Thời trang",
    status: "PENDING",
    ownerName: "Đỗ Thị Lan",
    ownerEmail: "landt@hcmute.edu.vn",
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "8",
    name: "Phòng Đào tạo",
    code: "phong-dt",
    domain: "daotao.hcmute.edu.vn",
    description: "Website Phòng Đào tạo",
    status: "ACTIVE",
    ownerName: "Nguyễn Hữu Phước",
    ownerEmail: "phuocnh@hcmute.edu.vn",
    createdAt: "2024-05-10T08:00:00Z",
    updatedAt: "2025-01-15T09:30:00Z",
  },
];

// ── API (with mock fallback) ────────────────────────────────────────
const tenantsApi = {
  getTenants: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<
      ApiResponse<{
        content: TenantView[];
        totalElements: number;
        totalPages: number;
        hasMore: boolean;
      }>
    >("/api/v1/admin/tenants", { params });

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to fetch tenants");
    }
    return response.data.data;
  },

  createTenant: async (data: CreateTenantRequest): Promise<TenantView> => {
    const response = await apiClient.post<ApiResponse<TenantView>>(
      "/api/v1/admin/tenants",
      data,
    );
    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to create tenant");
    }
    return response.data.data;
  },

  updateTenant: async (
    id: string,
    data: Partial<CreateTenantRequest>,
  ): Promise<TenantView> => {
    const response = await apiClient.put<ApiResponse<TenantView>>(
      `/api/v1/admin/tenants/${id}`,
      data,
    );
    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to update tenant");
    }
    return response.data.data;
  },

  updateTenantStatus: async (
    id: string,
    status: TenantStatus,
  ): Promise<TenantView> => {
    const response = await apiClient.patch<ApiResponse<TenantView>>(
      `/api/v1/admin/tenants/${id}/status`,
      { status },
    );
    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to update status");
    }
    return response.data.data;
  },

  deleteTenant: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/tenants/${id}`,
    );
    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to delete tenant");
    }
  },
};

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

// ── Status helpers ──────────────────────────────────────────────────
function getStatusColorClass(status: TenantStatus): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200";
    case "INACTIVE":
      return "bg-gray-100 text-gray-600 border-gray-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "";
  }
}

function getStatusIcon(status: TenantStatus) {
  switch (status) {
    case "ACTIVE":
      return <CheckCircle className="size-3" />;
    case "INACTIVE":
      return <XCircle className="size-3" />;
    case "PENDING":
      return <Clock className="size-3" />;
    default:
      return null;
  }
}

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
function TenantsContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tenants, setTenants] = useState<TenantView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Dialogs
  const [deleteTenantId, setDeleteTenantId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantView | null>(null);
  const [formData, setFormData] = useState<CreateTenantRequest>({
    name: "",
    code: "",
    domain: "",
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const statusFilter = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);

  const fetchTenants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use mock data (replace with API call when backend is ready)
      let filtered = [...MOCK_TENANTS];

      const searchQuery = searchParams.get("search");
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.code.toLowerCase().includes(q) ||
            t.domain?.toLowerCase().includes(q),
        );
      }

      if (statusFilter && statusFilter !== "all") {
        filtered = filtered.filter((t) => t.status === statusFilter);
      }

      setTotalElements(filtered.length);
      setTotalPages(Math.ceil(filtered.length / size));

      const start = page * size;
      const paged = filtered.slice(start, start + size);
      setTenants(paged);
      setHasNextPage(start + size < filtered.length);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi tải danh sách trang con",
      );
      setTenants([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, size, statusFilter, searchParams]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  // ── Form handlers ───────────────────────────────────────────────
  const openCreateDialog = () => {
    setEditingTenant(null);
    setFormData({ name: "", code: "", domain: "", description: "" });
    setFormDialogOpen(true);
  };

  const openEditDialog = (tenant: TenantView) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name,
      code: tenant.code,
      domain: tenant.domain || "",
      description: tenant.description || "",
    });
    setFormDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (editingTenant) {
        await tenantsApi.updateTenant(editingTenant.id, formData);
      } else {
        await tenantsApi.createTenant(formData);
      }
      setFormDialogOpen(false);
      fetchTenants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTenantId) return;
    try {
      setIsDeleting(true);
      await tenantsApi.deleteTenant(deleteTenantId);
      setDeleteTenantId(null);
      fetchTenants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (tenant: TenantView) => {
    try {
      const newStatus: TenantStatus =
        tenant.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await tenantsApi.updateTenantStatus(tenant.id, newStatus);
      fetchTenants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
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

  // ── Stats ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = tenants.filter((t) => t.status === "ACTIVE").length;
    const inactive = tenants.filter((t) => t.status === "INACTIVE").length;
    const pending = tenants.filter((t) => t.status === "PENDING").length;

    return [
      {
        title: t.tenants.totalTenants,
        value: totalElements,
        icon: <Layers className="size-4" />,
        description: t.tenants.description,
        gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
      },
      {
        title: t.tenants.activeTenants,
        value: active,
        icon: <CheckCircle className="size-4" />,
        description: t.tenants.tenantStatus.active,
        gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
      },
      {
        title: t.tenants.inactiveTenants,
        value: inactive,
        icon: <XCircle className="size-4" />,
        description: t.tenants.tenantStatus.inactive,
      },
      {
        title: "Chờ kích hoạt",
        value: pending,
        icon: <Clock className="size-4" />,
        description: t.tenants.tenantStatus.pending,
      },
    ];
  }, [tenants, totalElements, t]);

  // ── Table columns ───────────────────────────────────────────────
  const columns: ColumnDef<TenantView>[] = useMemo(
    () => [
      {
        id: "name",
        header: t.tenants.tenantName,
        accessorKey: "name",
        minWidth: 250,
        enableFiltering: true,
        filterType: "text" as const,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center border">
              {row.logoUrl ? (
                <img
                  src={row.logoUrl}
                  alt={row.name}
                  className="size-6 rounded"
                />
              ) : (
                <Layers className="size-5 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium line-clamp-1">{row.name}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {row.code}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "domain",
        header: t.tenants.domain,
        accessorKey: "domain",
        enableFiltering: false,
        cell: ({ row }) =>
          row.domain ? (
            <a
              href={`https://${row.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <Globe className="size-3.5" />
              {row.domain}
              <ExternalLink className="size-3" />
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        id: "status",
        header: t.tenants.status,
        accessorKey: "status",
        enableFiltering: true,
        filterType: "select" as const,
        filterOptions: [
          { label: t.tenants.tenantStatus.active, value: "ACTIVE" },
          { label: t.tenants.tenantStatus.inactive, value: "INACTIVE" },
          { label: t.tenants.tenantStatus.pending, value: "PENDING" },
        ],
        cell: ({ row }) => (
          <Badge className={getStatusColorClass(row.status)}>
            {getStatusIcon(row.status)}
            <span className="ml-1">
              {
                t.tenants.tenantStatus[
                  row.status.toLowerCase() as keyof typeof t.tenants.tenantStatus
                ]
              }
            </span>
          </Badge>
        ),
      },
      {
        id: "owner",
        header: t.tenants.owner,
        enableFiltering: false,
        enableSorting: false,
        cell: ({ row }) =>
          row.ownerName ? (
            <div className="flex items-center gap-1.5 text-sm">
              <User className="size-3.5 text-muted-foreground" />
              <span>{row.ownerName}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        id: "createdAt",
        header: t.tenants.createdAt,
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
  const renderActions = (row: TenantView) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openEditDialog(row)}>
          <Edit className="mr-2 size-4" />
          {t.tenants.editTenant}
        </DropdownMenuItem>
        {row.domain && (
          <DropdownMenuItem asChild>
            <a
              href={`https://${row.domain}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 size-4" />
              {t.extensionsManagement.visitSite}
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {row.status === "ACTIVE" ? (
          <DropdownMenuItem
            onClick={() => handleToggleStatus(row)}
            className="text-amber-600 focus:text-amber-600"
          >
            <PowerOff className="mr-2 size-4" />
            Vô hiệu hóa
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => handleToggleStatus(row)}
            className="text-green-600 focus:text-green-600"
          >
            <Power className="mr-2 size-4" />
            Kích hoạt
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => setDeleteTenantId(row.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t.tenants.deleteTenant}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ── Status filter bar + create ──────────────────────────────────
  const filterAndCreate = (
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
          {t.common.all}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-3 text-xs ${
            statusFilter === "ACTIVE"
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : ""
          }`}
          onClick={() => handleStatusFilter("ACTIVE")}
        >
          <CheckCircle className="mr-1.5 size-3.5" />
          {t.tenants.tenantStatus.active}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-3 text-xs ${
            statusFilter === "INACTIVE"
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : ""
          }`}
          onClick={() => handleStatusFilter("INACTIVE")}
        >
          <XCircle className="mr-1.5 size-3.5" />
          {t.tenants.tenantStatus.inactive}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-3 text-xs ${
            statusFilter === "PENDING"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : ""
          }`}
          onClick={() => handleStatusFilter("PENDING")}
        >
          <Clock className="mr-1.5 size-3.5" />
          {t.tenants.tenantStatus.pending}
        </Button>
      </div>
      <Button onClick={openCreateDialog}>
        <Plus className="mr-2 size-4" />
        {t.tenants.createTenant}
      </Button>
    </div>
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
              <Layers className="size-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent">
              {t.tenants.title}
            </h1>
          </div>
          <p className="text-muted-foreground">{t.tenants.description}</p>
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
          data={tenants}
          columns={columns}
          isLoading={isLoading}
          error={error}
          totalElements={totalElements}
          totalPages={totalPages}
          pageSize={size}
          currentPage={page}
          hasNextPage={hasNextPage}
          hasPreviousPage={page > 0}
          onRefresh={fetchTenants}
          onCreate={filterAndCreate}
          rowKey="id"
          emptyMessage={t.tenants.noTenantsFound}
          emptyIcon={<Layers className="size-12" />}
          searchPlaceholder={t.tenants.searchPlaceholder}
          actions={renderActions}
          syncWithUrl={true}
        />
      </motion.div>

      {/* Create/Edit Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {editingTenant ? t.tenants.editTenant : t.tenants.createTenant}
            </DialogTitle>
            <DialogDescription>
              {editingTenant
                ? "Chỉnh sửa thông tin trang con"
                : "Tạo trang con mới trong hệ thống multi-tenant"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.tenants.tenantName} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="VD: Khoa Công nghệ thông tin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">{t.tenants.tenantCode} *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value }))
                }
                placeholder="VD: khoa-cntt"
                disabled={!!editingTenant}
              />
              <p className="text-xs text-muted-foreground">
                Mã định danh duy nhất, không thể thay đổi sau khi tạo
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">{t.tenants.domain}</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, domain: e.target.value }))
                }
                placeholder="VD: cntt.hcmute.edu.vn"
              />
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
                placeholder="Mô tả ngắn về trang con..."
                rows={3}
              />
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
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.name || !formData.code}
            >
              <Save className="mr-2 size-4" />
              {t.common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTenantId}
        onOpenChange={() => setDeleteTenantId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.tenants.deleteTenant}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.tenants.confirmDelete}
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

export default function TenantsPage() {
  return (
    <Suspense fallback={<PageLoader text="Đang tải..." />}>
      <TenantsContent />
    </Suspense>
  );
}
