import { Search, Phone, Mail, LogIn, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LogoConfig = {
  href: string;
  image: string;
  mobileImage: string;
  alt: string;
  width: number;
  height: number;
  mobileWidth: number;
  mobileHeight: number;
};

export type LanguageOption = {
  id: string;
  label: string;
  shortLabel: string;
  flagCode: string;
  href?: string;
};

export type TopBarLink = {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  isExternal?: boolean;
};

export type ActionButton = {
  id: string;
  label: string;
  href: string;
  variant: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
  icon?: LucideIcon;
  showOnMobile?: boolean;
};

export type NavbarConfig = {
  logo: LogoConfig;
  topBar: {
    enabled: boolean;
    links: TopBarLink[];
    languages: LanguageOption[];
    defaultLanguage: string;
  };
  search: {
    enabled: boolean;
    placeholder: string;
    icon: LucideIcon;
  };
  actions: ActionButton[];
};

export const navbarConfig: NavbarConfig = {
  logo: {
    href: "/",
    image: "/logo/rectangle-logo.png",
    mobileImage: "/logo/rectangle-logo.png",
    alt: "HCMUTE Logo",
    width: 180,
    height: 48,
    mobileWidth: 140,
    mobileHeight: 36,
  },
  topBar: {
    enabled: true,
    links: [
      {
        id: "contact",
        label: "Liên hệ",
        href: "/lien-he",
        icon: Phone,
      },
      {
        id: "email",
        label: "ptchc@hcmute.edu.vn",
        href: "mailto:ptchc@hcmute.edu.vn",
        icon: Mail,
        isExternal: true,
      },
    ],
    languages: [
      {
        id: "vi",
        label: "Tiếng Việt",
        shortLabel: "VI",
        flagCode: "vn",
      },
      {
        id: "en",
        label: "English",
        shortLabel: "EN",
        flagCode: "gb",
      },
    ],
    defaultLanguage: "vi",
  },
  search: {
    enabled: true,
    placeholder: "Tìm kiếm...",
    icon: Search,
  },
  actions: [
    {
      id: "login",
      label: "Đăng nhập",
      href: "/login",
      variant: "default",
      icon: ArrowRight,
      showOnMobile: true,
    },
  ],
};
