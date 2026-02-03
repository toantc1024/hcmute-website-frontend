"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Eye,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  BarChart3,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/features/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
}

function StatCard({ title, value, icon, description, trend, gradient }: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className={`h-full relative overflow-hidden ${gradient ? 'text-white border-0' : ''}`}>
        {gradient && (
          <div className={`absolute inset-0 ${gradient}`} />
        )}
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${gradient ? 'text-white/90' : ''}`}>{title}</CardTitle>
          <div className={gradient ? 'text-white/80' : 'text-muted-foreground'}>{icon}</div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className={`text-xs mt-1 ${gradient ? 'text-white/70' : 'text-muted-foreground'}`}>{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp
                className={`size-3 ${
                  trend.isPositive
                    ? "text-green-400"
                    : "text-red-400 rotate-180"
                }`}
              />
              <span
                className={`text-xs ${
                  trend.isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
              <span className={`text-xs ${gradient ? 'text-white/60' : 'text-muted-foreground'}`}>
                so với tháng trước
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function QuickAction({ title, description, href, icon }: QuickActionProps) {
  return (
    <motion.div variants={itemVariants}>
      <Link href={href}>
        <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 h-full bg-gradient-to-br from-white to-blue-50/50 dark:from-background dark:to-blue-950/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-lg shadow-primary/25">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

const viewsChartData = [
  { month: "T1", views: 1860 },
  { month: "T2", views: 3050 },
  { month: "T3", views: 2370 },
  { month: "T4", views: 4290 },
  { month: "T5", views: 3890 },
  { month: "T6", views: 5340 },
];

const viewsChartConfig = {
  views: {
    label: "Lượt xem",
    color: "#1760df",
  },
} satisfies ChartConfig;

const postsChartData = [
  { status: "Đã xuất bản", count: 18, fill: "#1760df" },
  { status: "Nháp", count: 4, fill: "#5a94e8" },
  { status: "Chờ duyệt", count: 2, fill: "#a3c4f3" },
];

const postsChartConfig = {
  count: {
    label: "Số bài",
    color: "#1760df",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const { t } = useI18n();
  const { user } = useAuth();

  const stats = [
    {
      title: t.dashboard.totalPosts,
      value: 24,
      icon: <FileText className="size-4" />,
      description: "Tổng số bài viết của bạn",
      trend: { value: 12, isPositive: true },
      gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
    },
    {
      title: t.dashboard.publishedPosts,
      value: 18,
      icon: <Eye className="size-4" />,
      description: "Bài đã xuất bản",
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      title: t.dashboard.draftPosts,
      value: 4,
      icon: <Clock className="size-4" />,
      description: "Bài đang viết dở",
    },
    {
      title: t.dashboard.pendingReview,
      value: 2,
      icon: <TrendingUp className="size-4" />,
      description: "Đang chờ phê duyệt",
    },
  ];

  const quickActions = [
    {
      title: t.posts.createPost,
      description: "Bắt đầu viết bài mới",
      href: "/manage/posts/create",
      icon: <Plus className="size-5" />,
    },
    {
      title: t.posts.allPosts,
      description: "Quản lý tất cả bài viết",
      href: "/manage/posts",
      icon: <FileText className="size-5" />,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative"
    >
      {/* Background Orb Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-400/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Welcome Header with Glass Effect */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent rounded-3xl blur-xl" />
        <div className="relative bg-white/50 dark:bg-background/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 p-6 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white">
              <Sparkles className="size-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent">
              {t.dashboard.welcome}, {user?.name || user?.preferred_username}!
            </h1>
          </div>
          <p className="text-muted-foreground">
            Đây là bảng điều khiển của bạn. Quản lý bài viết và theo dõi hiệu suất.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-gradient-to-br from-white to-blue-50/30 dark:from-background dark:to-blue-950/10 border-blue-100/50 dark:border-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-white">
                  <BarChart3 className="size-4" />
                </div>
                Lượt xem theo tháng
              </CardTitle>
              <CardDescription>
                Thống kê lượt xem bài viết trong 6 tháng gần nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={viewsChartConfig}
                className="h-[250px] w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={viewsChartData}
                  margin={{ left: 12, right: 12, top: 12 }}
                >
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1760df" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#1760df" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="views"
                    type="monotone"
                    fill="url(#viewsGradient)"
                    stroke="#1760df"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full bg-gradient-to-br from-white to-blue-50/30 dark:from-background dark:to-blue-950/10 border-blue-100/50 dark:border-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-white">
                  <FileText className="size-4" />
                </div>
                Phân bố bài viết
              </CardTitle>
              <CardDescription>
                Số lượng bài viết theo trạng thái
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={postsChartConfig}
                className="h-[250px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={postsChartData}
                  layout="vertical"
                  margin={{ left: 0, right: 12 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <YAxis
                    dataKey="status"
                    type="category"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    width={100}
                  />
                  <XAxis type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="count" radius={6} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-primary to-blue-600 rounded-full" />
          {t.dashboard.quickActions}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((action) => (
            <QuickAction key={action.title} {...action} />
          ))}
        </div>
      </motion.div>

      {/* Recent Posts */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-background dark:to-blue-950/10 border-blue-100/50 dark:border-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-primary to-blue-600 rounded-full" />
              {t.dashboard.recentPosts}
            </CardTitle>
            <CardDescription>Các bài viết gần đây nhất của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl border bg-white/50 dark:bg-background/50 hover:bg-accent/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
                      <FileText className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Bài viết mẫu {i}</p>
                      <p className="text-sm text-muted-foreground">
                        Cập nhật 2 giờ trước
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/manage/posts/${i}`}>{t.common.view}</Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild className="bg-white/50 hover:bg-primary hover:text-white transition-all">
                <Link href="/manage/posts">
                  {t.posts.allPosts}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
