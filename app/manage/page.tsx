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
}

function StatCard({ title, value, icon, description, trend }: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp
                className={`size-3 ${
                  trend.isPositive ? "text-green-500" : "text-red-500 rotate-180"
                }`}
              />
              <span
                className={`text-xs ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">so với tháng trước</span>
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
        <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50 h-full">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const postsChartData = [
  { status: "Đã xuất bản", count: 18, fill: "hsl(var(--primary))" },
  { status: "Nháp", count: 4, fill: "hsl(var(--muted-foreground))" },
  { status: "Chờ duyệt", count: 2, fill: "hsl(var(--chart-3))" },
];

const postsChartConfig = {
  count: {
    label: "Số bài",
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
    },
    {
      title: t.dashboard.publishedPosts,
      value: 18,
      icon: <Eye className="size-4" />,
      description: "Bài đã xuất bản",
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
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">
          {t.dashboard.welcome}, {user?.name || user?.preferred_username}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Đây là bảng điều khiển của bạn. Quản lý bài viết và theo dõi hiệu suất.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5" />
                Lượt xem theo tháng
              </CardTitle>
              <CardDescription>
                Thống kê lượt xem bài viết trong 6 tháng gần nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={viewsChartConfig} className="h-[250px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={viewsChartData}
                  margin={{ left: 12, right: 12, top: 12 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Phân bố bài viết
              </CardTitle>
              <CardDescription>
                Số lượng bài viết theo trạng thái
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={postsChartConfig} className="h-[250px] w-full">
                <BarChart
                  accessibilityLayer
                  data={postsChartData}
                  layout="vertical"
                  margin={{ left: 0, right: 12 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
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
                  <Bar dataKey="count" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">{t.dashboard.quickActions}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((action) => (
            <QuickAction key={action.title} {...action} />
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.recentPosts}</CardTitle>
            <CardDescription>
              Các bài viết gần đây nhất của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-muted flex items-center justify-center">
                      <FileText className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Bài viết mẫu {i}</p>
                      <p className="text-sm text-muted-foreground">
                        Cập nhật 2 giờ trước
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/manage/posts/${i}`}>
                      {t.common.view}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
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
