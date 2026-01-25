"use client";

import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
}

export function LoginButton({ variant = "default" }: LoginButtonProps) {
  const { user, isLoading, initiateLogin, logout, isInitialized } = useAuth();
  const router = useRouter();
  const handleLogin = async () => {
    await initiateLogin();
  };

  const handleShowProfile = () => {
    router.push("/manage");
  };

  if (!isInitialized) {
    return (
      <Button variant={variant} disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} className="gap-2">
            <span className="max-w-[150px] truncate">
              {user.name || user.preferred_username || user.email || "User"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.name || user.preferred_username}</p>
            {user.email && (
              <p className="text-xs text-muted-foreground">{user.email}</p>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleShowProfile}>
        Bảng điều khiển
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={handleLogin}
      disabled={isLoading}
      icon={ArrowRight}
      iconPlacement="right"
      effect={isLoading ? undefined : "expandIcon"}
    >
      {isLoading ? "Đang xử lý..." : "Đăng nhập"}
    </Button>
  );
}
