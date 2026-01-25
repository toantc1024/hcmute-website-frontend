"use client";

import { motion } from "motion/react";
import { ArrowRight, Clock, TrendingUp, Hash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { AuroraText } from "@/components/ui/aurora-text";
import CardSwap, { Card } from "@/components/ui/card-swap";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  views?: number;
  tags?: string[];
}

const newsItems: NewsItem[] = [
  {
    id: 101,
    title: "HCMUTE ký kết hợp tác với Đại học Tokyo - Nhật Bản",
    excerpt:
      "Chương trình hợp tác tạo cơ hội trao đổi sinh viên, giảng viên và phát triển các dự án nghiên cứu chung trong lĩnh vực kỹ thuật và công nghệ.",
    date: "2024-01-15",
    category: "Hợp tác quốc tế",
    image: "/news/hoi-thao-ute.jpg",
    readTime: "3 phút",
    views: 245,
    tags: ["hợp-tác", "quốc-tế", "tokyo"],
  },
  {
    id: 102,
    title: "Sinh viên HCMUTE đạt giải Nhất cuộc thi Robotics Việt Nam 2024",
    excerpt:
      "Đội thi của Khoa Cơ khí xuất sắc giành giải Nhất với dự án robot tự động phân loại rác thải thông minh.",
    date: "2024-01-12",
    category: "Thành tích sinh viên",
    image: "/news/giai-nha-robot.jpeg",
    readTime: "2 phút",
    views: 189,
    tags: ["robotics", "giải-thưởng", "sinh-viên"],
  },
  {
    id: 103,
    title: "Hội thảo quốc tế về AI và IoT trong giáo dục kỹ thuật",
    excerpt:
      "Sự kiện quy tụ hơn 200 chuyên gia trong nước và quốc tế thảo luận về xu hướng ứng dụng công nghệ trong đào tạo kỹ thuật.",
    date: "2024-01-10",
    category: "Sự kiện",
    image: "/news/vina-ute.png",
    readTime: "4 phút",
    views: 312,
    tags: ["ai", "iot", "giáo-dục"],
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function NewsSection() {
  return (
    <section id="news" className="relative overflow-x-hidden py-12 lg:py-20">
      <div className="relative w-full px-4 sm:px-8 lg:px-16 xl:px-24">
        <div className="bg-white border relative min-h-[200px] lg:min-h-[500px] rounded-3xl overflow-hidden">
          <div className="relative p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-1 flex flex-col justify-start text-start space-y-2 z-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 sm:px-4 py-2 text-xs sm:text-sm text-blue-700 w-fit">
                <span className="inline-flex size-2 rounded-full bg-blue-600" />
                Tin tức nổi bật của HCMUTE
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-gray-900">
                <AuroraText
                  colors={["#0c4ebfff", "#1760dfff", "#ae0303ff"]}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold"
                >
                  TIN TỨC &amp; SỰ KIỆN
                </AuroraText>
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl leading-relaxed">
                Hoạt động đào tạo, nghiên cứu và kết nối doanh nghiệp tại Trường
                Đại học Sư phạm Kỹ thuật TP.HCM.
              </p>
            </motion.div>

            <DotPattern
              width={20}
              height={20}
              cx={1}
              cy={1}
              cr={1}
              className={cn(
                "absolute inset-0 [mask-image:linear-gradient(to_top_right,white,transparent,transparent)]"
              )}
            />

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="hidden lg:flex flex-1 relative items-center justify-center lg:justify-end"
            >
              <div className="scale-75 xl:scale-90 2xl:scale-100">
                <NeonGradientCard className="max-w-sm items-center justify-center text-center">
                  <CardSwap
                    width={320}
                    height={360}
                    cardDistance={50}
                    verticalDistance={70}
                    delay={6000}
                    className="w-full max-w-[320px]"
                  >
                    {newsItems.map((item) => (
                      <Card
                        key={item.id}
                        customClass="!border-gray-300 bg-white/50 overflow-hidden"
                      >
                        <div className="block h-full w-full">
                          <div className="relative h-full w-full">
                            <div className="flex flex-col h-full">
                              <div className="rounded-t-2xl bg-transparent backdrop-blur-md flex items-center gap-2 w-full p-2">
                                <img
                                  src="/assets/FLOWER_BLUE_GRADIENT_UTE.png"
                                  className="w-8 h-8 object-contain"
                                  alt="UTE Logo"
                                />
                                <h3 className="text-sm text-start font-bold text-gray-700/85 leading-tight line-clamp-2">
                                  {item.title}
                                </h3>
                              </div>

                              <div className="flex-1 relative">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  sizes="320px"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardSwap>
                </NeonGradientCard>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 pt-8 lg:pt-12 lg:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {newsItems.map((item, index) => (
            <Link key={item.id} href={`/tin-tuc/${item.id}`}>
              <motion.article
                className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 transition-all duration-500 hover:shadow-xl cursor-pointer aspect-square"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative rounded-3xl h-full w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {item.views && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-3xl bg-black/50 backdrop-blur-sm border border-white/20 z-10">
                      <span className="text-[10px] sm:text-xs font-medium text-white">
                        {item.views}
                      </span>
                      <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/80" />
                    </div>
                  )}

                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                    <span className="inline-flex rounded-3xl items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-white/95 backdrop-blur-sm text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-800 border border-white/30 shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                    <div className="flex items-center justify-end mb-2 sm:mb-3">
                      <span className="text-[10px] sm:text-xs font-medium text-white/80">
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white leading-tight line-clamp-2 mb-2">
                      {item.title}
                    </h3>

                    {item.tags && item.tags.length > 0 && (
                      <div className="hidden sm:flex flex-wrap items-center gap-2 mb-3">
                        {item.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex rounded-3xl items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm text-xs font-medium text-white border border-white/30"
                          >
                            <Hash className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="text-xs text-white/70 font-medium">
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/70">
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {item.readTime}
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 text-white text-base sm:text-lg font-semibold">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </motion.div>

        <motion.div
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 rounded-3xl border border-gray-200 bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
              Khám phá toàn bộ tin tức, sự kiện và thông báo từ HCMUTE.
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Cập nhật những hoạt động mới nhất của trường
            </p>
          </div>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 rounded-3xl border border-gray-200 bg-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md group whitespace-nowrap"
          >
            Xem tất cả tin tức
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
