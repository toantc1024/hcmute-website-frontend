"use client";

import { motion } from "motion/react";
import {
  Calendar,
  ArrowRight,
  Clock,
  TrendingUp,
  Hash,
  AxeIcon,
} from "lucide-react";
import Image from "next/image";
import CardSwap, { Card } from "@/components/ui/card-swap";
import Link from "next/link";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import { NeonGradientCard } from "../ui/neon-gradient-card";
import { AuroraText } from "../ui/aurora-text";

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
  {
    id: 104,
    title: "HCMUTE khai giảng chương trình đào tạo Kỹ sư chất lượng cao",
    excerpt:
      "Chương trình đào tạo Kỹ sư chất lượng cao với 100% giảng dạy bằng tiếng Anh, hợp tác cùng các doanh nghiệp hàng đầu trong và ngoài nước.",
    date: "2024-01-08",
    category: "Đào tạo",
    image: "/news/hoi-thao-ute.jpg",
    readTime: "5 phút",
    views: 428,
    tags: ["đào-tạo", "kỹ-sư", "chất-lượng-cao"],
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
  const featured = newsItems[0];
  const spotlight = newsItems;

  return (
    <section className="relative overflow-hidden ">
      <div className=" relative w-full px-32">
        <div className="bg-white  border-1 relative h-[200px] lg:h-[500px] rounded-3xl overflow-hidden mt-20 lg:mt-12">
          <div className="absolute inset-0 p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-1 flex flex-col justify-start text-start lg:text-left space-y-0 lg:space-y-2"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 mx-auto lg:mx-0 w-fit">
                <span className="inline-flex size-2 rounded-full bg-blue-600" />
                Tin tức nổi bật của HCMUTE
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-[46px] font-semibold leading-tight text-gray-900">
                <AuroraText
                  colors={["#0c4ebfff", "#1760dfff", "#ae0303ff"]}
                  className="text-3xl md:text-4xl font-bold text-gray-900  whitespace-nowrap"
                >
                  TIN TỨC &amp; SỰ KIỆN
                </AuroraText>
              </h2>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
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
                "mt-2 [mask-image:linear-gradient(to_top_right,white,transparent,transparent)]"
              )}
            />
            {/* Right Side - Featured News Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex-1 relative flex items-center justify-center lg:justify-end"
            >
              <div className="scale-[0.85]  sm:scale-100 mt-100">
                <NeonGradientCard className="max-w-sm items-center justify-center text-center">
                  <CardSwap
                    width="min(850px, 88vw)"
                    height={360}
                    cardDistance={70}
                    verticalDistance={90}
                    delay={6000}
                    className="w-full max-w-[460px]  sm:max-w-[320px]"
                  >
                    {spotlight.map((item) => (
                      <Card
                        key={item.id}
                        customClass=" !border-gray-300  bg-white/50 overflow-hidden cursor-pointer"
                      >
                        <Link href={`/tin-tuc/${item.id}`} className="block h-full w-full">
                          <div className="relative h-full w-full">
                            <div className="flex flex-col h-full">
                              <div className="rounded-t-3xl bg-transparent backdrop-blur-md flex items-center gap-0 w-full">
                                <img
                                  src="/assets/FLOWER_BLUE_GRADIENT_UTE.png"
                                  className="w-10 h-10 object-contain"
                                  alt="UTE Logo"
                                />
                                <h3 className="text-lg text-start font-bold text-gray-700/85 leading-tight line-clamp-2">
                                  {item.title}
                                </h3>
                              </div>

                              <div className="flex-1 relative">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 420px"
                                />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Card>
                    ))}
                  </CardSwap>
                </NeonGradientCard>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 pt-12 gap-3 lg:gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {newsItems.map((item, index) => (
            <Link key={item.id} href={`/tin-tuc/${item.id}`}>
              <motion.article
                className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 transition-all duration-500 hover:shadow-xl cursor-pointer aspect-[3/4]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative rounded-2xl h-full w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Views Indicator - Top Right */}
                  {item.views && (
                    <div className="absolute top-2 right-2 lg:top-3 lg:right-3 flex items-center gap-1 px-2 py-1 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/20 z-10">
                      <span className="text-[10px] lg:text-xs font-medium text-white">
                        {item.views}
                      </span>
                      <TrendingUp className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white/80" />
                    </div>
                  )}

                  {/* Category Badge - Top Left */}
                  <div className="absolute top-2 left-2 lg:top-3 lg:left-3 z-10">
                    <span className="inline-flex rounded-2xl items-center px-2 py-1 lg:px-2.5 lg:py-1 bg-white/95 backdrop-blur-sm text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-gray-800 border border-white/30 shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Content Overlay - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                    {/* Date */}
                    <div className="flex items-center justify-end mb-1.5 lg:mb-2">
                      <span className="text-[10px] lg:text-xs font-medium text-white/80">
                        {formatDate(item.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm lg:text-base font-bold text-white leading-tight line-clamp-2 mb-1.5">
                      {item.title}
                    </h3>

                    {/* Tags - Hidden on mobile */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="hidden lg:flex flex-wrap items-center gap-1.5 mb-2">
                        {item.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex rounded-xl items-center gap-0.5 px-1.5 py-0.5 bg-white/20 backdrop-blur-sm text-[10px] font-medium text-white border border-white/30"
                          >
                            <Hash className="w-2 h-2" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read Time */}
                    <div className="flex items-center gap-1 text-[10px] lg:text-xs text-white/70">
                      <Clock className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                      {item.readTime}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-10">
                    <div className="flex items-center gap-1.5 text-white text-sm lg:text-base font-semibold">
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 mb-8 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-gray-200 bg-white px-8 py-6 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Khám phá toàn bộ tin tức, sự kiện và thông báo từ HCMUTE.
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật những hoạt động mới nhất của trường
            </p>
          </div>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 rounded-3xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md group"
          >
            Xem tất cả tin tức
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}