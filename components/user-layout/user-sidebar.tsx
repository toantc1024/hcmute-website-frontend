"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Home, LogOut, ChevronRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/features/auth";
import { useUserProfile } from "@/features/user";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  getFilteredMenuGroups,
  quickNavItems,
  profileNavItem,
  type SidebarMenuGroup,
} from "./sidebar-config";

function getNestedTranslation(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof result === "string" ? result : path;
}

function getRoleLabel(role: string, t: Record<string, unknown>): string {
  const roleKey = role.toLowerCase();
  const roles = t.roles as Record<string, string> | undefined;
  return roles?.[roleKey] || role;
}

export function UserSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { logout } = useAuth();
  const { profile, roles, highestRole, isLoading } = useUserProfile();
  const { state } = useSidebar();

  const menuGroups = getFilteredMenuGroups(roles);

  const isActive = (href: string) => {
    if (href === "/manage") {
      return pathname === "/manage";
    }
    if (href.includes("?")) {
      return pathname === href.split("?")[0];
    }
    return pathname.startsWith(href);
  };

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

  const displayName = profile?.displayName || "Người dùng";
  const email = profile?.account?.email || "";
  const avatar = profile?.avatar;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <Link href="/manage">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <Image
                    src="/logo/square-logo.png"
                    alt="HCM-UTE"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">HCM-UTE</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {getNestedTranslation(
                      t as unknown as Record<string, unknown>,
                      "dashboard.title"
                    )}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {quickNavItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={getNestedTranslation(
                        t as unknown as Record<string, unknown>,
                        item.titleKey
                      )}
                    >
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>
                          {getNestedTranslation(
                            t as unknown as Record<string, unknown>,
                            item.titleKey
                          )}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {menuGroups.map((group) => (
          <NavGroup
            key={group.id}
            group={group}
            pathname={pathname}
            t={t}
            isActive={isActive}
          />
        ))}

        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(profileNavItem.href)}
                  tooltip={getNestedTranslation(
                    t as unknown as Record<string, unknown>,
                    profileNavItem.titleKey
                  )}
                >
                  <Link href={profileNavItem.href}>
                    <profileNavItem.icon className="size-4" />
                    <span>
                      {getNestedTranslation(
                        t as unknown as Record<string, unknown>,
                        profileNavItem.titleKey
                      )}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={getNestedTranslation(
                t as unknown as Record<string, unknown>,
                "navigation.home"
              )}
            >
              <Link href="/">
                <Home className="size-4" />
                <span>
                  {getNestedTranslation(
                    t as unknown as Record<string, unknown>,
                    "navigation.home"
                  )}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={avatar} alt={displayName} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{displayName}</span>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1 py-0 h-4"
                      >
                        {getRoleLabel(
                          highestRole,
                          t as unknown as Record<string, unknown>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={state === "collapsed" ? "right" : "top"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  {getNestedTranslation(
                    t as unknown as Record<string, unknown>,
                    "auth.logout"
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

interface NavGroupProps {
  group: SidebarMenuGroup;
  pathname: string;
  t: unknown;
  isActive: (href: string) => boolean;
}

function NavGroup({ group, pathname, t, isActive }: NavGroupProps) {
  const Icon = group.icon;
  const hasActiveChild = group.items.some((item) => isActive(item.href));

  return (
    <SidebarGroup className="py-2">
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={group.defaultOpen || hasActiveChild}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={getNestedTranslation(
                  t as Record<string, unknown>,
                  group.titleKey
                )}
              >
                <Icon className="size-4" />
                <span>
                  {getNestedTranslation(
                    t as Record<string, unknown>,
                    group.titleKey
                  )}
                </span>
                <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const ItemIcon = item.icon;

                  return (
                    <SidebarMenuSubItem key={item.id}>
                      <SidebarMenuSubButton asChild isActive={active}>
                        <Link href={item.href}>
                          <ItemIcon className="size-4" />
                          <span>
                            {getNestedTranslation(
                              t as Record<string, unknown>,
                              item.titleKey
                            )}
                          </span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
