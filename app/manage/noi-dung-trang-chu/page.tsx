"use client";

import { motion } from "framer-motion";
import {
  Image,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Newspaper,
  Bell,
  Link2,
  Users,
  BarChart3,
  ChevronRight,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
  order: number;
}

const mockBanners: BannerSlide[] = [
  {
    id: "1",
    title: "Chào mừng đến với HCMUTE",
    subtitle: "Trường Đại học Sư phạm Kỹ thuật TP. Hồ Chí Minh",
    image: "/images/banner-1.jpg",
    link: "/gioi-thieu",
    active: true,
    order: 1,
  },
  {
    id: "2",
    title: "Tuyển sinh 2026",
    subtitle: "Đăng ký ngay để nhận ưu đãi",
    image: "/images/banner-2.jpg",
    link: "/tuyen-sinh",
    active: true,
    order: 2,
  },
  {
    id: "3",
    title: "Nghiên cứu khoa học",
    subtitle: "Khám phá các công trình nghiên cứu tiên tiến",
    image: "/images/banner-3.jpg",
    link: "/nghien-cuu",
    active: false,
    order: 3,
  },
];

interface QuickLink {
  id: string;
  title: string;
  icon: string;
  href: string;
  active: boolean;
}

const mockQuickLinks: QuickLink[] = [
  { id: "1", title: "Cổng thông tin sinh viên", icon: "user", href: "#", active: true },
  { id: "2", title: "E-Learning", icon: "book", href: "#", active: true },
  { id: "3", title: "Thư viện điện tử", icon: "library", href: "#", active: true },
  { id: "4", title: "Email HCMUTE", icon: "mail", href: "#", active: true },
  { id: "5", title: "Đăng ký tín chỉ", icon: "calendar", href: "#", active: false },
];

interface StatItem {
  id: string;
  label: string;
  value: string;
  active: boolean;
}

const mockStats: StatItem[] = [
  { id: "1", label: "Sinh viên", value: "25,000+", active: true },
  { id: "2", label: "Giảng viên", value: "1,200+", active: true },
  { id: "3", label: "Ngành đào tạo", value: "50+", active: true },
  { id: "4", label: "Năm thành lập", value: "1962", active: true },
];

function BannerCard({ banner }: { banner: BannerSlide }) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-4">
            <div className="cursor-grab text-muted-foreground hover:text-foreground">
              <GripVertical className="size-5" />
            </div>
            <div className="size-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Image className="size-8 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{banner.title}</h3>
                {banner.active ? (
                  <Badge variant="default" className="shrink-0">
                    <Eye className="size-3 mr-1" />
                    Hiển thị
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="shrink-0">
                    <EyeOff className="size-3 mr-1" />
                    Ẩn
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{banner.subtitle}</p>
              <p className="text-xs text-muted-foreground mt-1">Link: {banner.link}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={banner.active} />
              <Button variant="ghost" size="icon">
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function HomepageContentPage() {
  const { t } = useI18n();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">{t.homepageContent.title}</h1>
        <p className="text-muted-foreground mt-1">{t.homepageContent.description}</p>
      </motion.div>

      <Tabs defaultValue="banner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="banner" className="gap-2">
            <Image className="size-4" />
            {t.homepageContent.banner}
          </TabsTrigger>
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="size-4" />
            {t.homepageContent.featuredNews}
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Bell className="size-4" />
            {t.homepageContent.announcements}
          </TabsTrigger>
          <TabsTrigger value="quicklinks" className="gap-2">
            <Link2 className="size-4" />
            {t.homepageContent.quickLinks}
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="size-4" />
            {t.homepageContent.statistics}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banner" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.homepageContent.banner}</CardTitle>
                  <CardDescription>Quản lý các slide banner trên trang chủ</CardDescription>
                </div>
                <Button>
                  <Plus className="size-4 mr-2" />
                  {t.homepageContent.addSlide}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockBanners.map((banner) => (
                  <BannerCard key={banner.id} banner={banner} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.homepageContent.featuredNews}</CardTitle>
                  <CardDescription>Chọn tin tức hiển thị nổi bật trên trang chủ</CardDescription>
                </div>
                <Button variant="outline">
                  Quản lý tin tức
                  <ChevronRight className="size-4 ml-2" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded bg-muted flex items-center justify-center">
                          <Newspaper className="size-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Tin tức nổi bật {i}</p>
                          <p className="text-sm text-muted-foreground">Đăng ngày 25/01/2026</p>
                        </div>
                      </div>
                      <Switch defaultChecked={i <= 2} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.homepageContent.announcements}</CardTitle>
                  <CardDescription>Quản lý thông báo hiển thị trên trang chủ</CardDescription>
                </div>
                <Button>
                  <Plus className="size-4 mr-2" />
                  Thêm thông báo
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Thông báo nghỉ Tết Nguyên đán 2026", type: "Quan trọng" },
                    { title: "Lịch thi học kỳ 1 năm học 2025-2026", type: "Học vụ" },
                    { title: "Thông báo đóng học phí học kỳ 2", type: "Tài chính" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Bell className="size-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <Badge variant="outline" className="mt-1">{item.type}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="quicklinks" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.homepageContent.quickLinks}</CardTitle>
                  <CardDescription>Quản lý các liên kết nhanh trên trang chủ</CardDescription>
                </div>
                <Button>
                  <Plus className="size-4 mr-2" />
                  Thêm liên kết
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {mockQuickLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <GripVertical className="size-5 text-muted-foreground cursor-grab" />
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Link2 className="size-5 text-primary" />
                        </div>
                        <span className="font-medium">{link.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={link.active} />
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.homepageContent.statistics}</CardTitle>
                  <CardDescription>Chỉnh sửa số liệu thống kê hiển thị trên trang chủ</CardDescription>
                </div>
                <Button>
                  <Plus className="size-4 mr-2" />
                  Thêm thống kê
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {mockStats.map((stat) => (
                    <div key={stat.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BarChart3 className="size-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={stat.active} />
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
