"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  Save,
  AlertTriangle,
  Check,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { useUserProfile, type UserRole, ROLE_HIERARCHY } from "@/features/user";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader, ButtonLoader } from "@/components/ui/loader";

export default function ProfilePage() {
  const { t } = useI18n();
  const { profile, roles, isLoading: isProfileLoading } = useUserProfile();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [bio, setBio] = useState(profile?.bio || "");

  const getUserInitials = () => {
    if (profile?.displayName) {
      return profile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  const getRoleLabel = (role: string) => {
    const roleKey = role.toLowerCase() as keyof typeof t.roles;
    return t.roles[roleKey] || role;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.profile.updateError);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isProfileLoading) {
    return <Loader size="lg" text="Đang tải hồ sơ..." className="min-h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.profile.title}</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertTriangle className="size-5 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <Check className="size-5 text-green-500" />
          <p className="text-green-500">{t.profile.updateSuccess}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t.profile.personalInfo}</CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="size-24">
                  <AvatarImage
                    src={profile?.avatar}
                    alt={profile?.displayName || "User"}
                  />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {profile?.displayName}
                  </h3>
                  <p className="text-muted-foreground">{profile?.account?.email}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    {t.profile.changeAvatar}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.profile.firstName}</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nhập tên..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.profile.lastName}</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nhập họ..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.profile.email}</label>
                <Input value={profile?.account?.email || ""} disabled />
                <p className="text-xs text-muted-foreground">
                  Email được quản lý bởi tài khoản Google của bạn
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.profile.bio}</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Viết một vài dòng giới thiệu về bạn..."
                  className="w-full min-h-[100px] p-3 rounded-md border bg-background resize-y"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <ButtonLoader />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}
                  <span className="ml-2">{t.common.save}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                {t.profile.role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {getRoleLabel(role)}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">{t.roles.user}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                Thông tin tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tên hiển thị</p>
                  <p className="font-medium">{profile?.displayName || "N/A"}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Đăng nhập gần nhất</p>
                  <p className="font-medium">{formatDate(profile?.account?.lastLoginAt)}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tham gia</p>
                  <p className="font-medium">{formatDate(profile?.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.profile.security}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Mật khẩu và bảo mật tài khoản được quản lý thông qua tài khoản Google
                của bạn.
              </p>
              <Button variant="outline" className="w-full" disabled>
                {t.profile.changePassword}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
