"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  Shield,
  Globe,
  Key,
  UserCog,
  Lock,
  Unlock,
  Trash2,
  Users,
  User,
  Edit,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { usersApi, type AdminUserView } from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
import { Loader } from "@/components/ui/loader";

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

// ── Helpers ─────────────────────────────────────────────────────────
function getStatusColorClass(status: string): string {
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

function getInitials(name?: string): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateString?: string) {
  if (!dateString) return "Chưa đăng nhập";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Info Row Component ──────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<AdminUserView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionType, setActionType] = useState<
    "block" | "unblock" | "delete" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await usersApi.getUserById(userId);
      setUser(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải thông tin người dùng",
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleAction = async () => {
    if (!user || !actionType) return;

    try {
      setIsProcessing(true);
      if (actionType === "delete") {
        await usersApi.deleteUser(user.id);
        router.push("/manage/users");
        return;
      } else if (actionType === "block") {
        await usersApi.updateUserStatus(user.id, { status: "BLOCKED" });
      } else if (actionType === "unblock") {
        await usersApi.updateUserStatus(user.id, { status: "ACTIVE" });
      }
      setActionType(null);
      fetchUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Đang tải thông tin người dùng..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">
          {error || "Không tìm thấy người dùng"}
        </p>
        <Button variant="outline" onClick={() => router.push("/manage/users")}>
          <ArrowLeft className="mr-2 size-4" />
          {t.common.back}
        </Button>
      </div>
    );
  }

  const getAlertContent = () => {
    switch (actionType) {
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
      default:
        return { title: "", description: "" };
    }
  };

  const alertContent = getAlertContent();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 relative max-w-4xl mx-auto"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-400/15 rounded-full blur-[120px]" />
      </div>

      {/* Back button */}
      <motion.div variants={itemVariants}>
        <Button
          variant="ghost"
          onClick={() => router.push("/manage/users")}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          {t.users.allUsers}
        </Button>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border-0 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-indigo-700" />
          <div className="absolute inset-0 bg-[url('/background/grid.svg')] opacity-10" />
          <CardContent className="relative py-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="size-24 border-4 border-white/30 shadow-2xl">
                {user.avatar ? <AvatarImage src={user.avatar} /> : null}
                <AvatarFallback className="text-2xl bg-white/20 text-white font-bold">
                  {user.avatar ? (
                    getInitials(user.displayName)
                  ) : (
                    <User className="size-10" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">
                  {user.displayName}
                </h1>
                <p className="text-white/70 mt-1">{user.account.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge className={getStatusColorClass(user.account.status)}>
                    {
                      t.users.accountStatus[
                        user.account.status.toLowerCase() as keyof typeof t.users.accountStatus
                      ]
                    }
                  </Badge>
                  {user.account.groups?.map((group) => (
                    <Badge
                      key={group.id}
                      variant="outline"
                      className="bg-white/10 text-white border-white/20 text-xs"
                    >
                      <Shield className="size-3 mr-1" />
                      {group.groupName}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="sm:ml-auto flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push(`/manage/users/${user.id}/edit`)}
                  className="bg-white/20 text-white border-white/20 hover:bg-white/30"
                >
                  <Edit className="size-4 mr-1.5" />
                  {t.users.actions.editUser}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Information */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-gradient-to-br from-white to-blue-50/30 dark:from-background dark:to-blue-950/10 border-blue-100/50 dark:border-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-white">
                  <Key className="size-4" />
                </div>
                Thông tin tài khoản
              </CardTitle>
              <CardDescription>Chi tiết tài khoản và xác thực</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0 divide-y">
              <InfoRow
                icon={<Mail className="size-4" />}
                label={t.users.email}
                value={user.account.email}
              />
              <InfoRow
                icon={<Globe className="size-4" />}
                label={t.users.provider}
                value={
                  <Badge variant="outline" className="capitalize">
                    {user.account.provider}
                  </Badge>
                }
              />
              <InfoRow
                icon={<Key className="size-4" />}
                label="Provider ID"
                value={
                  <span className="text-sm font-mono text-muted-foreground">
                    {user.account.providerId}
                  </span>
                }
              />
              <InfoRow
                icon={<Clock className="size-4" />}
                label={t.users.lastLogin}
                value={formatDateTime(user.account.lastLoginAt)}
              />
              <InfoRow
                icon={<Calendar className="size-4" />}
                label={t.users.joinedDate}
                value={formatDate(user.account.createdAt)}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Groups & Roles */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-gradient-to-br from-white to-blue-50/30 dark:from-background dark:to-blue-950/10 border-blue-100/50 dark:border-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-white">
                  <Users className="size-4" />
                </div>
                Nhóm & Vai trò
              </CardTitle>
              <CardDescription>Các nhóm và quyền hạn được gán</CardDescription>
            </CardHeader>
            <CardContent>
              {user.account.groups?.length > 0 ? (
                <div className="space-y-3">
                  {user.account.groups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center gap-3 p-3 rounded-xl border bg-white/50 dark:bg-background/50"
                    >
                      <div className="size-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
                        <Shield className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{group.groupName}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {group.code}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserCog className="size-12 mx-auto mb-3 opacity-50" />
                  <p>Chưa được gán vào nhóm nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bio Section */}
      {user.bio && (
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-background dark:to-blue-950/10 border-blue-100/50 dark:border-blue-900/20">
            <CardHeader>
              <CardTitle className="text-lg">Giới thiệu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {user.bio}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Danger Zone */}
      <motion.div variants={itemVariants}>
        <Card className="border-red-200/50 dark:border-red-900/30">
          <CardHeader>
            <CardTitle className="text-lg text-destructive flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
              Hành động
            </CardTitle>
            <CardDescription>
              Các thao tác quản lý tài khoản người dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {user.account.status === "ACTIVE" ? (
                <Button
                  variant="outline"
                  onClick={() => setActionType("block")}
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  <Lock className="mr-2 size-4" />
                  {t.users.actions.blockUser}
                </Button>
              ) : user.account.status === "BLOCKED" ? (
                <Button
                  variant="outline"
                  onClick={() => setActionType("unblock")}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Unlock className="mr-2 size-4" />
                  {t.users.actions.unblockUser}
                </Button>
              ) : null}
              <Button
                variant="outline"
                onClick={() => setActionType("delete")}
                className="border-red-200 text-destructive hover:bg-red-50"
              >
                <Trash2 className="mr-2 size-4" />
                {t.users.actions.deleteUser}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Dialog */}
      <AlertDialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/50">
            <Avatar className="size-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary font-semibold">
                {getInitials(user.displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">
                {user.account.email}
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              {t.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={isProcessing}
              className={
                actionType === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : actionType === "block"
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-green-600 text-white hover:bg-green-700"
              }
            >
              {actionType === "delete" && <Trash2 className="mr-2 size-4" />}
              {actionType === "block" && <Lock className="mr-2 size-4" />}
              {actionType === "unblock" && <Unlock className="mr-2 size-4" />}
              {t.common.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
