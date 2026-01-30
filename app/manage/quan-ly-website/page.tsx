"use client";

import { motion } from "framer-motion";
import {
  Settings,
  Palette,
  Search,
  Share2,
  LayoutTemplate,
  Menu,
  Globe,
  Upload,
  Save,
  RefreshCw,
  Moon,
  Sun,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const colorOptions = [
  { name: "Blue", value: "#3b82f6", class: "bg-blue-500" },
  { name: "Green", value: "#22c55e", class: "bg-green-500" },
  { name: "Purple", value: "#a855f7", class: "bg-purple-500" },
  { name: "Orange", value: "#f97316", class: "bg-orange-500" },
  { name: "Red", value: "#ef4444", class: "bg-red-500" },
  { name: "Teal", value: "#14b8a6", class: "bg-teal-500" },
];

const socialLinks = [
  {
    id: "facebook",
    name: "Facebook",
    placeholder: "https://facebook.com/hcmute",
  },
  {
    id: "youtube",
    name: "YouTube",
    placeholder: "https://youtube.com/@hcmute",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    placeholder: "https://linkedin.com/school/hcmute",
  },
  { id: "twitter", name: "Twitter/X", placeholder: "https://x.com/hcmute" },
  {
    id: "instagram",
    name: "Instagram",
    placeholder: "https://instagram.com/hcmute",
  },
];

export default function WebsiteManagementPage() {
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.websiteManagement.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.websiteManagement.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="size-4 mr-2" />
            Đặt lại
          </Button>
          <Button>
            <Save className="size-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="size-4" />
            {t.websiteManagement.general}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="size-4" />
            {t.websiteManagement.appearance}
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Search className="size-4" />
            {t.websiteManagement.seo}
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="size-4" />
            {t.websiteManagement.socialLinks}
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-2">
            <LayoutTemplate className="size-4" />
            {t.websiteManagement.footer}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>{t.websiteManagement.general}</CardTitle>
                <CardDescription>
                  Cấu hình thông tin cơ bản của website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">
                      {t.websiteManagement.siteName}
                    </Label>
                    <Input
                      id="siteName"
                      defaultValue="Trường Đại học Công nghệ Kỹ Thuật TP.HCM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">URL Website</Label>
                    <Input id="siteUrl" defaultValue="https://hcmute.edu.vn" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">
                    {t.websiteManagement.siteDescription}
                  </Label>
                  <Textarea
                    id="siteDescription"
                    defaultValue="Trường Đại học Công nghệ Kỹ Thuật TP. Hồ Chí Minh (HCMUTE) - Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực kỹ thuật và công nghệ."
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="size-20 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
                        <Globe className="size-8 text-muted-foreground" />
                      </div>
                      <Button variant="outline">
                        <Upload className="size-4 mr-2" />
                        Tải lên
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
                        <Globe className="size-6 text-muted-foreground" />
                      </div>
                      <Button variant="outline">
                        <Upload className="size-4 mr-2" />
                        Tải lên
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ mặc định</Label>
                  <Select defaultValue="vi">
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>{t.websiteManagement.appearance}</CardTitle>
                <CardDescription>Tùy chỉnh giao diện website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>{t.websiteManagement.primaryColor}</Label>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        className={`size-10 rounded-full ${color.class} ring-2 ring-offset-2 ring-transparent hover:ring-primary transition-all`}
                        title={color.name}
                      />
                    ))}
                    <div className="flex items-center gap-2 ml-4">
                      <Input
                        type="color"
                        defaultValue="#3b82f6"
                        className="size-10 p-1 cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground">
                        Tùy chỉnh
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <Moon className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {t.websiteManagement.darkMode}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cho phép người dùng chuyển sang chế độ tối
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Font chữ</Label>
                  <Select defaultValue="inter">
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="noto">Noto Sans Vietnamese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <Select defaultValue="md">
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (0px)</SelectItem>
                      <SelectItem value="sm">Small (4px)</SelectItem>
                      <SelectItem value="md">Medium (8px)</SelectItem>
                      <SelectItem value="lg">Large (12px)</SelectItem>
                      <SelectItem value="xl">Extra Large (16px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>{t.websiteManagement.seo}</CardTitle>
                <CardDescription>Tối ưu hóa công cụ tìm kiếm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    defaultValue="HCMUTE - Trường Đại học Công nghệ Kỹ Thuật TP.HCM"
                  />
                  <p className="text-xs text-muted-foreground">
                    Khuyến nghị: 50-60 ký tự
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    defaultValue="Trường Đại học Công nghệ Kỹ Thuật TP. Hồ Chí Minh - Đào tạo kỹ sư, cử nhân chất lượng cao trong các lĩnh vực kỹ thuật, công nghệ và sư phạm."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Khuyến nghị: 150-160 ký tự
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    defaultValue="HCMUTE, đại học, sư phạm kỹ thuật, TP.HCM, tuyển sinh, đào tạo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Open Graph Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-48 h-24 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
                      <Globe className="size-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline">
                        <Upload className="size-4 mr-2" />
                        Tải lên
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Khuyến nghị: 1200x630px
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Sitemap tự động</p>
                    <p className="text-sm text-muted-foreground">
                      Tự động tạo sitemap.xml cho Google
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Robots.txt</p>
                    <p className="text-sm text-muted-foreground">
                      Cho phép bot tìm kiếm index website
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>{t.websiteManagement.socialLinks}</CardTitle>
                <CardDescription>
                  Liên kết đến các trang mạng xã hội
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialLinks.map((social) => (
                  <div key={social.id} className="flex items-center gap-4">
                    <Label className="w-24">{social.name}</Label>
                    <Input
                      placeholder={social.placeholder}
                      className="flex-1"
                    />
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>{t.websiteManagement.footer}</CardTitle>
                <CardDescription>Cấu hình nội dung footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="footerAbout">Giới thiệu ngắn</Label>
                  <Textarea
                    id="footerAbout"
                    defaultValue="Trường Đại học Công nghệ Kỹ Thuật TP. Hồ Chí Minh được thành lập năm 1962, là một trong những trường đại học hàng đầu về đào tạo kỹ thuật và công nghệ tại Việt Nam."
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      defaultValue="01 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP.HCM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Điện thoại</Label>
                    <Input id="phone" defaultValue="(028) 3896 8641" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="info@hcmute.edu.vn" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Giờ làm việc</Label>
                    <Input
                      id="workingHours"
                      defaultValue="Thứ 2 - Thứ 6: 7:30 - 17:00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copyright">Bản quyền</Label>
                  <Input
                    id="copyright"
                    defaultValue="© 2026 Trường Đại học Công nghệ Kỹ Thuật TP.HCM. All rights reserved."
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
