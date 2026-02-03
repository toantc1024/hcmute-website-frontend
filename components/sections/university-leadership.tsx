"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { AuroraText } from "@/components/ui/aurora-text";

const AGENT_BACKGROUND = "/assets/agent-cta-background.webp";

const leadershipData = [
  {
    name: "TS. Trương Thị Hiền",
    position: "Bí thư Đảng uỷ, Chủ tịch Hội đồng Trường",
    image: "/PGS_TS_THH.png",
    description:
      "Nhà trường xây dựng môi trường học tập thân thiện, năng động, hội nhập và giàu trải nghiệm, giúp các em rèn luyện toàn diện cả tri thức, kỹ năng và bản lĩnh.",
  },
  {
    name: "PGS. TS. Lê Hiếu Giang",
    position: "Phó Bí thư Đảng uỷ, Hiệu trưởng Nhà trường",
    image: "/PGS_TS_LGH.png",
    description:
      "Bằng tinh thần trách nhiệm xã hội cao nhất, Nhà trường cam kết mang đến cho người học và xã hội những giá trị khoa học và nhân bản xứng tầm để HCM-UTE luôn là sự lựa chọn của những sinh viên tài năng, có khát vọng học hỏi vươn lên, kiên trì với mục tiêu và hoài bão của mình để làm giàu cho bản thân, gia đình và xã hội.",
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
      className="py-12 lg:py-20 relative overflow-hidden"
    >
      <div className="w-full px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 relative">
        <motion.div
          className="text-center mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            LÃNH ĐẠO CỦA
            <AuroraText className="px-2" colors={["#002e7dff", "#ae0303ff"]}>
              HCM-UTE
            </AuroraText>
          </h2>
          <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Đội ngũ lãnh đạo giàu kinh nghiệm, tận tâm với sự nghiệp giáo dục và
            phát triển nhân tài
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Navigation buttons - on top */}
        <div className="w-full px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 pb-4 relative z-20">
          <div className="flex justify-center lg:justify-start gap-3">
            <button
              onClick={prevSlide}
              className="bg-white hover:bg-gray-50 rounded-full p-2.5 sm:p-3 border border-gray-200 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="bg-white hover:bg-gray-50 rounded-full p-2.5 sm:p-3 border border-gray-200 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Blue background section */}
        <div className="relative w-full bg-blue-600">
          <div className="absolute  scale-[1.45] inset-0 w-full h-full">
            <Image
              src={AGENT_BACKGROUND}
              alt="Background"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10">
            <div className="px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 w-full">
              {/* Mobile layout: vertical stack - text on top, image below */}
              <div className="flex flex-col lg:hidden">
                {/* Text content - Top on mobile */}
                <div className="pt-8 pb-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      className="text-white text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">
                        {currentLeader.name}
                      </h3>
                      <p className="text-blue-100 text-sm sm:text-base font-medium mb-4">
                        {currentLeader.position}
                      </p>
                      <p className="text-blue-100 leading-relaxed text-sm sm:text-base max-w-md mx-auto">
                        <Quote className="inline w-4 h-4 mr-2 mb-1 text-blue-200" />
                        {currentLeader.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Leader image - Bottom on mobile, centered */}
                <div className="flex justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`image-mobile-${currentSlide}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={currentLeader.image}
                        alt={currentLeader.name}
                        width={400}
                        height={500}
                        className="h-[200px] sm:h-[240px] md:h-[280px] w-auto object-contain object-bottom"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop layout: side by side - text left, image right */}
              <div className="hidden lg:flex lg:items-end lg:gap-8 xl:gap-12">
                {/* Text content - Left side, vertically centered */}
                <div className="flex-1 py-12 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`desktop-${currentSlide}`}
                      className="text-white text-left w-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-3xl xl:text-4xl font-bold mb-2">
                        {currentLeader.name}
                      </h3>
                      <p className="text-blue-100 text-lg font-medium mb-4">
                        {currentLeader.position}
                      </p>
                      <p className="text-blue-100 leading-relaxed text-base lg:text-lg max-w-xl">
                        <Quote className="inline w-5 h-5 mr-2 mb-1 text-blue-200" />
                        {currentLeader.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Leader image - Right side, anchored to bottom */}
                <div className="flex-shrink-0">
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
                        width={400}
                        height={500}
                        className="h-[360px] xl:h-[400px] 2xl:h-[440px] w-auto object-contain object-bottom"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
