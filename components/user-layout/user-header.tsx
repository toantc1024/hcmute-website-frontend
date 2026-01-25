"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Check } from "lucide-react";

import { useI18n } from "@/lib/i18n";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

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

function getBreadcrumbs(
  pathname: string,
  t: Record<string, unknown>
): BreadcrumbItemData[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItemData[] = [];

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    let label = segment;
    switch (segment) {
      case "manage":
        label = getNestedTranslation(t, "navigation.dashboard");
        break;
      case "posts":
        label = getNestedTranslation(t, "navigation.posts");
        break;
      case "media":
        label = getNestedTranslation(t, "navigation.media");
        break;
      case "extensions":
        label = getNestedTranslation(t, "navigation.extensions");
        break;
      case "profile":
        label = getNestedTranslation(t, "navigation.profile");
        break;
      case "create":
        label = getNestedTranslation(t, "common.create");
        break;
      case "edit":
        label = getNestedTranslation(t, "common.edit");
        break;
      default:
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    breadcrumbs.push({
      label,
      href: index < segments.length - 1 ? href : undefined,
    });
  });

  return breadcrumbs;
}

export function UserHeader() {
  const pathname = usePathname();
  const { t, locale, setLocale, availableLocales, localeName } = useI18n();
  const breadcrumbs = getBreadcrumbs(pathname, t as unknown as Record<string, unknown>);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4"
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2 px-2">
            <Globe className="size-4" />
            <span className="hidden sm:inline-block">{localeName(locale)}</span>
            <span className="inline-block sm:hidden">{locale.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {availableLocales.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => setLocale(loc)}
              className="cursor-pointer justify-between"
            >
              <span>{localeName(loc)}</span>
              {locale === loc && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.header>
  );
}
