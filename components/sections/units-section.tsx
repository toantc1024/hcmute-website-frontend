"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AuroraText } from "@/components/ui/aurora-text";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { Container } from "@/components/layout";
import { CarouselNavButton } from "@/components/blocks/carousel-nav-button";

const FLOWER_BLUE = "/assets/FLOWER_BLUE_GRADIENT_UTE.png";

interface Unit {
  name: string;
  description: string;
  href: string;
  initials: string;
  logo?: string;
}

interface UnitGroup {
  title: string;
  items: Unit[];
}

const UNIT_GROUPS: UnitGroup[] = [
  {
    title: "Khoa Viện",
    items: [
      {
        name: "Khoa Cơ khí Chế tạo máy",
        description: "Trọng tâm vào cơ khí, chế tạo máy và công nghệ vật liệu.",
        href: "/khoa/co-khi-che-tao-may",
        initials: "ME",
      },
      {
        name: "Khoa Điện – Điện tử",
        description: "Đào tạo kỹ sư điện, điện tử, viễn thông và tự động hóa.",
        href: "/khoa/dien-dien-tu",
        initials: "DEE",
      },
      {
        name: "Khoa Cơ khí Động lực",
        description: "Đào tạo kỹ sư cơ khí động lực, ô tô và máy móc.",
        href: "/khoa/co-khi-dong-luc",
        initials: "AE",
      },
      {
        name: "Khoa In & Truyền thông",
        description: "Công nghệ in, truyền thông và thiết kế đồ họa.",
        href: "/khoa/in-truyen-thong",
        initials: "PRT",
      },
      {
        name: "Khoa Công nghệ Thông tin",
        description: "Các ngành CNTT, khoa học dữ liệu, trí tuệ nhân tạo.",
        href: "/khoa/cong-nghe-thong-tin",
        initials: "IT",
      },
      {
        name: "Khoa Xây dựng",
        description: "Kỹ thuật xây dựng, kiến trúc và quy hoạch đô thị.",
        href: "/khoa/xay-dung",
        initials: "CE",
      },
    ],
  },
  {
    title: "Phòng Ban",
    items: [
      {
        name: "Phòng Đào tạo",
        description: "Quản lý chương trình đào tạo, lịch học và hồ sơ học vụ.",
        href: "/phong/dao-tao",
        initials: "DT",
      },
      {
        name: "Phòng Khoa học Công nghệ",
        description: "Quản lý hoạt động nghiên cứu khoa học và công nghệ.",
        href: "/phong/khoa-hoc-cong-nghe",
        initials: "KHCN",
      },
      {
        name: "Phòng Tổ chức Hành chính",
        description: "Quản lý tổ chức, hành chính và nhân sự.",
        href: "/phong/to-chuc-hanh-chinh",
        initials: "TCHC",
      },
      {
        name: "Phòng Tuyển sinh và Công tác Sinh viên",
        description: "Tuyển sinh, hỗ trợ sinh viên và hoạt động đoàn thể.",
        href: "/phong/tuyen-sinh-cong-tac-sinh-vien",
        initials: "TSCTSV",
      },
    ],
  },
  {
    title: "Trung Tâm",
    items: [
      {
        name: "Trung tâm Tin học",
        description: "Đào tạo và hỗ trợ công nghệ thông tin, tin học.",
        href: "/trung-tam/tin-hoc",
        initials: "TH",
      },
      {
        name: "Trung tâm Ngoại ngữ",
        description:
          "Đào tạo ngoại ngữ, chứng chỉ quốc tế và giao lưu văn hóa.",
        href: "/trung-tam/ngoai-ngu",
        initials: "NN",
      },
      {
        name: "Trung tâm Robot Thông minh",
        description: "Nghiên cứu và phát triển robot thông minh.",
        href: "/trung-tam/robot-thong-minh",
        initials: "RTM",
      },
    ],
  },
  {
    title: "Tổ Chức Đoàn Thể",
    items: [
      {
        name: "Đoàn Thanh niên",
        description:
          "Tổ chức các hoạt động thanh niên, tình nguyện và phong trào.",
        href: "/doan-thanh-nien",
        initials: "YOUTH",
      },
      {
        name: "Hội Sinh viên",
        description:
          "Đại diện quyền lợi sinh viên, tổ chức hoạt động và sự kiện.",
        href: "/hoi-sinh-vien",
        initials: "SVU",
      },
      {
        name: "Công Đoàn",
        description: "Bảo vệ quyền lợi cán bộ, tổ chức hoạt động đoàn thể.",
        href: "/cong-doan",
        initials: "UNION",
      },
    ],
  },
];

export default function UnitsSection() {
  const [selectedGroup, setSelectedGroup] = useState<UnitGroup | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const tabItems = UNIT_GROUPS.map((group, index) => ({
    label: group.title,
    value: index,
  }));

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateScrollState = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    updateScrollState();
    carouselApi.on("select", updateScrollState);
    carouselApi.on("reInit", updateScrollState);

    return () => {
      carouselApi.off("select", updateScrollState);
      carouselApi.off("reInit", updateScrollState);
    };
  }, [carouselApi]);

  return (
    <>
      <section id="units" className="bg-white overflow-hidden">
        <Container>
          <motion.div
            className="mb-10 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-center gap-3 mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                <AuroraText
                  className="px-3"
                  colors={["#0c4ebfff", "#1760dfff", "#ae0303ff"]}
                >
                  ĐƠN VỊ HCM-UTE
                </AuroraText>
              </h2>
            </div>

            <div className="flex justify-center mt-2">
              <AnimatedTabs
                items={tabItems}
                activeIndex={activeTab}
                onTabChange={setActiveTab}
                className="w-full max-w-3xl"
                layoutId="units-tab-indicator"
              />
            </div>
          </motion.div>
        </Container>

        {/* Full-width carousel area with hover-to-show nav */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Prev button — overlays on left edge, show on hover */}
          <div
            className={`absolute px-2 pb-4 left-6 sm:left-12 lg:left-24 xl:left-32 2xl:left-64 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${
              isHovering && canScrollPrev
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-3 pointer-events-none"
            }`}
          >
            <CarouselNavButton
              direction="prev"
              onClick={() => carouselApi?.scrollPrev()}
            />
          </div>

          {/* Next button — overlays on right edge, show on hover */}
          <div
            className={`absolute px-2 pb-4 right-6 sm:right-12 lg:right-24 xl:right-32 2xl:right-64 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${
              isHovering && canScrollNext
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-3 pointer-events-none"
            }`}
          >
            <CarouselNavButton
              direction="next"
              onClick={() => carouselApi?.scrollNext()}
            />
          </div>

          <Container>
            <Carousel
              key={activeTab}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
              setApi={setCarouselApi}
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {UNIT_GROUPS[activeTab]?.items.map((unit) => (
                  <CarouselItem
                    key={unit.name}
                    className="pl-3 md:pl-4 basis-[80%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Link href={unit.href} className="block h-full">
                      <MagicCard
                        className="h-full border border-gray-100 hover:border-blue-200 transition-all duration-300 group/card"
                        gradientColor="from-blue-500 via-blue-600 to-indigo-600"
                      >
                        <div className="relative h-52 rounded-2xl overflow-hidden">
                          {/* Background gradient with initials */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-5xl lg:text-6xl font-bold text-white/15 select-none">
                                {unit.initials}
                              </span>
                            </div>
                          </div>

                          {/* UTE Flower watermark on hover */}
                          <div className="absolute top-3 right-3 w-8 h-8 opacity-0 group-hover/card:opacity-20 transition-all duration-500 group-hover/card:rotate-12 pointer-events-none">
                            <Image
                              src={FLOWER_BLUE}
                              alt=""
                              fill
                              className="object-contain brightness-200"
                            />
                          </div>

                          {/* Dark overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                          {/* Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                            <h3 className="text-white text-sm lg:text-base font-bold mb-1.5 line-clamp-2 group-hover/card:underline decoration-blue-300 underline-offset-2">
                              {unit.name}
                            </h3>
                            <p className="text-white/80 text-xs lg:text-sm line-clamp-2 leading-relaxed">
                              {unit.description}
                            </p>
                          </div>

                          {/* Shimmer sweep on hover */}
                          <div className="absolute inset-0 -translate-x-full group-hover/card:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                          {/* Border beam on hover */}
                          <div className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                            <BorderBeam
                              size={120}
                              duration={4}
                              colorFrom="#60a5fa"
                              colorTo="#3b82f6"
                              borderWidth={2}
                            />
                          </div>
                        </div>
                      </MagicCard>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </Container>
        </div>
      </section>

      <AnimatePresence>
        {selectedGroup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGroup(null)}
            />
            <motion.div
              className="fixed inset-0 z-[110] flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
                <div className="px-8 py-6 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-white">
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-1">
                      {selectedGroup.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="p-2 hover:bg-gray-100/80 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-gray-50/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedGroup.items.map((unit) => (
                      <Link
                        key={unit.name}
                        href={unit.href}
                        onClick={() => setSelectedGroup(null)}
                        className="group"
                      >
                        <MagicCard
                          className="h-full p-5 bg-white/80 hover:bg-white transition-all duration-300 border-0 shadow-none hover:shadow-lg"
                          gradientColor="from-blue-500 via-blue-600 to-blue-700"
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-bold text-sm">
                                  {unit.initials}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-foreground text-base leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {unit.name}
                                </h4>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed flex-1">
                              {unit.description}
                            </p>
                          </div>
                        </MagicCard>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
