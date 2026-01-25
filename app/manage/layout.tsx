"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth";
import { UserProfileProvider } from "@/features/user";
import { I18nProvider } from "@/lib/i18n";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { UserSidebar, UserHeader } from "@/components/user-layout";
import { Loader } from "@/components/ui/loader";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, accessToken, isInitialized } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isInitialized) return;

    if (!accessToken || !user) {
      router.push("/");
      return;
    }

    setIsChecking(false);
  }, [accessToken, user, isInitialized, router]);

  if (!isInitialized || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader size="lg" text="Đang kiểm tra xác thực..." />
      </div>
    );
  }

  if (!accessToken || !user) {
    return null;
  }

  return (
    <I18nProvider>
      <UserProfileProvider>
        <SidebarProvider>
          <UserSidebar />
          <SidebarInset>
            <UserHeader />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </UserProfileProvider>
    </I18nProvider>
  );
}
