"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArrowButton from "@/components/blocks/arrow-button";
import Image from "next/image";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "Trường Đại học Sư phạm Kỹ Thuật TP. Hồ Chí Minh",
    subtitle: "Tiên phong trong giáo dục kỹ thuật",
    description:
      "Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực kỹ thuật và công nghệ, đáp ứng nhu cầu phát triển của đất nước.",
    image: "/carousel/1.jpg",
    cta: "Tìm hiểu thêm",
    ctaLink: "/gioi-thieu",
  },
  {
    id: 2,
    title: "Nghiên cứu Khoa học",
    subtitle: "Đổi mới sáng tạo",
    description:
      "Phát triển các dự án nghiên cứu ứng dụng, chuyển giao công nghệ và hợp tác với doanh nghiệp để tạo ra giá trị thực tiễn.",
    image: "/carousel/2.jpg",
    cta: "Khám phá nghiên cứu",
    ctaLink: "/nghien-cuu",
  },
  {
    id: 3,
    title: "Hợp tác Quốc tế",
    subtitle: "Kết nối toàn cầu",
    description:
      "Liên kết với các trường đại học hàng đầu thế giới, tạo cơ hội học tập và nghiên cứu quốc tế cho sinh viên và giảng viên.",
    image: "/carousel/3.jpg",
    cta: "Xem chương trình",
    ctaLink: "/hop-tac",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-x-hidden bg-gray-900">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority
              quality={90}
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 h-full flex items-center">
            <div className="w-full px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <span className="inline-block px-4 py-2 bg-blue-600/90 text-white rounded-full text-sm font-medium mb-6">
                    {slides[currentSlide].subtitle}
                  </span>
                </motion.div>

                <motion.h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {slides[currentSlide].description}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="!text-white rounded-3xl backdrop-blur-md bg-white/20 text-white px-8 py-4 hover:bg-white/30 border-white/30 hover:border-white/50 transition-all duration-300"
                  >
                    {slides[currentSlide].cta}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ArrowButton
        direction="left"
        className="absolute left-6 lg:left-12 xl:left-16 top-1/2 -translate-y-1/2 z-20"
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      />

      <ArrowButton
        className="absolute right-6 lg:right-12 xl:right-16 top-1/2 -translate-y-1/2 z-20"
        direction="right"
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 7, ease: "linear" }}
          key={currentSlide}
        />
      </div>
    </section>
  );
}
