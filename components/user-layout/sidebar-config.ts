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
  titleKey: string;
  href: string;
  icon: LucideIcon;
  requiredRoles?: UserRole[];
}

export interface SidebarMenuGroup {
  id: string;
  titleKey: string;
  icon: LucideIcon;
  items: SidebarMenuItem[];
  defaultOpen?: boolean;
  requiredRoles?: UserRole[];
}

export const quickNavItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    titleKey: "navigation.dashboard",
    href: "/manage",
    icon: LayoutDashboard,
  },
  {
    id: "traffic",
    titleKey: "navigation.traffic",
    href: "/manage/luot-truy-cap",
    icon: BarChart2,
    requiredRoles: ['UNIT_ADMIN', 'SCHOOL_ADMIN', 'SYSTEM_ADMIN'],
  },
  {
    id: "utilities",
    titleKey: "navigation.utilities",
    href: "/manage/tien-ich",
    icon: Sparkles,
    requiredRoles: ['UNIT_ADMIN', 'SCHOOL_ADMIN', 'SYSTEM_ADMIN'],
  },
];

export const sidebarMenuGroups: SidebarMenuGroup[] = [
  {
    id: "management",
    titleKey: "sidebar.management",
    icon: FileText,
    defaultOpen: true,
    requiredRoles: ['CONTRIBUTOR', 'EDITOR', 'LEADER', 'UNIT_ADMIN', 'SCHOOL_ADMIN', 'SYSTEM_ADMIN'],
    items: [
      {
        id: "posts",
        titleKey: "navigation.posts",
        href: "/manage/posts",
        icon: FileText,
        requiredRoles: ['CONTRIBUTOR', 'EDITOR', 'LEADER', 'UNIT_ADMIN', 'SCHOOL_ADMIN', 'SYSTEM_ADMIN'],
      },
      {
        id: "users",
        titleKey: "navigation.users",
        href: "/manage/users",
        icon: Users,
        requiredRoles: ['UNIT_ADMIN', 'SCHOOL_ADMIN', 'SYSTEM_ADMIN'],
      },
    ],
  },
  {
    id: "adminTools",
    titleKey: "sidebar.adminTools",
    icon: Settings,
    defaultOpen: false,
    requiredRoles: ['UNIT_ADMIN', 'SCHOOL_ADMIN', 'SYSTEM_ADMIN'],
    items: [
      {
        id: "news",
        titleKey: "navigation.news",
        href: "/manage/tin-tuc",
        icon: Newspaper,
        requiredRoles: ['UNIT_ADMIN', 'SCHOOL_ADMIN', 'SYSTEM_ADMIN'],
      },
      {
        id: "homepageContent",
        titleKey: "navigation.homepageContent",
        href: "/manage/noi-dung-trang-chu",
        icon: LayoutTemplate,
        requiredRoles: ['UNIT_ADMIN', 'SCHOOL_ADMIN', 'SYSTEM_ADMIN'],
      },
      {
        id: "websiteManagement",
        titleKey: "navigation.websiteManagement",
        href: "/manage/quan-ly-website",
        icon: Globe,
        requiredRoles: ['UNIT_ADMIN', 'SCHOOL_ADMIN', 'SYSTEM_ADMIN'],
      },
    ],
  },
];

export const profileNavItem: SidebarMenuItem = {
  id: "profile",
  titleKey: "profile.title",
  href: "/manage/profile",
  icon: User,
};

export const sidebarFooterItems = {
  backToHome: {
    id: "home",
    titleKey: "navigation.home",
    href: "/",
    icon: Home,
  },
  logout: {
    id: "logout",
    titleKey: "auth.logout",
    icon: LogOut,
  },
};

export function getFilteredMenuGroups(
  userRoles: UserRole[]
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
