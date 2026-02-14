"use client";

import { useState, useMemo, Suspense } from "react";
import { motion } from "motion/react";
import {
  Link2,
  Mail,
  BookOpen,
  FileText,
  ImagePlus,
  Frame,
  CreditCard,
  GraduationCap,
  Briefcase,
  Bot,
  Video,
  UserCircle,
  Link as LinkIcon,
  ExternalLink,
  Search,
  Blocks,
  CheckCircle,
  Grid3X3,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import type { ElementType } from "react";

import { useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loader";

// ── Animation variants ──────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

// ── Extension data ──────────────────────────────────────────────────
type ExtensionCategory = "ecosystem" | "ai_tools" | "extensions";

interface ExtensionItem {
  name: string;
  subtitle: string;
  description: string;
  url: string;
  icon: ElementType;
  category: ExtensionCategory;
  iconColor: string;
  bgColor: string;
  gradient: string;
  active: boolean;
}

const allExtensions: ExtensionItem[] = [
  // ── Hệ sinh thái ──
  {
    name: "E-Learning (LMS)",
    subtitle: "lms.hcmute.edu.vn",
    description: "Hệ thống quản lý học tập trực tuyến",
    url: "https://lms.hcmute.edu.vn",
    icon: GraduationCap,
    category: "ecosystem",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    gradient: "from-blue-500 to-indigo-600",
    active: true,
  },
  {
    name: "E-Office",
    subtitle: "eoffice.hcmute.edu.vn",
    description: "Hệ thống quản lý văn phòng điện tử",
    url: "https://eoffice.hcmute.edu.vn",
    icon: Briefcase,
    category: "ecosystem",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-100",
    gradient: "from-emerald-500 to-teal-600",
    active: true,
  },
  // ── AI & Tools ──
  {
    name: "AI Assistant",
    subtitle: "ai.hcmute.edu.vn",
    description: "Trợ lý AI thông minh hỗ trợ học tập và nghiên cứu",
    url: "https://ai.hcmute.edu.vn",
    icon: Bot,
    category: "ai_tools",
    iconColor: "text-violet-600",
    bgColor: "bg-violet-100",
    gradient: "from-violet-500 to-purple-600",
    active: true,
  },
  {
    name: "LiveHub",
    subtitle: "live.hcmute.edu.vn",
    description: "Nền tảng livestream và video trực tuyến",
    url: "https://live.hcmute.edu.vn",
    icon: Video,
    category: "ai_tools",
    iconColor: "text-red-600",
    bgColor: "bg-red-100",
    gradient: "from-red-500 to-rose-600",
    active: true,
  },
  {
    name: "UTE Email",
    subtitle: "mail.hcmute.edu.vn",
    description: "Hệ thống email nội bộ trường",
    url: "https://mail.hcmute.edu.vn",
    icon: Mail,
    category: "ai_tools",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100",
    gradient: "from-orange-500 to-amber-600",
    active: true,
  },
  {
    name: "UTE Avatar",
    subtitle: "avatar.hcmute.edu.vn",
    description: "Tạo avatar và ảnh đại diện cá nhân",
    url: "https://avatar.hcmute.edu.vn",
    icon: UserCircle,
    category: "ai_tools",
    iconColor: "text-pink-600",
    bgColor: "bg-pink-100",
    gradient: "from-pink-500 to-rose-600",
    active: true,
  },
  // ── UTE Extensions ──
  {
    name: "Short Link",
    subtitle: "link.hcmute.edu.vn",
    description: "Rút gọn liên kết & tạo mã QR nhanh chóng",
    url: "https://link.hcmute.edu.vn",
    icon: Link2,
    category: "extensions",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-100",
    gradient: "from-emerald-500 to-teal-600",
    active: true,
  },
  {
    name: "Email Marketing",
    subtitle: "email.hcmute.edu.vn",
    description: "Gửi email marketing hàng loạt chuyên nghiệp",
    url: "https://email.hcmute.edu.vn",
    icon: Mail,
    category: "extensions",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    gradient: "from-blue-500 to-indigo-600",
    active: true,
  },
  {
    name: "Flipbook",
    subtitle: "flipbook.hcmute.edu.vn",
    description: "Chuyển đổi PDF sang tài liệu lật trang tương tác",
    url: "https://flipbook.hcmute.edu.vn",
    icon: BookOpen,
    category: "extensions",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100",
    gradient: "from-amber-500 to-orange-600",
    active: true,
  },
  {
    name: "UTE Form",
    subtitle: "form.hcmute.edu.vn",
    description: "Tạo biểu mẫu khảo sát và thu thập dữ liệu",
    url: "https://form.hcmute.edu.vn",
    icon: FileText,
    category: "extensions",
    iconColor: "text-violet-600",
    bgColor: "bg-violet-100",
    gradient: "from-violet-500 to-purple-600",
    active: true,
  },
  {
    name: "Enhance",
    subtitle: "enhance.hcmute.edu.vn",
    description: "Nâng cấp chất lượng ảnh bằng AI",
    url: "https://enhance.hcmute.edu.vn",
    icon: ImagePlus,
    category: "extensions",
    iconColor: "text-rose-600",
    bgColor: "bg-rose-100",
    gradient: "from-rose-500 to-pink-600",
    active: true,
  },
  {
    name: "Frame",
    subtitle: "frame.hcmute.edu.vn",
    description: "Tạo khung avatar và hình ảnh sự kiện",
    url: "https://frame.hcmute.edu.vn",
    icon: Frame,
    category: "extensions",
    iconColor: "text-cyan-600",
    bgColor: "bg-cyan-100",
    gradient: "from-cyan-500 to-sky-600",
    active: true,
  },
  {
    name: "eID",
    subtitle: "eid.hcmute.edu.vn",
    description: "Danh thiếp số và thẻ nhận dạng điện tử",
    url: "https://eid.hcmute.edu.vn",
    icon: CreditCard,
    category: "extensions",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100",
    gradient: "from-orange-500 to-red-600",
    active: true,
  },
];

// ── Extension Card ──────────────────────────────────────────────────
function ExtensionCard({ ext }: { ext: ExtensionItem }) {
  const Icon = ext.icon;

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
    >
      <a
        href={ext.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30 group cursor-pointer bg-white/60 dark:bg-background/60 backdrop-blur-sm border-muted/50">
          <CardContent className="p-5">
            {/* Top row: icon + status */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`size-12 rounded-2xl bg-gradient-to-br ${ext.gradient} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
              >
                <Icon className="size-6 text-white" strokeWidth={1.5} />
              </div>
              <Badge
                variant="outline"
                className={
                  ext.active
                    ? "bg-green-50 text-green-700 border-green-200 text-xs"
                    : "bg-gray-50 text-gray-500 border-gray-200 text-xs"
                }
              >
                <CheckCircle className="size-3 mr-1" />
                {ext.active ? "Hoạt động" : "Tắt"}
              </Badge>
            </div>

            {/* Name + subtitle */}
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
              {ext.name}
            </h3>
            <p className="text-xs font-mono text-muted-foreground mt-0.5 mb-2">
              {ext.subtitle}
            </p>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {ext.description}
            </p>

            {/* Visit link */}
            <div className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Truy cập</span>
              <ArrowUpRight className="size-3" />
            </div>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient?: string;
  description?: string;
}

function StatCard({ title, value, icon, gradient, description }: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card
        className={`h-full relative overflow-hidden ${gradient ? "text-white border-0" : ""}`}
      >
        {gradient && <div className={`absolute inset-0 ${gradient}`} />}
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className={`text-sm font-medium ${gradient ? "text-white/90" : ""}`}
          >
            {title}
          </CardTitle>
          <div className={gradient ? "text-white/80" : "text-muted-foreground"}>
            {icon}
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p
              className={`text-xs mt-1 ${gradient ? "text-white/70" : "text-muted-foreground"}`}
            >
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Category label helper ───────────────────────────────────────────
function getCategoryInfo(
  category: ExtensionCategory,
  t: ReturnType<typeof useI18n>["t"]
) {
  switch (category) {
    case "ecosystem":
      return {
        label: t.extensionsManagement.ecosystem,
        icon: <Layers className="size-5 text-blue-500" />,
      };
    case "ai_tools":
      return {
        label: t.extensionsManagement.tools + " AI",
        icon: <Bot className="size-5 text-violet-500" />,
      };
    case "extensions":
      return {
        label: "UTE Extensions",
        icon: <Blocks className="size-5 text-indigo-500" />,
      };
  }
}

// ── Main Content ────────────────────────────────────────────────────
function ExtensionsContent() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ExtensionCategory | "all">(
    "all"
  );

  const filteredExtensions = useMemo(() => {
    let result = allExtensions;

    if (activeFilter !== "all") {
      result = result.filter((ext) => ext.category === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (ext) =>
          ext.name.toLowerCase().includes(q) ||
          ext.subtitle.toLowerCase().includes(q) ||
          ext.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, activeFilter]);

  const stats = useMemo(() => {
    const eco = allExtensions.filter((e) => e.category === "ecosystem").length;
    const ai = allExtensions.filter((e) => e.category === "ai_tools").length;
    const ext = allExtensions.filter((e) => e.category === "extensions").length;

    return [
      {
        title: t.extensionsManagement.totalExtensions,
        value: allExtensions.length,
        icon: <Blocks className="size-4" />,
        description: t.extensionsManagement.description,
        gradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
      },
      {
        title: t.extensionsManagement.ecosystem,
        value: eco,
        icon: <Layers className="size-4" />,
        description: "Nền tảng cốt lõi",
        gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
      },
      {
        title: t.extensionsManagement.tools + " AI",
        value: ai,
        icon: <Sparkles className="size-4" />,
        description: "Công cụ thông minh",
      },
      {
        title: "UTE Extensions",
        value: ext,
        icon: <Grid3X3 className="size-4" />,
        description: "Tiện ích mở rộng",
      },
    ];
  }, [t]);

  // Group extensions by category
  const grouped = useMemo(() => {
    const categories: ExtensionCategory[] = [
      "ecosystem",
      "ai_tools",
      "extensions",
    ];
    return categories
      .map((cat) => ({
        category: cat,
        items: filteredExtensions.filter((e) => e.category === cat),
      }))
      .filter((g) => g.items.length > 0);
  }, [filteredExtensions]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 relative"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-indigo-400/15 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent rounded-3xl blur-xl" />
        <div className="relative bg-white/50 dark:bg-background/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 p-6 shadow-xl shadow-indigo-500/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <Blocks className="size-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t.extensionsManagement.title}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t.extensionsManagement.description}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Search + Filter */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t.extensionsManagement.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center rounded-lg border bg-muted/30 p-1">
            <Button
              variant={activeFilter === "all" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setActiveFilter("all")}
            >
              <Grid3X3 className="mr-1.5 size-3.5" />
              {t.extensionsManagement.allExtensions}
            </Button>
            <Button
              variant={activeFilter === "ecosystem" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setActiveFilter("ecosystem")}
            >
              <Layers className="mr-1.5 size-3.5" />
              {t.extensionsManagement.ecosystem}
            </Button>
            <Button
              variant={activeFilter === "ai_tools" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setActiveFilter("ai_tools")}
            >
              <Sparkles className="mr-1.5 size-3.5" />
              {t.extensionsManagement.tools}
            </Button>
            <Button
              variant={activeFilter === "extensions" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setActiveFilter("extensions")}
            >
              <Blocks className="mr-1.5 size-3.5" />
              Extensions
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Grouped extension cards */}
      {grouped.map((group) => {
        const info = getCategoryInfo(group.category, t);
        return (
          <motion.div key={group.category} variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              {info.icon}
              <h2 className="text-xl font-semibold">{info.label}</h2>
              <Badge variant="outline" className="ml-1 text-xs">
                {group.items.length}
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.items.map((ext) => (
                <ExtensionCard key={ext.name + ext.url} ext={ext} />
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Empty state */}
      {filteredExtensions.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-16"
        >
          <div className="size-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Blocks className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">
            Không tìm thấy tiện ích
          </h3>
          <p className="text-sm text-muted-foreground">
            Thử thay đổi từ khóa hoặc bộ lọc
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ExtensionsPage() {
  return (
    <Suspense fallback={<PageLoader text="Đang tải..." />}>
      <ExtensionsContent />
    </Suspense>
  );
}
