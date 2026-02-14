"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, ArrowRight, Eye } from "lucide-react";
import Image from "next/image";
import CardSwap, { Card } from "@/components/ui/card-swap";
import Link from "next/link";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout";
import { AuroraText } from "../ui/aurora-text";
import { postsApi, type PostAuditView } from "@/lib/api-client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { CarouselNavButton } from "@/components/blocks/carousel-nav-button";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ------------------------------------------------------------------ */
/*  Carousel nav — rendered inside Carousel context, shown on hover   */
/* ------------------------------------------------------------------ */
function NewsCarouselNav({ visible }: { visible: boolean }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();

  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute left-2 top-1/2 z-20 -translate-y-1/2 transition-all duration-300 sm:left-4 lg:left-16 xl:left-24 2xl:left-56",
          visible && canScrollPrev
            ? "pointer-events-auto translate-x-0 opacity-100"
            : "-translate-x-4 opacity-0",
        )}
      >
        <CarouselNavButton direction="prev" onClick={scrollPrev} size="md" />
      </div>
      <div
        className={cn(
          "pointer-events-none absolute right-2 top-1/2 z-20 -translate-y-1/2 transition-all duration-300 sm:right-4 lg:right-16 xl:right-24 2xl:right-56",
          visible && canScrollNext
            ? "pointer-events-auto translate-x-0 opacity-100"
            : "translate-x-4 opacity-0",
        )}
      >
        <CarouselNavButton direction="next" onClick={scrollNext} size="md" />
      </div>
    </>
  );
}

export default function NewsSection() {
  const [posts, setPosts] = useState<PostAuditView[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await postsApi.getPublishedPosts({ limit: 10 });
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
            {/* Section header — "SỰ KIỆN NỔI BẬT" + "Xem thêm" */}
            <motion.div
              className="flex items-center justify-between gap-4 pt-8 sm:pt-10 lg:pt-14 pb-4 sm:pb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-neutral-900 italic sm:text-xl md:text-2xl">
                SỰ KIỆN NỔI BẬT
              </h3>
              <Link
                href="/tin-tuc"
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                Xem thêm
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </>
        )}
      </Container>

      {/* Full-width carousel — edge-to-edge, cards aligned with container */}
      {!loading && posts.length > 0 && (
        <div
          className="relative pb-8 sm:pb-10"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 pl-6 pr-6 sm:-ml-4 sm:pl-12 sm:pr-12 lg:pl-24 lg:pr-24 xl:pl-32 xl:pr-32 2xl:pl-64 2xl:pr-64">
              {posts.map((post) => (
                <CarouselItem
                  key={post.id}
                  className="pl-3 sm:pl-4 basis-[70%] sm:basis-[40%] md:basis-[32%] lg:basis-[26%] xl:basis-[22%]"
                >
                  <Link href={`/tin-tuc/${post.slug}`} className="group block">
                    <article className="overflow-hidden rounded-xl bg-white">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                        {post.coverImageUrl ? (
                          <Image
                            src={post.coverImageUrl}
                            alt={post.title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 26vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
                            <span className="text-2xl font-bold text-white/20">
                              HCM-UTE
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Text below image */}
                      <div className="flex flex-col gap-1.5 pt-3 pb-1">
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 sm:text-base">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] text-neutral-400 sm:text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.publishedAt || post.createdAt)}
                          </span>
                          {post.viewCount > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.viewCount.toLocaleString("vi-VN")}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Hover nav buttons */}
            <NewsCarouselNav visible={isHovering} />
          </Carousel>
        </div>
      )}

      <Container>
        {!loading && posts.length > 0 && (
          <motion.div
            className="mb-6 sm:mb-8 flex flex-col sm:flex-row flex-wrap items-center sm:items-center justify-between gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-gray-200 bg-white px-5 sm:px-8 py-5 sm:py-6 shadow-sm text-center sm:text-left"
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
        )}
      </Container>
    </section>
  );
}
