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
  visible: { opacity: 1, y: 0 },
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
              <span className="text-xs text-muted-foreground">so với hôm qua</span>
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
    color: "hsl(var(--primary))",
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
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const deviceData = [
  { name: "Desktop", value: 55, fill: "hsl(var(--primary))" },
  { name: "Mobile", value: 35, fill: "hsl(var(--chart-2))" },
  { name: "Tablet", value: 10, fill: "hsl(var(--chart-3))" },
];

const deviceConfig = {
  Desktop: { label: "Desktop", color: "hsl(var(--primary))" },
  Mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
  Tablet: { label: "Tablet", color: "hsl(var(--chart-3))" },
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
    },
    {
      title: t.traffic.uniqueVisitors,
      value: "8,234",
      icon: <Users className="size-4" />,
      description: t.traffic.todayVisits,
      trend: { value: 8, isPositive: true },
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
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">{t.traffic.title}</h1>
        <p className="text-muted-foreground mt-1">{t.traffic.description}</p>
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
                <TrendingUp className="size-5" />
                Lượt truy cập theo ngày
              </CardTitle>
              <CardDescription>Thống kê 7 ngày gần nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={visitsChartConfig} className="h-[280px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={visitsChartData}
                  margin={{ left: 12, right: 12, top: 12 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
                <Eye className="size-5" />
                {t.traffic.topPages}
              </CardTitle>
              <CardDescription>Trang được xem nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={topPagesConfig} className="h-[280px] w-full">
                <BarChart
                  accessibilityLayer
                  data={topPagesData}
                  layout="vertical"
                  margin={{ left: 0, right: 12 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
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
                  <Bar
                    dataKey="views"
                    fill="hsl(var(--primary))"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="size-5" />
              {t.traffic.visitorsByDevice}
            </CardTitle>
            <CardDescription>Phân bố thiết bị truy cập</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ChartContainer config={deviceConfig} className="h-[200px] w-[200px]">
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
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Monitor className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Desktop</p>
                    <p className="text-sm text-muted-foreground">55% (6,849 lượt)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-2/10">
                    <Smartphone className="size-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-medium">Mobile</p>
                    <p className="text-sm text-muted-foreground">35% (4,359 lượt)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-3/10">
                    <Tablet className="size-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="font-medium">Tablet</p>
                    <p className="text-sm text-muted-foreground">10% (1,245 lượt)</p>
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
