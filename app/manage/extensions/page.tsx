"use client";

import { motion } from "framer-motion";
import { Puzzle, Check, X, Settings } from "lucide-react";

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

interface ExtensionCardProps {
  name: string;
  description: string;
  version: string;
  author: string;
  isInstalled: boolean;
  isEnabled?: boolean;
}

function ExtensionCard({
  name,
  description,
  version,
  author,
  isInstalled,
  isEnabled,
}: ExtensionCardProps) {
  const { t } = useI18n();

  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Puzzle className="size-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{name}</h3>
                <Badge variant="outline" className="text-xs">
                  v{version}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {description}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.extensions.author}: {author}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isInstalled ? (
                <>
                  <Button variant="ghost" size="icon">
                    <Settings className="size-4" />
                  </Button>
                  <Badge variant={isEnabled ? "default" : "secondary"}>
                    {isEnabled ? t.extensions.enable : t.extensions.disable}
                  </Badge>
                </>
              ) : (
                <Button size="sm">{t.extensions.install}</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ExtensionsPage() {
  const { t } = useI18n();

  const installedExtensions: ExtensionCardProps[] = [
    {
      name: "SEO Optimizer",
      description: "Tối ưu hóa SEO cho bài viết với phân tích từ khóa và gợi ý cải thiện",
      version: "1.2.0",
      author: "HCM-UTE Team",
      isInstalled: true,
      isEnabled: true,
    },
    {
      name: "Image Optimizer",
      description: "Tự động nén và tối ưu hóa hình ảnh khi tải lên",
      version: "2.0.1",
      author: "HCM-UTE Team",
      isInstalled: true,
      isEnabled: true,
    },
    {
      name: "Social Share",
      description: "Thêm nút chia sẻ mạng xã hội vào bài viết",
      version: "1.0.5",
      author: "Community",
      isInstalled: true,
      isEnabled: false,
    },
  ];

  const availableExtensions: ExtensionCardProps[] = [
    {
      name: "Analytics Dashboard",
      description: "Bảng điều khiển phân tích chi tiết về lượt xem và tương tác",
      version: "3.1.0",
      author: "HCM-UTE Team",
      isInstalled: false,
    },
    {
      name: "Comment System",
      description: "Hệ thống bình luận tiên tiến với quản lý và kiểm duyệt",
      version: "2.3.0",
      author: "Community",
      isInstalled: false,
    },
    {
      name: "Newsletter",
      description: "Quản lý và gửi bản tin email đến người đăng ký",
      version: "1.5.2",
      author: "HCM-UTE Team",
      isInstalled: false,
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
        <h1 className="text-3xl font-bold tracking-tight">{t.extensions.title}</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý các tiện ích mở rộng để tăng cường chức năng
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Check className="size-5 text-green-500" />
          {t.extensions.installed} ({installedExtensions.length})
        </h2>
        <div className="grid gap-4">
          {installedExtensions.map((ext) => (
            <ExtensionCard key={ext.name} {...ext} />
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Puzzle className="size-5 text-primary" />
          {t.extensions.available} ({availableExtensions.length})
        </h2>
        <div className="grid gap-4">
          {availableExtensions.map((ext) => (
            <ExtensionCard key={ext.name} {...ext} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
