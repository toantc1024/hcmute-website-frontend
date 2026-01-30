"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Star,
  Calendar,
  User,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  status: "published" | "draft" | "pending";
  featured: boolean;
  publishedAt: string;
  views: number;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Thông báo tuyển sinh đại học chính quy năm 2026",
    excerpt:
      "Trường Đại học Công nghệ Kỹ Thuật TP.HCM thông báo tuyển sinh đại học chính quy năm 2026 với nhiều ngành học mới...",
    category: "Tuyển sinh",
    author: "Admin",
    status: "published",
    featured: true,
    publishedAt: "2026-01-25",
    views: 1234,
  },
  {
    id: "2",
    title: "Lễ khai giảng năm học 2025-2026",
    excerpt:
      "Trường long trọng tổ chức lễ khai giảng năm học mới với sự tham dự của hàng nghìn tân sinh viên...",
    category: "Sự kiện",
    author: "Phòng CTSV",
    status: "published",
    featured: true,
    publishedAt: "2026-01-20",
    views: 856,
  },
  {
    id: "3",
    title: "Hội thảo quốc tế về AI trong giáo dục",
    excerpt:
      "Trường phối hợp tổ chức hội thảo quốc tế về ứng dụng trí tuệ nhân tạo trong giáo dục...",
    category: "Nghiên cứu",
    author: "Phòng KHCN",
    status: "pending",
    featured: false,
    publishedAt: "2026-01-18",
    views: 0,
  },
  {
    id: "4",
    title: "Thông báo lịch nghỉ Tết Nguyên đán 2026",
    excerpt:
      "Thông báo về lịch nghỉ Tết Nguyên đán năm 2026 cho toàn thể cán bộ, giảng viên và sinh viên...",
    category: "Thông báo",
    author: "Admin",
    status: "draft",
    featured: false,
    publishedAt: "",
    views: 0,
  },
];

function getStatusBadge(status: NewsItem["status"]) {
  const statusConfig = {
    published: { label: "Đã xuất bản", variant: "default" as const },
    draft: { label: "Nháp", variant: "secondary" as const },
    pending: { label: "Chờ duyệt", variant: "outline" as const },
  };
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function NewsCard({ news }: { news: NewsItem }) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(news.status)}
                <Badge variant="outline">{news.category}</Badge>
                {news.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Star className="size-3 mr-1" />
                    Nổi bật
                  </Badge>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="size-4 mr-2" />
                    Xem
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="size-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="size-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-primary cursor-pointer transition-colors">
              {news.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {news.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  {news.author}
                </span>
                {news.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {news.publishedAt}
                  </span>
                )}
              </div>
              {news.status === "published" && (
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {news.views.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function NewsPage() {
  const { t } = useI18n();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.news.title}</h1>
          <p className="text-muted-foreground mt-1">{t.news.description}</p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          {t.news.createNews}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm tin tức..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="tuyen-sinh">Tuyển sinh</SelectItem>
                  <SelectItem value="su-kien">Sự kiện</SelectItem>
                  <SelectItem value="thong-bao">Thông báo</SelectItem>
                  <SelectItem value="nghien-cuu">Nghiên cứu</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </motion.div>
  );
}
