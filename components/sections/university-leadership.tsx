"use client";

import { motion } from "motion/react";
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
      (prev) => (prev - 1 + leadershipData.length) % leadershipData.length
    );
  };

  const currentLeader = leadershipData[currentSlide];

  return (
    <section id="leadership" className="py-12 lg:py-20 relative overflow-hidden">
      <div className="w-full px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 relative">
        <motion.div
          className="text-center  mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
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

      <div className="relative pt-8 lg:pt-16">
        <div className="absolute top-0 left-6 sm:left-12 lg:left-24 xl:left-32 2xl:left-40 z-30 flex space-x-2">
          <button
            onClick={prevSlide}
            className="bg-white hover:bg-gray-100 rounded-full p-2 sm:p-3 border border-gray-200 shadow-md transition-all duration-200 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="bg-white hover:bg-gray-100 rounded-full p-2 sm:p-3 border border-gray-200 shadow-md transition-all duration-200 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>

        <div className="relative w-full bg-blue-600 min-h-[280px] md:min-h-[360px]">
          <motion.div
            key={`bg-${currentSlide}`}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={AGENT_BACKGROUND}
              alt="Background"
              fill
              className="object-cover"
            />
          </motion.div>

          <div className="relative z-10 h-full min-h-[280px] md:min-h-[360px] flex items-center">
            <div className="px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 w-full">
              <div className="flex items-center justify-center lg:justify-start">
                <motion.div
                  key={currentSlide}
                  className="text-white text-center lg:text-left max-w-xl lg:max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                    {currentLeader.name}
                  </h3>
                  <p className="text-blue-100 text-sm sm:text-base lg:text-lg font-medium mb-3">
                    {currentLeader.position}
                  </p>

                  <p className="text-blue-100 font-bold leading-relaxed text-xs sm:text-sm lg:text-base">
                    <Quote className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2 mb-1 text-blue-200" />
                    {currentLeader.description}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            key={`image-${currentSlide}`}
            className="hidden lg:block absolute right-24 xl:right-32 2xl:right-40 bottom-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Image
              src={currentLeader.image}
              alt={currentLeader.name}
              width={400}
              height={500}
              className="h-[380px] xl:h-[450px] 2xl:h-[500px] w-auto object-contain object-bottom"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
