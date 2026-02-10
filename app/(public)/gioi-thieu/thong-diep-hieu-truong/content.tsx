"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AuroraText } from "@/components/ui/aurora-text";
import { GridPattern } from "@/components/ui/grid-pattern";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { BorderBeam } from "@/components/ui/border-beam";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FLOWER_ICON = "/assets/FLOWER_BLUE_GRADIENT_UTE.png";

const contentSections = [
  {
    id: "history",
    title: "Lịch sử & Tự hào",
    content: `Tự hào với lịch sử hơn 60 năm hình thành và phát triển vẻ vang (05/10/1962 – 05/10/2025), Trường Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí Minh (HCM-UTE) luôn vững vàng tiến bước với tầm vóc và niềm tin. Xuyên suốt chiều dài lịch sử, các thế hệ giảng viên và cán bộ viên chức của Nhà trường đã không ngừng nỗ lực phấn đấu vì mục tiêu và lý tưởng cao đẹp của sự nghiệp giáo dục nước nhà. Sự tận tâm cống hiến và tinh thần đoàn kết đầy kiêu hãnh của tập thể sư phạm nhà trường hòa cùng những đóng góp quý báu của hàng trăm nghìn cựu sinh viên qua các thời kỳ, những người đã và đang giữ những vị trí quan trọng trong xã hội đã làm nên danh tiếng và hình ảnh HCM-UTE hôm nay.`,
    image: "/assets/leader-note/1.jpg",
    highlight: "60 năm hình thành và phát triển",
  },
  {
    id: "mission",
    title: "Sứ mệnh & Phát triển",
    content: `Phát huy giá trị truyền thống tốt đẹp ấy, những năm qua HCM-UTE kiên trì vun đắp cho một nền tảng vững bền về uy tín, thương hiệu và hoàn thành xuất sắc sứ mệnh của mình trong đào tạo nguồn nhân lực chất lượng cao, nghiên cứu khoa học và chuyển giao công nghệ, góp phần xứng đáng vào sự phát triển kinh tế, xã hội của đất nước. Trong bối cảnh của nền kinh tế số và toàn cầu hóa, Trường đã có bước chuyển mình mạnh mẽ, đổi mới toàn diện để hôm nay HCM-UTE khoác lên mình diện mạo mới đầy trẻ trung, năng động và hiện đại, vươn đến tầm cao mới của một trường đại học đa ngành theo định hướng ứng dụng với những thành tựu khoa học công nghệ vượt trội.`,
    image: "/assets/leader-note/2.png",
    highlight: "Diện mạo mới đầy trẻ trung, năng động và hiện đại",
  },
  {
    id: "vision",
    title: "Tầm nhìn & Mục tiêu",
    content: `Với tầm nhìn trở thành trường đại học tự chủ toàn diện, trung tâm đào tạo, nghiên cứu khoa học, đổi mới sáng tạo và khởi nghiệp hàng đầu Việt Nam, ngang tầm với các trường đại học uy tín trong khu vực và thế giới, HCM-UTE dành sự đầu tư xứng tầm cho nguồn nhân lực chất lượng cao, khai thác tối đa các nguồn lực và thế mạnh của Nhà trường, tăng cường hội nhập quốc tế, thúc đẩy nghiên cứu và đổi mới sáng tạo. Với đội ngũ giảng viên có trình độ chuyên môn cao, cơ sở vật chất và không gian học tập hiện đại, chất lượng đào tạo đạt chuẩn quốc gia và khu vực, HCM-UTE đã trở thành địa chỉ đáng tin cậy, thu hút nhiều học sinh trên cả nước lựa chọn.`,
    image: "/assets/leader-note/3.jpg",
    quote: "Trở thành trường đại học tự chủ toàn diện hàng đầu Việt Nam",
  },
  {
    id: "commitment",
    title: "Cam kết với Người học",
    content: `Hằng năm, hơn 40.000 thí sinh từ các trường phổ thông trên khắp cả nước đăng ký dự tuyển vào HCM-UTE tìm cho mình cơ hội trong hơn 6.000 chỉ tiêu tuyển sinh của Trường. Nhà trường luôn tạo điều kiện tốt nhất cho người học để phát huy năng lực học tập, nghiên cứu, khơi dậy niềm đam mê sáng tạo và tinh thần khởi nghiệp. Với phương châm “Nhà trường luôn đồng hành cùng người học và không để ai bị bỏ lại phía sau”, Nhà trường luôn thấu hiểu, sẻ chia và hỗ trợ kịp thời để có thể giúp định hướng cao nhất về học tập và sự nghiệp vững vàng trong tầm tay các em sinh viên.`,
    image: "/assets/leader-note/4.jpg",
    quote:
      "Nhà trường luôn đồng hành cùng người học và không để ai bị bỏ lại phía sau",
  },
  {
    id: "cooperation",
    title: "Hợp tác & Kết nối",
    content: `HCM-UTE đã khẳng định danh tiếng và vị thế ngày càng được nâng cao của mình trong xã hội với mạng lưới quan hệ doanh nghiệp lên đến hơn 1.600 công ty đối tác trong và ngoài nước. Từ mạng lưới này, hằng năm, hàng nghìn cơ hội việc làm đến với sinh viên. Nhiều tập đoàn đa quốc gia hàng đầu thế giới ký kết hợp tác và tài trợ thiết bị kỹ thuật cho các phòng thí nghiệm, xưởng thực hành, trung tâm nghiên cứu và chuyển giao công nghệ tại Trường với giá trị lên đến hàng trăm tỷ đồng. Bệ đỡ vững chắc giúp sinh viên có cơ hội học tập trong môi trường quốc tế thông qua hệ thống hợp tác quốc tế rộng lớn giữa Nhà trường và nhiều trường đại học danh tiếng trên thế giới.`,
    image: "/assets/leader-note/5.jpg",
    highlight: "Mạng lưới doanh nghiệp lên đến hơn 1.600 đối tác",
  },
  {
    id: "conclusion",
    title: "Lời kết",
    content: `Bằng tinh thần trách nhiệm xã hội cao nhất, Nhà trường cam kết mang đến cho người học và xã hội những giá trị khoa học và nhân văn xứng tầm để HCM-UTE luôn là sự lựa chọn của những sinh viên tài năng, có khát vọng học hỏi vươn lên, kiên trì với mục tiêu và hoài bão của mình để làm giàu cho bản thân, gia đình và xã hội. Cánh cửa HCM-UTE luôn rộng mở chào đón những khát vọng chinh phục đỉnh cao tri thức, tinh thần thời đại, khát khao sẻ chia và trái tim tận hiến cho sự phồn vinh của đất nước.\n\nHCM-UTE đã, đang và sẽ luôn là nơi in đậm dấu ấn của tinh thần đoàn kết, nhân văn, sáng tạo, hội nhập và thành công.`,
    image: "/assets/leader-note/6.JPG",
    isConclusion: true,
  },
];

export default function RectorMessageContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const lineStartRef = useRef<HTMLDivElement>(null);
  const endingBtnRef = useRef<HTMLAnchorElement>(null);
  const highlightStartRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Floating Flower Parallax Effect
      gsap.utils.toArray(".floating-flower").forEach((flower, i) => {
        const speed = 0.3 + (i % 3) * 0.15;
        gsap.to(flower as Element, {
          yPercent: -50 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: flower as Element,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
        // Subtle rotation
        gsap.to(flower as Element, {
          rotation: i % 2 === 0 ? 15 : -15,
          ease: "none",
          scrollTrigger: {
            trigger: flower as Element,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });

      // Hero Grid - Scale in from center
      gsap.fromTo(
        ".hero-grid",
        { scale: 1.3, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: "power2.out",
          delay: 0.5,
        },
      );

      // Background Grid - 3D perspective shift on scroll
      gsap.to(".grid-bg-pattern", {
        "--perspective-origin-y": "70%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
        onUpdate: function () {
          const progress = this.progress();
          const originY = 30 + progress * 40; // 30% → 70%
          const el = document.querySelector(".grid-bg-pattern") as HTMLElement;
          if (el) {
            el.style.perspectiveOrigin = `50% ${originY}%`;
          }
        },
      });

      // Timeline: position line from image bottom to button center
      if (
        timelineRef.current &&
        lineStartRef.current &&
        endingBtnRef.current &&
        containerRef.current
      ) {
        const positionTimeline = () => {
          // Use offset-based calculation (stable, not affected by scroll)
          const container = containerRef.current!;
          const startEl = lineStartRef.current!;
          const btnEl = endingBtnRef.current!;

          // Walk up offsetParents to get absolute offset from container
          let startTop = 0;
          let el: HTMLElement | null = startEl;
          while (el && el !== container) {
            startTop += el.offsetTop;
            el = el.offsetParent as HTMLElement | null;
          }
          const startY = startTop + startEl.offsetHeight;

          let btnTop = 0;
          el = btnEl;
          while (el && el !== container) {
            btnTop += el.offsetTop;
            el = el.offsetParent as HTMLElement | null;
          }
          const endY = btnTop + btnEl.offsetHeight / 2;

          timelineRef.current!.style.top = `${startY}px`;
          timelineRef.current!.style.height = `${endY - startY}px`;
        };

        // Wait for images to load and layout to settle
        const tryPosition = () => {
          positionTimeline();
          // Re-check after images may have loaded
          setTimeout(positionTimeline, 500);
          setTimeout(positionTimeline, 1500);
        };
        requestAnimationFrame(() => requestAnimationFrame(tryPosition));
        window.addEventListener("resize", positionTimeline);
      }

      // Beam animation: glowing dot travels down the line on scroll
      if (beamRef.current && containerRef.current) {
        gsap.fromTo(
          beamRef.current,
          { top: "0%" },
          {
            top: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "20% top",
              end: "bottom bottom",
              scrub: 0.5,
            },
          },
        );
      }

      // Sphere markers: fast smooth zoom when scrolled into view
      gsap.utils
        .toArray<Element>('[class*="sphere-marker-"]')
        .forEach((marker) => {
          gsap.fromTo(
            marker,
            { scale: 0.3, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
              scrollTrigger: {
                trigger: marker,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

      // Hero Animation - Professional and smooth
      const heroTl = gsap.timeline();

      // Badge entrance - smooth fade
      heroTl
        .from(".hero-badge", {
          y: -20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        // Title slides in smoothly
        .from(
          ".hero-title",
          {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5",
        )
        // Description slides up
        .from(
          ".hero-description",
          {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.6",
        )
        // Image reveal with elegant clip-path
        .from(
          ".hero-image-wrapper",
          {
            scale: 1.05,
            opacity: 0,
            duration: 1.4,
            ease: "power2.out",
          },
          "-=0.5",
        )
        .fromTo(
          ".hero-image-wrapper",
          { clipPath: "inset(10% 5% 10% 5%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power3.inOut",
          },
          "<",
        );

      // Section Animations - Professional and smooth
      contentSections.forEach((section, index) => {
        const isEven = index % 2 === 0;

        // Image Slide In - elegant reveal
        if (index === 0) {
          // First section: Smooth scale and fade
          gsap.fromTo(
            `.section-text-blur-0`,
            {
              y: 50,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: `.section-text-blur-0`,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );

          gsap.fromTo(
            `.section-image-0`,
            {
              scale: 0.95,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: `.section-${index}`,
                start: "top 80%",
              },
            },
          );
        } else {
          const slideFromX = isEven ? 80 : -80;

          // Image with smooth slide effect
          gsap.fromTo(
            `.section-image-${index}`,
            {
              x: slideFromX,
              opacity: 0,
              scale: 0.95,
            },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: `.section-${index}`,
                start: "top 75%",
              },
            },
          );
        }

        // Text Content Reveal - clean fade up
        const textTl = gsap.timeline({
          scrollTrigger: {
            trigger: `.section-${index}`,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        textTl.fromTo(
          `.section-text-${index}`,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          },
        );

        // Quote block special animation (if exists)
        if (index === contentSections.length - 1) {
          gsap.fromTo(
            `.section-${index} .quote-block`,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: `.section-${index} .quote-block`,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );

          // Signature block - smooth fade in (no spinning for PGS. TS. Lê Hiếu Giang)
          gsap.fromTo(
            `.section-${index} .signature-block`,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: `.section-${index} .signature-block`,
                start: "top 90%",
              },
            },
          );
        }

        // Marker - smooth scale in
        gsap.fromTo(
          `.sphere-marker-${index}`,
          {
            scale: 0.5,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `.section-${index}`,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Highlight badge - smooth fade in
        gsap.fromTo(
          `.section-${index} .highlight-badge`,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: `.section-${index}`,
              start: "top 75%",
            },
          },
        );
      });

      // Ending decoration - smooth fade in
      gsap.fromTo(
        ".ending-flower",
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 0.2,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".ending-flower",
            start: "top 90%",
          },
        },
      );

      // 1962 SINCE Banner Animation - Professional and elegant
      const sinceTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".since-banner",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Smooth staggered entrance
      sinceTl
        .fromTo(
          ".since-line-left",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
        )
        .fromTo(
          ".since-line-right",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
          "<",
        )
        .fromTo(
          ".since-text",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          ".since-year",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .fromTo(
          ".since-tagline",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
          "-=0.4",
        );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white font-sans"
    >
      {/* Modern Grid Background - 3D Perspective Effect */}
      <div
        className="grid-bg-pattern absolute inset-0 z-0 pointer-events-none"
        style={{
          perspective: "800px",
          perspectiveOrigin: "50% 30%",
        }}
      >
        <div
          style={{
            transform: "rotateX(55deg) scale(2.5)",
            transformOrigin: "50% 0%",
          }}
          className="absolute inset-0"
        >
          <GridPattern
            width={60}
            height={60}
            x={-1}
            y={-1}
            strokeDasharray="0"
            className={cn(
              "[mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,white_20%,transparent_100%)] opacity-[0.06] stroke-slate-400",
            )}
          />
        </div>
      </div>

      {/* Central Timeline - solid blue, positioned from image to button */}
      <div
        ref={timelineRef}
        className="absolute left-1/2 w-[2px] -translate-x-1/2 hidden md:block pointer-events-none z-10"
        style={{ top: 0, height: 0 }}
      >
        {/* Solid blue line */}
        <div className="w-full h-full bg-gradient-to-b from-blue-400 via-blue-400 to-blue-500" />
        {/* Beam dot - travels down the line on scroll */}
        <div
          ref={beamRef}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: "0%" }}
        >
          <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_4px_rgba(59,130,246,0.6),0_0_24px_8px_rgba(59,130,246,0.3)]" />
        </div>
      </div>

      {/* UTE Flower Decoration - Half flower at top right with fade */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-full h-full [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)]">
          <Image
            src="/assets/FLOWER_UTE_WHITE.png"
            alt=""
            fill
            className="object-contain opacity-20"
          />
        </div>
      </div>

      {/* UTE Flower Decoration - Floating along sections */}
      <div className="floating-flower absolute top-[25%] left-0 w-64 h-64 pointer-events-none z-0 -translate-x-1/3">
        <Image
          src="/assets/FLOWER_UTE_WHITE.png"
          alt=""
          fill
          className="object-contain opacity-10"
        />
      </div>
      <div className="floating-flower absolute top-[45%] right-0 w-80 h-80 pointer-events-none z-0 translate-x-1/4">
        <Image
          src="/assets/FLOWER_UTE_WHITE.png"
          alt=""
          fill
          className="object-contain opacity-15"
        />
      </div>
      <div className="floating-flower absolute top-[65%] left-0 w-72 h-72 pointer-events-none z-0 -translate-x-1/4">
        <Image
          src="/assets/FLOWER_UTE_WHITE.png"
          alt=""
          fill
          className="object-contain opacity-10"
        />
      </div>
      <div className="floating-flower absolute top-[85%] right-0 w-96 h-96 pointer-events-none z-0 translate-x-1/4">
        <Image
          src="/assets/FLOWER_UTE_WHITE.png"
          alt=""
          fill
          className="object-contain opacity-15"
        />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-24 md:pt-32 pb-0 flex flex-col items-center justify-center text-center gap-12 relative z-10"
      >
        {/* Interactive Grid Pattern - Hero Background */}
        <div className="hero-grid absolute inset-0 z-0 pointer-events-auto overflow-hidden [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,white_40%,transparent_100%)]">
          <InteractiveGridPattern
            width={50}
            height={50}
            squares={[30, 20]}
            className="opacity-40 border-none"
            squaresClassName="stroke-blue-200/40 hover:fill-blue-100/50 transition-all duration-75"
          />
        </div>

        <div className="hero-content relative max-w-4xl mx-auto space-y-8 flex flex-col items-center px-4 z-10">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium shadow-sm hover:shadow-md transition-shadow cursor-default">
            Thông điệp từ Ban Giám hiệu
          </div>

          <h1 className="hero-title relative text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-tight font-inter-black z-10">
            Khát vọng vươn mình <br className="hidden md:block" />
            <AuroraText className="font-extrabold text-blue-700">
              kiến tạo tương lai
            </AuroraText>
          </h1>

          <p className="hero-description text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
            <span className="whitespace-nowrap">
              Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh
            </span>{" "}
            (HCMUTE) - Nơi ươm mầm tài năng, khơi dậy đam mê và đồng hành cùng
            sự phát triển bền vững.
          </p>

          {/* Button Removed */}
        </div>

        {/* Full Screen Width Hero Image */}
        <div className="hero-image-wrapper relative w-full h-[60vh] md:h-[85vh] mt-12 overflow-hidden shadow-2xl">
          <Image
            src="/assets/leader-note/7.JPG"
            alt="HCM-UTE Campus"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full mb-32 mt-24">
        {/* First Section - Full Width Image + Text */}
        <div className={`section-0 py-12 md:py-24 space-y-12 relative`}>
          {/* Large Outline Cog Decoration - Far from content */}
          <svg
            className="absolute -left-16 md:-left-32 lg:-left-48 -top-8 md:-top-16 w-56 h-56 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem] pointer-events-none -z-10"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="0.2"
          >
            <defs>
              <linearGradient
                id="cogGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="rgb(59, 130, 246)"
                  stopOpacity="0.3"
                />
                <stop
                  offset="50%"
                  stopColor="rgb(37, 99, 235)"
                  stopOpacity="0.15"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(29, 78, 216)"
                  stopOpacity="0.05"
                />
              </linearGradient>
            </defs>
            <path
              stroke="url(#cogGradient1)"
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            />
            <path
              stroke="url(#cogGradient1)"
              d="M19.622 10.395l-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.401.655L5.516 16.3 4 18l2 2 1.791-1.46 2.606 1.072L11 22h2l.604-2.387 2.651-1.098C16.697 18.831 18 20 18 20l2-2-1.484-1.75 1.098-2.652 2.386-.62V11l-2.378-.605Z"
            />
          </svg>
          <svg
            className="absolute -right-16 md:-right-32 lg:-right-48 -bottom-8 md:-bottom-16 w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 pointer-events-none -z-10"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="0.2"
          >
            <defs>
              <linearGradient
                id="cogGradient2"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="rgb(59, 130, 246)"
                  stopOpacity="0.3"
                />
                <stop
                  offset="50%"
                  stopColor="rgb(37, 99, 235)"
                  stopOpacity="0.15"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(29, 78, 216)"
                  stopOpacity="0.05"
                />
              </linearGradient>
            </defs>
            <path
              stroke="url(#cogGradient2)"
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            />
            <path
              stroke="url(#cogGradient2)"
              d="M19.622 10.395l-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.401.655L5.516 16.3 4 18l2 2 1.791-1.46 2.606 1.072L11 22h2l.604-2.387 2.651-1.098C16.697 18.831 18 20 18 20l2-2-1.484-1.75 1.098-2.652 2.386-.62V11l-2.378-.605Z"
            />
          </svg>

          <div className="section-text-0 w-full text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight font-inter-black">
              {contentSections[0].title}
            </h2>
            {/* Applied BLUR Class */}
            <p className="section-text-blur-0 text-lg md:text-xl text-slate-600 leading-relaxed text-justify md:text-center w-full">
              {contentSections[0].content}
            </p>

            {/* Anchor for Timeline Start */}
            <div
              ref={highlightStartRef}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-50 text-blue-700 rounded-full font-bold shadow-sm mx-auto border border-blue-100 text-lg"
            >
              {contentSections[0].highlight}
            </div>

            {/* 1962 SINCE Banner - Inspired by UTE Poster Design */}
            <div className="since-banner relative w-full mx-auto mt-12 py-8 overflow-visible">
              {/* Decorative Lines */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-px">
                <div className="since-line-left w-full h-full bg-gradient-to-r from-transparent via-primary/60 to-primary origin-right" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-px">
                <div className="since-line-right w-full h-full bg-gradient-to-l from-transparent via-primary/60 to-primary origin-left" />
              </div>

              {/* Center Content */}
              <div className="relative flex flex-col items-center gap-4">
                {/* SINCE Text */}
                <div className="since-text flex items-center gap-3">
                  <span className="text-sm md:text-base font-bold tracking-[0.3em] text-primary uppercase">
                    Since
                  </span>
                </div>

                {/* Year 1962 - Bold Typography */}
                <div className="since-year relative">
                  <span
                    className="text-6xl md:text-8xl lg:text-9xl font-black italic text-primary tracking-tight drop-shadow-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    1962
                  </span>
                  {/* Subtle shadow text behind */}
                  <span
                    className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-black italic text-primary/5 tracking-tight -z-10 translate-x-1 translate-y-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    1962
                  </span>
                </div>

                {/* Taglines - Vietnamese */}
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 mt-2">
                  <div className="since-tagline flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm font-semibold text-primary tracking-wide">
                      Khẳng định tầm vóc
                    </span>
                  </div>
                  <div className="since-tagline flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm font-semibold text-primary tracking-wide">
                      Vươn mình phát triển
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={lineStartRef}
            className="section-image-0 w-full aspect-[21/9] relative rounded-[2.5rem] overflow-hidden shadow-2xl group"
          >
            {/* Outline Border Effect (Shadow) */}
            <div className="absolute inset-0 bg-transparent border border-primary/50 rounded-[2.5rem] translate-x-3 translate-y-3 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-300 ease-out -z-10 hidden md:block" />

            <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
              <Image
                src={contentSections[0].image}
                alt={contentSections[0].title}
                fill
                className="object-cover rounded-[2.5rem]"
              />
            </div>

            {/* Flower Behind First Section */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 z-20 pointer-events-none opacity-20 rotate-12">
              <Image
                src="/assets/FLOWER_UTE.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Content Flow - Remaining Sections */}
        <div className="space-y-24 md:space-y-0 relative">
          {contentSections.slice(1).map((section, idx) => {
            const index = idx + 1; // Correct index offset
            return (
              <section
                key={section.id}
                className={`section-${index} relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 min-h-[50vh] items-center py-12 group`}
              >
                {/* 3D Sphere Marker - Desktop Only - REPLACED WITH CLEAN DESIGN */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
                  <div
                    className={`sphere-marker-${index} relative w-24 h-24 rounded-full bg-white border border-blue-100 flex items-center justify-center transform transition-transform hover:scale-110 duration-500 z-10 shadow-sm`}
                  >
                    <div className="relative w-20 h-20 p-2">
                      <Image
                        src={FLOWER_ICON}
                        alt="Flower Icon"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Left Side Content (Alternating) */}
                <div
                  className={cn(
                    "order-2 md:order-1",
                    index % 2 === 1
                      ? "md:order-2 md:pl-12"
                      : "md:order-1 md:pr-12 md:text-right",
                  )}
                >
                  <div className={`section-text-${index} space-y-6 relative`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                      {section.title}
                    </h2>

                    <div
                      className={cn(
                        "prose prose-lg text-slate-600 leading-relaxed",
                        index % 2 === 1
                          ? "md:text-left"
                          : "md:ml-auto md:text-right",
                      )}
                    >
                      <p className="text-justify md:text-inherit">
                        {section.content}
                      </p>
                    </div>

                    {section.highlight && (
                      <div
                        className={cn(
                          "highlight-badge inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm",
                          index % 2 === 1 ? "flex-row" : "flex-row-reverse",
                        )}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <p className="font-medium text-slate-800">
                          {section.highlight}
                        </p>
                      </div>
                    )}

                    {section.quote && (
                      <figure
                        className={cn(
                          "quote-block relative p-6 rounded-3xl bg-blue-50 border border-blue-100",
                          index % 2 === 1
                            ? "rounded-tl-none"
                            : "rounded-tr-none",
                        )}
                      >
                        <Quote className="w-8 h-8 text-blue-300 absolute -top-4 -left-2 fill-current" />
                        {/* Quote icon position adjustment based on side could be nice but keeping plain for now */}
                        <blockquote className="text-lg italic font-medium text-slate-800 relative z-10">
                          "{section.quote}"
                        </blockquote>
                      </figure>
                    )}

                    {section.isConclusion && (
                      <div
                        className={cn(
                          "signature-block pt-8 mt-8 border-t border-slate-200",
                          index % 2 === 1
                            ? "flex flex-row items-center gap-4"
                            : "flex flex-row-reverse items-center gap-4",
                        )}
                      >
                        <div className="signature-avatar relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg shrink-0">
                          <Image
                            src="/PGS_TS_LGH.png"
                            alt="PGS. TS. Lê Hiếu Giang"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div
                          className={cn(
                            index % 2 === 1 ? "text-left" : "text-right",
                          )}
                        >
                          <p className="font-bold text-slate-900 text-lg whitespace-nowrap">
                            PGS. TS. Lê Hiếu Giang
                          </p>
                          <p className="text-slate-500 text-sm">
                            Hiệu trưởng{" "}
                            <span className="whitespace-nowrap">
                              Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side Image (Alternating) */}
                <div
                  className={cn(
                    "order-1 md:order-2",
                    index % 2 === 1
                      ? "md:order-1 md:pr-12 md:pl-0"
                      : "md:order-2 md:pl-12 md:pr-0",
                  )}
                >
                  <div className="relative w-full aspect-[4/3] group perspective-1000">
                    {/* Border effect - offset behind (uniform dashed) */}
                    <div
                      className={cn(
                        "absolute inset-0 border border-solid border-primary/50 pointer-events-none translate-x-3 translate-y-3 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:translate-y-5",
                        index % 2 === 1
                          ? "rounded-[2.5rem] rounded-tr-none"
                          : "rounded-[2.5rem] rounded-tl-none",
                      )}
                    />
                    <div
                      className={cn(
                        `section-image-${index} relative w-full h-full overflow-hidden shadow-xl bg-white`,
                        index % 2 === 1
                          ? "rounded-[2.5rem] rounded-tr-none"
                          : "rounded-[2.5rem] rounded-tl-none",
                      )}
                    >
                      <Image
                        src={section.image}
                        alt={section.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />

                      {/* Glassmorphism Badge */}
                      <div
                        className={cn(
                          "absolute top-4 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/50 z-20",
                          index % 2 === 1 ? "left-4" : "right-4",
                        )}
                      >
                        <span className="text-sm font-black text-slate-800 uppercase tracking-widest drop-shadow-sm">
                          {section.id.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Ending - Khám phá thêm Button with BorderBeam */}
        <div className="pt-16 pb-24 flex flex-col items-center relative z-20">
          {/* Khám phá thêm Button */}
          <a
            ref={endingBtnRef}
            href="/gioi-thieu"
            className="ending-button relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-primary bg-white rounded-full shadow-lg border border-primary/20 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Khám phá thêm
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
            <BorderBeam
              size={80}
              duration={2}
              colorFrom="#3b82f6"
              colorTo="#1d4ed8"
              borderWidth={2}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
