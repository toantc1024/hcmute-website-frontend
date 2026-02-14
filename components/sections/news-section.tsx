"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, ArrowRight, Clock, TrendingUp, Hash } from "lucide-react";
import Image from "next/image";
import CardSwap, { Card } from "@/components/ui/card-swap";
import Link from "next/link";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout";
import { AuroraText } from "../ui/aurora-text";
import { postsApi, type PostAuditView } from "@/lib/api-client";
import { COVER_IMAGE_SIZES } from "@/features/posts/components/image-cropper";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const calculateReadTime = (wordCount: number = 500) => {
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} phút`;
};

export default function NewsSection() {
  const [posts, setPosts] = useState<PostAuditView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await postsApi.getPublishedPosts({ limit: 4 });
        setPosts(response.content);
      } catch (error) {
        console.error("Failed to fetch latest posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <section className="relative overflow-hidden py-12" id="news">
      <Container className="relative">
        <div className="bg-white border-1 relative min-h-[320px] sm:min-h-[380px] lg:h-[500px] rounded-3xl overflow-hidden">
          <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-1 flex flex-col justify-start text-center lg:text-left space-y-1 sm:space-y-2"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-blue-700 mx-auto lg:mx-0 w-fit">
                <span className="inline-flex size-2 rounded-full bg-blue-600 animate-pulse" />
                Tin tức nổi bật của HCM-UTE
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[46px] font-semibold leading-tight text-foreground">
                <AuroraText
                  colors={["#0c4ebfff", "#1760dfff", "#ae0303ff"]}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground whitespace-nowrap"
                >
                  TIN TỨC & SỰ KIỆN
                </AuroraText>
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Hoạt động đào tạo, nghiên cứu và kết nối doanh nghiệp tại Trường
                Đại học Công nghệ Kỹ Thuật TP.HCM.
              </p>
            </motion.div>
            <DotPattern
              width={20}
              height={20}
              cx={1}
              cy={1}
              cr={1}
              className={cn(
                "mt-2 [mask-image:linear-gradient(to_top_right,white,transparent,transparent)]",
              )}
            />
            {/* Right Side - Featured News Cards */}
            {!loading && posts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-1 relative flex items-center justify-center lg:justify-end"
              >
                <div className="relative">
                  {/* Gradient glow behind cards */}
                  <div className="absolute -inset-6 bg-gradient-to-br from-sky-400/35 via-cyan-300/25 to-blue-400/35 rounded-3xl blur-3xl pointer-events-none animate-pulse" />
                  <CardSwap
                    width="min(400px, 80vw)"
                    height={280}
                    cardDistance={50}
                    verticalDistance={60}
                    delay={6000}
                    className="w-full max-w-[360px] sm:max-w-[320px]"
                  >
                    {posts.map((post) => (
                      <Card
                        key={post.id}
                        customClass=" !border-gray-300  bg-white/50 overflow-hidden cursor-pointer"
                      >
                        <Link
                          href={`/tin-tuc/${post.slug}`}
                          className="block h-full w-full"
                        >
                          <div className="relative h-full w-full">
                            <div className="flex flex-col h-full">
                              <div className="rounded-t-3xl bg-transparent backdrop-blur-md flex items-center gap-0 w-full p-2">
                                <img
                                  src="/assets/FLOWER_BLUE_GRADIENT_UTE.png"
                                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                                  alt="UTE Logo"
                                />
                                <h3 className="text-sm sm:text-base lg:text-lg text-start font-bold text-gray-700/85 leading-tight line-clamp-2">
                                  {post.title}
                                </h3>
                              </div>

                              <div className="flex-1 relative">
                                {post.coverImageUrl ? (
                                  <Image
                                    src={post.coverImageUrl}
                                    alt={post.title}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 420px"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <span className="text-white/50 text-2xl font-bold">
                                      HCM-UTE
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Card>
                    ))}
                  </CardSwap>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {!loading && posts.length > 0 && (
          <>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 pt-6 sm:pt-8 lg:pt-12 gap-2 sm:gap-3 lg:gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {posts.map((post, index) => (
                <Link key={post.id} href={`/tin-tuc/${post.slug}`}>
                  <motion.article
                    className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 transition-all duration-500 hover:shadow-xl cursor-pointer"
                    style={{
                      aspectRatio: "16/9", // Same as cover image ratio for consistency
                    }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="relative rounded-3xl h-full w-full overflow-hidden">
                      {post.coverImageUrl ? (
                        <Image
                          src={post.coverImageUrl}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white/50 text-4xl font-bold">
                            HCM-UTE
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Views Indicator - Top Right */}
                      {post.viewCount > 0 && (
                        <div className="absolute top-2 right-2 lg:top-2.5 lg:right-2.5 flex items-center gap-1 px-1.5 py-1 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/20 z-10">
                          <span className="text-[10px] lg:text-xs font-medium text-white">
                            {post.viewCount}
                          </span>
                          <TrendingUp className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white/80" />
                        </div>
                      )}

                      {/* Category Badge - Top Left */}
                      {post.categories?.[0] && (
                        <div className="absolute top-2 left-2 lg:top-2.5 lg:left-2.5 z-10">
                          <span className="inline-flex rounded-2xl items-center px-1.5 py-0.5 lg:px-2 lg:py-1 bg-white/95 backdrop-blur-sm text-[9px] lg:text-[10px] font-semibold uppercase tracking-wider text-gray-800 border border-white/30 shadow-sm">
                            {post.categories[0].name}
                          </span>
                        </div>
                      )}

                      {/* Content Overlay - Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5 lg:p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                        {/* Date */}
                        <div className="flex items-center justify-end mb-0.5 sm:mb-1">
                          <span className="text-[9px] lg:text-[10px] font-medium text-white/80">
                            {formatDate(post.publishedAt || post.createdAt)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xs lg:text-sm font-bold text-white leading-tight line-clamp-2 mb-1">
                          {post.title}
                        </h3>

                        {/* Short Description */}
                        {post.excerpt && (
                          <div
                            className="hidden lg:block text-[10px] text-white/70 line-clamp-2 mb-1"
                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                          />
                        )}

                        {/* Tags - Hidden on mobile */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="hidden lg:flex flex-wrap items-center gap-1 mb-1.5">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex rounded-xl items-center gap-0.5 px-1.5 py-0.5 bg-white/20 backdrop-blur-sm text-[9px] font-medium text-white border border-white/30"
                              >
                                <Hash className="w-2 h-2" />
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Read Time */}
                        <div className="flex items-center gap-0.5 text-[9px] lg:text-[10px] text-white/70">
                          <Clock className="w-2 h-2 lg:w-2.5 lg:h-2.5" />
                          {calculateReadTime()}
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
              className="mt-6 sm:mt-8 mb-6 sm:mb-8 flex flex-col sm:flex-row flex-wrap items-center sm:items-center justify-between gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-gray-200 bg-white px-5 sm:px-8 py-5 sm:py-6 shadow-sm text-center sm:text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Khám phá toàn bộ tin tức, sự kiện và thông báo từ HCM-UTE.
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Cập nhật những hoạt động mới nhất của trường
                </p>
              </div>
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-2 rounded-2xl sm:rounded-3xl border border-gray-200 bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md group"
              >
                Xem tất cả tin tức
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </>
        )}
      </Container>
    </section>
  );
}
