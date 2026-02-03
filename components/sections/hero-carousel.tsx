"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    title: "Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh",
    subtitle: "Tiên phong trong giáo dục kỹ thuật",
    description:
      "Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực kỹ thuật và công nghệ, đáp ứng nhu cầu phát triển của đất nước.",
    image: "/carousel/image.png",
    cta: "Tìm hiểu thêm",
    ctaLink: "/gioi-thieu",
  },
  {
    id: 2,
    title: "Nghiên cứu Khoa học",
    subtitle: "Đổi mới sáng tạo",
    description:
      "Phát triển các dự án nghiên cứu ứng dụng, chuyển giao công nghệ và hợp tác với doanh nghiệp để tạo ra giá trị thực tiễn.",
    image: "/carousel/image copy.png",
    cta: "Khám phá nghiên cứu",
    ctaLink: "/nghien-cuu",
  },
  {
    id: 3,
    title: "Hợp tác Quốc tế",
    subtitle: "Kết nối toàn cầu",
    description:
      "Liên kết với các trường đại học hàng đầu thế giới, tạo cơ hội học tập và nghiên cứu quốc tế cho sinh viên và giảng viên.",
    image: "/carousel/image copy 2.png",
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
    <section
      id="hero"
      className="group/carousel relative w-full overflow-x-hidden bg-gray-900"
      style={{ aspectRatio: "2560/854" }}
    >
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
              className="object-cover object-center"
              priority
              quality={90}
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow buttons - only visible on hover, positioned at edges */}
      <ArrowButton
        direction="left"
        className="absolute left-2 sm:left-3 md:left-4 lg:left-6 xl:left-8 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      />

      <ArrowButton
        className="absolute right-2 sm:right-3 md:right-4 lg:right-6 xl:right-8 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
        direction="right"
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      />

      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[10] flex space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
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
