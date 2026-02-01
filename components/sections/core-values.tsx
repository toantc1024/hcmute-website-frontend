"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  Users,
  Globe,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const coreValuesData = [
  {
    title: "#421–430",
    subtitle: "QS Asia 2025 Rankings",
    description:
      "Đứng trong TOP 430 trường đại học tốt nhất châu Á theo bảng xếp hạng QS Asia 2025, khẳng định vị thế và chất lượng giáo dục của HCM-UTE trên bản đồ giáo dục khu vực.",
    icon: Globe,
    color: "text-gray-400",
  },
  {
    title: "Công nghệ 4.0",
    subtitle: "Trung tâm đào tạo xuất sắc",
    description:
      "Trung tâm đào tạo xuất sắc và tài năng về công nghệ 4.0, tiên phong trong việc ứng dụng và phát triển các công nghệ tiên tiến phục vụ cho sự phát triển của xã hội.",
    icon: Lightbulb,
    color: "text-gray-400",
  },
  {
    title: "Năng lượng tái tạo",
    subtitle: "Hydrogen & Green Energy",
    description:
      "Trung tâm đào tạo xuất sắc và tài năng về công nghệ năng lượng tái tạo và năng lượng hydrogen, đóng góp vào mục tiêu phát triển bền vững của đất nước.",
    icon: Users,
    color: "text-gray-400",
  },
  {
    title: "TOP 50",
    subtitle: "Thương hiệu TP.HCM",
    description:
      "TOP 50 đơn vị tiêu biểu có thương hiệu và sản phẩm chủ lực của TP.HCM, được công nhận bởi chính quyền thành phố về những đóng góp xuất sắc cho sự phát triển địa phương.",
    icon: Lightbulb,
    color: "text-gray-400",
  },
];

export default function CoreValues() {
  const [api, setApi] = useState<CarouselApi>();
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  useEffect(() => {
    if (!api) return;

    if (isUserInteracting) return;

    const interval = setInterval(() => {
      if (!api) return;
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api, isUserInteracting]);

  useEffect(() => {
    if (isUserInteracting) {
      const timer = setTimeout(() => {
        setIsUserInteracting(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isUserInteracting]);

  return (
    <section
      id="values"
      className="py-12 lg:py-20 relative bg-white overflow-hidden"
    >
      <div className="px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-start">
          <motion.div
            className="space-y-4 lg:space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              TRIẾT LÝ
              <AuroraText
                className="px-2"
                colors={["#0c4ebfff", "#1760dfff", "#ae0303ff"]}
              >
                GIÁO DỤC
              </AuroraText>
            </h2>
            <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl flex gap-2 font-bold leading-relaxed">
              <div>
                <span style={{ color: "#1760dfff" }}>NHÂN BẢN</span>
                <br />
                <span style={{ color: "#1760dfd3" }}>SÁNG TẠO</span>
                <br />
                <span style={{ color: "#1760dfb3" }}>HỘI NHẬP</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              onMouseEnter={() => setIsUserInteracting(true)}
              onMouseLeave={() => setIsUserInteracting(false)}
              onTouchStart={() => setIsUserInteracting(true)}
            >
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-8xl"
              >
                <CarouselContent className="-ml-4">
                  {coreValuesData.map((value, index) => {
                    const IconComponent = value.icon;
                    return (
                      <CarouselItem
                        key={index}
                        className="pl-4 basis-full sm:basis-1/2"
                      >
                        <div className="h-full">
                          <div className="bg-white rounded-xl p-6 lg:p-8 border transition-shadow duration-300 relative group min-h-[350px] lg:min-h-[400px] h-full flex flex-col justify-between hover:-translate-y-1 transition-transform">
                            <div className="absolute bottom-4 right-4 opacity-20 overflow-hidden">
                              <IconComponent
                                className={`w-20 h-20 lg:w-24 lg:h-24 ${value.color}`}
                              />
                            </div>

                            <div className="relative z-10">
                              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                                {value.title}
                              </h3>
                              <h4 className="text-base lg:text-lg font-semibold text-blue-600 mb-4">
                                {value.subtitle}
                              </h4>
                              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                                {value.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="bg-white hover:bg-gray-100 rounded-full p-3 border border-gray-200 shadow-md transition-all duration-200 flex items-center justify-center"
                    onClick={() => api?.scrollPrev()}
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <button
                    className="bg-white hover:bg-gray-100 rounded-full p-3 border border-gray-200 shadow-md transition-all duration-200 flex items-center justify-center"
                    onClick={() => api?.scrollNext()}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </Carousel>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
