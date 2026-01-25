"use client";

import { motion } from "framer-motion";
import { Image, Upload, FolderOpen } from "lucide-react";

import { useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export default function MediaPage() {
  const { t } = useI18n();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">{t.media.title}</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý hình ảnh, video và các tệp đa phương tiện
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5" />
              {t.media.uploadFiles}
            </CardTitle>
            <CardDescription>
              {t.media.dragAndDrop} {t.media.orClickToUpload}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Image className="size-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                {t.media.dragAndDrop}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {t.media.orClickToUpload}
              </p>
              <Button>
                <Upload className="mr-2 size-4" />
                {t.media.upload}
              </Button>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                <strong>{t.media.supportedFormats}:</strong> JPG, PNG, GIF, WEBP, MP4, PDF
              </p>
              <p>
                <strong>{t.media.maxFileSize}:</strong> 10MB
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="size-5" />
              {t.media.library}
            </CardTitle>
            <CardDescription>
              Các tệp đã tải lên của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Image className="size-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có tệp nào</h3>
              <p className="text-muted-foreground mb-4">
                Tải lên tệp đầu tiên của bạn để bắt đầu
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
