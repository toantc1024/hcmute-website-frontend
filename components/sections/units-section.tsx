"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AuroraText } from "@/components/ui/aurora-text";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { MagicCard } from "@/components/ui/magic-card";

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
      <section id="units" className="py-12 lg:py-20 bg-white overflow-hidden">
        <div className="w-full px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40">
          <motion.div
            className="text-center mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl sm:text-2xl text-center md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              <AuroraText
                className="px-2"
                colors={["#0c4ebfff", "#1760dfff", "#ae0303ff"]}
              >
                ĐƠN VỊ HCM-UTE
              </AuroraText>
            </h2>

            <div className="flex justify-center mt-8">
              <AnimatedTabs
                items={tabItems}
                activeIndex={activeTab}
                onTabChange={setActiveTab}
                className="w-full max-w-3xl rounded-rounded"
                layoutId="units-tab-indicator"
              />
            </div>
          </motion.div>

          <div className="mt-8 flex justify-between relative">
            {canScrollPrev && (
              <div className="flex items-center pr-4">
                <button
                  className="bg-white hover:bg-gray-100 rounded-full p-3 border border-gray-200 shadow-md transition-all duration-200 flex items-center justify-center"
                  onClick={() => carouselApi?.scrollPrev()}
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            )}

            <Carousel
              key={activeTab}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
              setApi={setCarouselApi}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {UNIT_GROUPS[activeTab]?.items.map((unit, index) => (
                  <CarouselItem
                    key={unit.name}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Link href={unit.href}>
                      <div className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-5xl lg:text-6xl font-bold text-white/20">
                              {unit.initials}
                            </span>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                          <h3 className="text-white text-sm lg:text-base font-bold mb-1 line-clamp-2 group-hover:underline">
                            {unit.name}
                          </h3>
                          <p className="text-white/90 text-xs lg:text-sm line-clamp-2">
                            {unit.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {canScrollNext && (
              <div className="flex items-center pl-4">
                <button
                  className="bg-white hover:bg-gray-100 rounded-full p-3 border border-gray-200 shadow-md transition-all duration-200 flex items-center justify-center"
                  onClick={() => carouselApi?.scrollNext()}
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            )}
          </div>
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
