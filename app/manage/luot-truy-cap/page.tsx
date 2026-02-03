"use client";

import { motion } from "framer-motion";
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
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
  Cell,
  Pie,
  PieChart,
} from "recharts";

import { useI18n } from "@/lib/i18n";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    transition: { staggerChildren: 0.1 },
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
                so với hôm qua
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

const visitsChartData = [
  { date: "T2", visits: 1240 },
  { date: "T3", visits: 1580 },
  { date: "T4", visits: 1320 },
  { date: "T5", visits: 1890 },
  { date: "T6", visits: 2100 },
  { date: "T7", visits: 1650 },
  { date: "CN", visits: 980 },
];

const visitsChartConfig = {
  visits: {
    label: "Lượt truy cập",
    color: "#1760df",
  },
} satisfies ChartConfig;

const topPagesData = [
  { page: "Trang chủ", views: 4523 },
  { page: "Tuyển sinh", views: 3241 },
  { page: "Đào tạo", views: 2156 },
  { page: "Nghiên cứu", views: 1842 },
  { page: "Tin tức", views: 1523 },
];

const topPagesConfig = {
  views: {
    label: "Lượt xem",
    color: "#1760df",
  },
} satisfies ChartConfig;

const deviceData = [
  { name: "Desktop", value: 55, fill: "#1760df" },
  { name: "Mobile", value: 35, fill: "#5a94e8" },
  { name: "Tablet", value: 10, fill: "#a3c4f3" },
];

const deviceConfig = {
  Desktop: { label: "Desktop", color: "#1760df" },
  Mobile: { label: "Mobile", color: "#5a94e8" },
  Tablet: { label: "Tablet", color: "#a3c4f3" },
} satisfies ChartConfig;

export default function TrafficPage() {
  const { t } = useI18n();

  const stats = [
    {
      title: t.traffic.totalVisits,
      value: "12,453",
      icon: <Eye className="size-4" />,
      description: t.traffic.todayVisits,
      trend: { value: 12, isPositive: true },
      gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
    },
    {
      title: t.traffic.uniqueVisitors,
      value: "8,234",
      icon: <Users className="size-4" />,
      description: t.traffic.todayVisits,
      trend: { value: 8, isPositive: true },
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      title: t.traffic.pageViews,
      value: "45,678",
      icon: <Globe className="size-4" />,
      description: t.traffic.weeklyVisits,
      trend: { value: 15, isPositive: true },
    },
    {
      title: t.traffic.avgSessionDuration,
      value: "3m 42s",
      icon: <Clock className="size-4" />,
      description: "Trung bình",
      trend: { value: 5, isPositive: false },
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

      {/* Header with Glass Effect */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent rounded-3xl blur-xl" />
        <div className="relative bg-white/50 dark:bg-background/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 p-6 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white">
              <BarChart3 className="size-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent">
              {t.traffic.title}
            </h1>
          </div>
          <p className="text-muted-foreground">{t.traffic.description}</p>
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
                  <TrendingUp className="size-4" />
                </div>
                Lượt truy cập theo ngày
              </CardTitle>
              <CardDescription>Thống kê 7 ngày gần nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={visitsChartConfig}
                className="h-[280px] w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={visitsChartData}
                  margin={{ left: 12, right: 12, top: 12 }}
                >
                  <defs>
                    <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1760df" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#1760df" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
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
                    dataKey="visits"
                    type="monotone"
                    fill="url(#visitsGradient)"
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
                  <Eye className="size-4" />
                </div>
                {t.traffic.topPages}
              </CardTitle>
              <CardDescription>Trang được xem nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={topPagesConfig}
                className="h-[280px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={topPagesData}
                  layout="vertical"
                  margin={{ left: 0, right: 12 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <YAxis
                    dataKey="page"
                    type="category"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    width={80}
                  />
                  <XAxis type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="views" fill="#1760df" radius={6} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Device Distribution */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-background dark:to-blue-950/10 border-blue-100/50 dark:border-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-white">
                <Monitor className="size-4" />
              </div>
              {t.traffic.visitorsByDevice}
            </CardTitle>
            <CardDescription>Phân bố thiết bị truy cập</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ChartContainer
                config={deviceConfig}
                className="h-[200px] w-[200px]"
              >
                <PieChart>
                  <Pie
                    data={deviceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#1760df]/10">
                    <Monitor className="size-5 text-[#1760df]" />
                  </div>
                  <div>
                    <p className="font-medium">Desktop</p>
                    <p className="text-sm text-muted-foreground">
                      55% (6,849 lượt)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#5a94e8]/10">
                    <Smartphone className="size-5 text-[#5a94e8]" />
                  </div>
                  <div>
                    <p className="font-medium">Mobile</p>
                    <p className="text-sm text-muted-foreground">
                      35% (4,359 lượt)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#a3c4f3]/10">
                    <Tablet className="size-5 text-[#a3c4f3]" />
                  </div>
                  <div>
                    <p className="font-medium">Tablet</p>
                    <p className="text-sm text-muted-foreground">
                      10% (1,245 lượt)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
