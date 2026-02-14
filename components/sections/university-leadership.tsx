"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Quote } from "lucide-react";
import Image from "next/image";
import { AuroraText } from "@/components/ui/aurora-text";
import { Container } from "@/components/layout";
import { CarouselNavButton } from "@/components/blocks/carousel-nav-button";

const AGENT_BACKGROUND = "/assets/agent-cta-background.webp";

const leadershipData = [
  {
    name: "PGS. TS. Lê Hiếu Giang",
    position: "Phó Bí thư Đảng uỷ, Hiệu trưởng Nhà trường",
    image: "/PGS_TS_LGH.png",
    description:
      "Bằng tinh thần trách nhiệm xã hội cao nhất, Nhà trường cam kết mang đến cho người học và xã hội những giá trị khoa học và nhân bản xứng tầm để HCM-UTE luôn là sự lựa chọn của những sinh viên tài năng, có khát vọng học hỏi vươn lên, kiên trì với mục tiêu và hoài bão của mình để làm giàu cho bản thân, gia đình và xã hội.",
  },
  {
    name: "TS. Trương Thị Hiền",
    position: "Bí thư Đảng uỷ, Chủ tịch Hội đồng Trường",
    image: "/PGS_TS_THH.png",
    description:
      "Nhà trường xây dựng môi trường học tập thân thiện, năng động, hội nhập và giàu trải nghiệm, giúp các em rèn luyện toàn diện cả tri thức, kỹ năng và bản lĩnh.",
  },
];

export default function UniversityLeadership() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % leadershipData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + leadershipData.length) % leadershipData.length,
    );
  };

  const currentLeader = leadershipData[currentSlide];

  return (
    <section
      id="leadership"
      className="py-8 sm:py-12 relative overflow-visible"
    >
      <Container className="relative">
        {/* Header section */}
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left lg:justify-between mb-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2">
              LÃNH ĐẠO CỦA
              <AuroraText className="px-2" colors={["#002e7dff", "#ae0303ff"]}>
                HCM-UTE
              </AuroraText>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              Đội ngũ lãnh đạo giàu kinh nghiệm, tận tâm{" "}
              <br className="hidden sm:block" />
              với sự nghiệp giáo dục và phát triển nhân tài
            </p>
          </motion.div>

          {/* Navigation buttons - below title on mobile, right side on desktop */}
          <div className="flex gap-3 flex-shrink-0 mt-3 lg:mt-0">
            <CarouselNavButton direction="prev" onClick={prevSlide} />
            <CarouselNavButton direction="next" onClick={nextSlide} />
          </div>
        </div>
      </Container>

      <div className="relative">
        {/* Blue background section */}
        <div className="relative w-full bg-blue-600 overflow-visible">
          <div className="absolute scale-[1.2] inset-0 w-full h-full">
            <Image
              src={AGENT_BACKGROUND}
              alt="Background"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10">
            <Container className="w-full">
              {/* Mobile layout: text on top, image at bottom */}
              <div className="flex flex-col lg:hidden">
                {/* Text content - Top on mobile */}
                <div className="pt-6 pb-2 sm:pt-8 sm:pb-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      className="text-white text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-lg sm:text-xl font-bold mb-1">
                        {currentLeader.name}
                      </h3>
                      <p className="text-blue-100 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                        {currentLeader.position}
                      </p>
                      <p className="text-blue-100 leading-relaxed text-xs sm:text-sm max-w-sm mx-auto line-clamp-4">
                        <Quote className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 mb-0.5 text-blue-200" />
                        {currentLeader.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Leader image - Bottom on mobile, centered */}
                <div className="flex justify-center items-end">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`image-mobile-${currentSlide}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={currentLeader.image}
                        alt={currentLeader.name}
                        width={500}
                        height={600}
                        className="h-[180px] sm:h-[220px] md:h-[260px] w-auto object-contain object-bottom"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop layout: side by side - text left, image right */}
              <div className="hidden lg:flex lg:items-end lg:gap-8 xl:gap-12">
                {/* Text content - Left side, vertically centered */}
                <div className="flex-1 py-10 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`desktop-${currentSlide}`}
                      className="text-white text-left w-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-2xl xl:text-3xl font-bold mb-2">
                        {currentLeader.name}
                      </h3>
                      <p className="text-blue-100 text-base font-medium mb-3">
                        {currentLeader.position}
                      </p>
                      <p className="text-blue-100 leading-relaxed text-sm lg:text-base max-w-lg">
                        <Quote className="inline w-4 h-4 mr-2 mb-1 text-blue-200" />
                        {currentLeader.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Leader image - Right side, anchored to bottom, head overflows top */}
                <div className="flex-shrink-0 -mt-16">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`image-desktop-${currentSlide}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={currentLeader.image}
                        alt={currentLeader.name}
                        width={500}
                        height={650}
                        className="h-[340px] xl:h-[380px] 2xl:h-[420px] w-auto object-contain object-bottom"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}
