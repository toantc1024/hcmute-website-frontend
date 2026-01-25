import {
  LayoutDashboard,
  FileText,
  Users,
  User,
  Home,
  LogOut,
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
