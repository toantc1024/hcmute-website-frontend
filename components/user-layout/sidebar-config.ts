import {
  LayoutDashboard,
  FileText,
  Users,
  User,
  Home,
  LogOut,
  BarChart2,
  Sparkles,
  Settings,
  Newspaper,
  LayoutTemplate,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/features/user";

export interface SidebarMenuItem {
  id: string;
  title: string;
  titleKey?: string; // Keep for backward compatibility
  href: string;
  icon: LucideIcon;
  requiredRoles?: UserRole[];
}

export interface SidebarMenuGroup {
  id: string;
  title: string;
  titleKey?: string; // Keep for backward compatibility
  icon: LucideIcon;
  items: SidebarMenuItem[];
  defaultOpen?: boolean;
  requiredRoles?: UserRole[];
}

export const quickNavItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    title: "Tổng quan",
    titleKey: "navigation.dashboard",
    href: "/manage",
    icon: LayoutDashboard,
  },
  {
    id: "traffic",
    title: "Lượt truy cập",
    titleKey: "navigation.traffic",
    href: "/manage/luot-truy-cap",
    icon: BarChart2,
  },
  {
    id: "utilities",
    title: "Tiện ích",
    titleKey: "navigation.utilities",
    href: "/manage/tien-ich",
    icon: Sparkles,
  },
];

export const sidebarMenuGroups: SidebarMenuGroup[] = [
  {
    id: "management",
    title: "Quản lý nội dung",
    titleKey: "sidebar.management",
    icon: FileText,
    defaultOpen: true,
    items: [
      {
        id: "posts",
        title: "Bài viết",
        titleKey: "navigation.posts",
        href: "/manage/posts",
        icon: FileText,
      },
      {
        id: "users",
        title: "Người dùng",
        titleKey: "navigation.users",
        href: "/manage/users",
        icon: Users,
      },
    ],
  },
  {
    id: "adminTools",
    title: "Công cụ quản trị",
    titleKey: "sidebar.adminTools",
    icon: Settings,
    defaultOpen: false,
    items: [
      {
        id: "homepageContent",
        title: "Nội dung trang chủ",
        titleKey: "navigation.homepageContent",
        href: "/manage/noi-dung-trang-chu",
        icon: LayoutTemplate,
      },
      {
        id: "websiteManagement",
        title: "Quản lý website",
        titleKey: "navigation.websiteManagement",
        href: "/manage/quan-ly-website",
        icon: Globe,
      },
    ],
  },
];

export const profileNavItem: SidebarMenuItem = {
  id: "profile",
  title: "Hồ sơ cá nhân",
  titleKey: "profile.title",
  href: "/manage/profile",
  icon: User,
};

export const sidebarFooterItems = {
  backToHome: {
    id: "home",
    title: "Trang chủ",
    titleKey: "navigation.home",
    href: "/",
    icon: Home,
  },
  logout: {
    id: "logout",
    title: "Đăng xuất",
    titleKey: "auth.logout",
    icon: LogOut,
  },
};

export function getFilteredMenuGroups(
  userRoles: UserRole[],
): SidebarMenuGroup[] {
  const hasRequiredRole = (requiredRoles?: UserRole[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some((role) => userRoles.includes(role));
  };

  return sidebarMenuGroups
    .filter((group) => hasRequiredRole(group.requiredRoles))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasRequiredRole(item.requiredRoles)),
    }))
    .filter((group) => group.items.length > 0);
}
