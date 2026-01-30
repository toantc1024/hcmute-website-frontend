"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SearchDialog, useSearchDialog } from "./search-dialog";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

// Breadcrumb labels in Vietnamese
const breadcrumbLabels: Record<string, string> = {
  manage: "Tổng quan",
  posts: "Bài viết",
  media: "Đa phương tiện",
  extensions: "Tiện ích mở rộng",
  profile: "Hồ sơ",
  create: "Tạo mới",
  edit: "Chỉnh sửa",
  settings: "Cài đặt",
  users: "Người dùng",
  groups: "Nhóm",
};

function getBreadcrumbs(pathname: string): BreadcrumbItemData[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItemData[] = [];

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    const label =
      breadcrumbLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      label,
      href: index < segments.length - 1 ? href : undefined,
    });
  });

  return breadcrumbs;
}

export function UserHeader() {
  const pathname = usePathname();
  const { open, setOpen } = useSearchDialog();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4"
      >
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb className="flex-1">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={item.label + index} className="flex items-center gap-2">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-8 gap-2 px-3 text-muted-foreground hover:text-foreground"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline-block">Tìm kiếm</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </motion.header>

      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
