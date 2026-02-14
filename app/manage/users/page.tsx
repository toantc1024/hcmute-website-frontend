"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Users,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  UserCheck,
  UserX,
  UserCog,
  User,
  Mail,
  Calendar,
  Clock,
  List,
  Lock,
  Unlock,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import {
  usersApi,
  type AdminUserView,
  type AccountStatus,
} from "@/lib/api-client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
function getStatusColorClass(status: AccountStatus): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200";
    case "BLOCKED":
      return "bg-red-100 text-red-800 border-red-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "";
  }
}

function getStatusIcon(status: AccountStatus) {
  switch (status) {
    case "ACTIVE":
      return <ShieldCheck className="size-3" />;
    case "BLOCKED":
      return <ShieldX className="size-3" />;
    case "PENDING":
      return <ShieldAlert className="size-3" />;
    default:
      return null;
  }
}

function getStatusLabel(
  status: AccountStatus,
  t: ReturnType<typeof useI18n>["t"],
): string {
  switch (status) {
    case "ACTIVE":
      return t.users.accountStatus.active;
    case "BLOCKED":
      return t.users.accountStatus.blocked;
    case "PENDING":
      return t.users.accountStatus.pending;
    default:
      return status;
  }
}

function getInitials(name?: string): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
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
function UsersContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog state
  const [actionUser, setActionUser] = useState<{
    user: AdminUserView;
    action: "block" | "unblock" | "delete";
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filters from URL
  const statusFilter = searchParams.get("status") || "";
  const searchQuery = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: Record<string, unknown> = {
        page,
        size,
        sort: searchParams.get("sort") || "createdAt,desc",
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await usersApi.getUsers(params);
      setUsers(response.content);
      setHasNextPage(response.hasMore);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi tải danh sách người dùng",
      );
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, page, size, searchParams]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Action handlers ─────────────────────────────────────────────
  const handleAction = async () => {
    if (!actionUser) return;

    try {
      setIsProcessing(true);
      const { user, action } = actionUser;

      if (action === "delete") {
        await usersApi.deleteUser(user.id);
      } else if (action === "block") {
        await usersApi.updateUserStatus(user.id, { status: "BLOCKED" });
      } else if (action === "unblock") {
        await usersApi.updateUserStatus(user.id, { status: "ACTIVE" });
      }

      setActionUser(null);
      fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi thực hiện thao tác",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Date formatter ──────────────────────────────────────────────
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Chưa đăng nhập";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Stats ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = users.filter((u) => u.account.status === "ACTIVE").length;
    const blocked = users.filter((u) => u.account.status === "BLOCKED").length;
    const pending = users.filter((u) => u.account.status === "PENDING").length;

    return [
      {
        title: t.users.totalUsers,
        value: totalElements,
        icon: <Users className="size-4" />,
        description: t.users.description,
        gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
      },
      {
        title: t.users.activeUsers,
        value: active,
        icon: <UserCheck className="size-4" />,
        description: t.users.accountStatus.active,
        gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
      },
      {
        title: t.users.blockedUsers,
        value: blocked,
        icon: <UserX className="size-4" />,
        description: t.users.accountStatus.blocked,
      },
      {
        title: t.users.pendingUsers,
        value: pending,
        icon: <ShieldAlert className="size-4" />,
        description: t.users.accountStatus.pending,
      },
    ];
  }, [users, totalElements, t]);

  // ── Status filter handler ───────────────────────────────────────
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

  // ── Table columns ───────────────────────────────────────────────
  const columns: ColumnDef<AdminUserView>[] = useMemo(
    () => [
      {
        id: "displayName",
        header: t.users.displayName,
        accessorKey: "displayName",
        minWidth: 250,
        enableFiltering: true,
        filterType: "text",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border-2 border-white shadow-sm">
              {row.avatar ? <AvatarImage src={row.avatar} /> : null}
              <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary font-semibold">
                {row.avatar ? (
                  getInitials(row.displayName)
                ) : (
                  <User className="size-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium line-clamp-1">{row.displayName}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {row.account.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "email",
        header: t.users.email,
        accessorFn: (row) => row.account.email,
        enableFiltering: false,
        hidden: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="size-3.5" />
            <span className="line-clamp-1">{row.account.email}</span>
          </div>
        ),
      },
      {
        id: "status",
        header: t.users.status,
        accessorFn: (row) => row.account.status,
        enableFiltering: true,
        filterType: "select",
        filterOptions: [
          { label: t.users.accountStatus.active, value: "ACTIVE" },
          { label: t.users.accountStatus.blocked, value: "BLOCKED" },
          { label: t.users.accountStatus.pending, value: "PENDING" },
        ],
        cell: ({ row }) => (
          <Badge className={getStatusColorClass(row.account.status)}>
            {getStatusIcon(row.account.status)}
            <span className="ml-1">
              {getStatusLabel(row.account.status, t)}
            </span>
          </Badge>
        ),
      },
      {
        id: "groups",
        header: t.users.groups,
        enableFiltering: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.account.groups?.length > 0 ? (
              row.account.groups.slice(0, 2).map((group) => (
                <Badge
                  key={group.id}
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Shield className="size-2.5 mr-1" />
                  {group.groupName}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
            {(row.account.groups?.length || 0) > 2 && (
              <Badge variant="outline" className="text-xs">
                +{row.account.groups.length - 2}
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "provider",
        header: t.users.provider,
        enableFiltering: false,
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs capitalize">
            {row.account.provider}
          </Badge>
        ),
      },
      {
        id: "lastLoginAt",
        header: t.users.lastLogin,
        accessorFn: (row) => row.account.lastLoginAt,
        enableFiltering: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            <span>{formatDateTime(row.account.lastLoginAt)}</span>
          </div>
        ),
      },
      {
        id: "createdAt",
        header: t.users.joinedDate,
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
  const renderActions = (row: AdminUserView) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/manage/users/${row.id}`)}
        >
          <Eye className="mr-2 size-4" />
          {t.users.actions.viewProfile}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/manage/users/${row.id}/edit`)}
        >
          <Edit className="mr-2 size-4" />
          {t.users.actions.editUser}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserCog className="mr-2 size-4" />
          {t.users.actions.manageGroups}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {row.account.status === "ACTIVE" ? (
          <DropdownMenuItem
            onClick={() => setActionUser({ user: row, action: "block" })}
            className="text-amber-600 focus:text-amber-600"
          >
            <Lock className="mr-2 size-4" />
            {t.users.actions.blockUser}
          </DropdownMenuItem>
        ) : row.account.status === "BLOCKED" ? (
          <DropdownMenuItem
            onClick={() => setActionUser({ user: row, action: "unblock" })}
            className="text-green-600 focus:text-green-600"
          >
            <Unlock className="mr-2 size-4" />
            {t.users.actions.unblockUser}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onClick={() => setActionUser({ user: row, action: "delete" })}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t.users.actions.deleteUser}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ── Status filter bar ───────────────────────────────────────────
  const statusFilterBar = (
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
          <UserCheck className="mr-1.5 size-3.5" />
          {t.users.accountStatus.active}
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
          <ShieldAlert className="mr-1.5 size-3.5" />
          {t.users.accountStatus.pending}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-3 text-xs ${
            statusFilter === "BLOCKED"
              ? "bg-red-100 text-red-800 hover:bg-red-200"
              : ""
          }`}
          onClick={() => handleStatusFilter("BLOCKED")}
        >
          <UserX className="mr-1.5 size-3.5" />
          {t.users.accountStatus.blocked}
        </Button>
      </div>
    </div>
  );

  // ── Alert dialog content ────────────────────────────────────────
  const getAlertContent = () => {
    if (!actionUser) return { title: "", description: "" };

    const { action } = actionUser;
    switch (action) {
      case "block":
        return {
          title: t.users.actions.blockUser,
          description: t.users.confirmBlock,
        };
      case "unblock":
        return {
          title: t.users.actions.unblockUser,
          description: t.users.confirmUnblock,
        };
      case "delete":
        return {
          title: t.users.actions.deleteUser,
          description: t.users.confirmDelete,
        };
    }
  };

  const alertContent = getAlertContent();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 relative"
    >
      {/* Background Orb Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-400/15 rounded-full blur-[120px]" />
      </div>

      {/* Page Header */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent rounded-3xl blur-xl" />
        <div className="relative bg-white/50 dark:bg-background/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 p-6 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white">
              <Users className="size-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent">
              {t.users.title}
            </h1>
          </div>
          <p className="text-muted-foreground">{t.users.description}</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Data Table */}
      <motion.div variants={itemVariants}>
        <DataTable
          data={users}
          columns={columns}
          isLoading={isLoading}
          error={error}
          totalElements={totalElements}
          totalPages={totalPages}
          pageSize={size}
          currentPage={page}
          hasNextPage={hasNextPage}
          hasPreviousPage={page > 0}
          onRefresh={fetchUsers}
          onCreate={statusFilterBar}
          onRowClick={(row) => router.push(`/manage/users/${row.id}`)}
          rowKey="id"
          emptyMessage={t.users.noUsersFound}
          emptyIcon={<Users className="size-12" />}
          searchPlaceholder={t.users.searchPlaceholder}
          actions={renderActions}
          syncWithUrl={true}
        />
      </motion.div>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={!!actionUser} onOpenChange={() => setActionUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {actionUser && (
            <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/50">
              <Avatar className="size-10">
                {actionUser.user.avatar ? (
                  <AvatarImage src={actionUser.user.avatar} />
                ) : null}
                <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary font-semibold">
                  {actionUser.user.avatar ? (
                    getInitials(actionUser.user.displayName)
                  ) : (
                    <User className="size-5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{actionUser.user.displayName}</p>
                <p className="text-sm text-muted-foreground">
                  {actionUser.user.account.email}
                </p>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              {t.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={isProcessing}
              className={
                actionUser?.action === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : actionUser?.action === "block"
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-green-600 text-white hover:bg-green-700"
              }
            >
              {actionUser?.action === "delete" && (
                <Trash2 className="mr-2 size-4" />
              )}
              {actionUser?.action === "block" && (
                <Lock className="mr-2 size-4" />
              )}
              {actionUser?.action === "unblock" && (
                <Unlock className="mr-2 size-4" />
              )}
              {t.common.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<PageLoader text="Đang tải..." />}>
      <UsersContent />
    </Suspense>
  );
}
