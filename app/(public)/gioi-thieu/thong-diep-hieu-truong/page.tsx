"use client";

import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Quote,
  Users,
  GraduationCap
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { CoolMode } from "@/components/ui/cool-mode";

// Register GSAP ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Data ---
const contentData = {
  hero: {
    title: "Triết lý giáo dục",
    highlight: "Nhân bản – Sáng tạo – Hội nhập",
    description: "Kim chỉ nam xuyên suốt trong quá trình xây dựng và phát triển của Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE), cam kết sứ mệnh đào tạo con người toàn diện.",
  },
  values: [
    {
      id: "nhan-ban",
      title: "Nhân bản",
      subtitle: "Lấy con người làm trung tâm",
      flower: "/assets/FLOWER_UTE.png", // Using UTE Flower
      color: "border-pink-500",
      textAccent: "text-pink-600",
      image: "/assets/leader-note/leader-notes  (1).jpg",
      description: "Đặt yếu tố nhân văn: con người và văn hóa lên hàng đầu. Giáo dục tại HCMUTE là sự kết hợp hài hòa giữa dạy chữ và dạy người, giữa đào tạo chuyên môn và bồi dưỡng nhân cách.",
      details: [
        "Triết lý giáo dục không chỉ dừng lại ở việc truyền đạt tri thức, mà còn là hành trình nuôi dưỡng tâm hồn.",
        "Mỗi sinh viên không chỉ là người học, mà còn là một công dân có trách nhiệm với xã hội.",
        "Phát triển trí tuệ đi đôi với xây dựng tinh thần nhân ái, sẻ chia."
      ]
    },
    {
      id: "sang-tao",
      title: "Sáng tạo",
      subtitle: "Thúc đẩy đổi mới và nghiên cứu",
      flower: "/assets/FLOWER_BLUE_GRADIENT_UTE.png",
      color: "border-amber-500",
      textAccent: "text-amber-600",
      image: "/assets/leader-note/leader-notes  (3).JPG",
      description: "Sáng tạo là yếu tố then chốt giúp sinh viên và nhà trường khẳng định vị thế. Là phẩm chất cần thiết và tinh thần xuyên suốt trong mọi hoạt động.",
      details: [
        "Khẳng định tài năng qua các cuộc thi khoa học kỹ thuật & khởi nghiệp.",
        "Mô hình học tập tích hợp, Project-based learning (PBL).",
        "Hệ sinh thái hỗ trợ sáng tạo khởi nghiệp, kết nối doanh nghiệp."
      ]
    },
    {
      id: "hoi-nhap",
      title: "Hội nhập",
      subtitle: "Chiến lược thời kỳ toàn cầu hóa",
      flower: "/assets/FLOWER_UTE.png", 
      color: "border-blue-500",
      textAccent: "text-blue-600",
      image: "/assets/leader-note/leader-notes  (5).JPG",
      description: "Hội nhập quốc tế là xu thế tất yếu. HCMUTE xác định hội nhập là trụ cột chiến lược, hướng tới chuẩn mực quốc tế trong mọi hoạt động.",
      details: [
        "Chủ đề năm học: 'Đổi mới quản trị đại học & Hội nhập toàn cầu'.",
        "Mở rộng quan hệ hợp tác với các đại học, tổ chức uy tín thế giới.",
        "Trang bị kỹ năng nghề chuẩn quốc tế, ngoại ngữ và tư duy toàn cầu."
      ]
    }
  ]
};

export default function LeaderNotePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Animation 
      const tl = gsap.timeline();
      tl.from(".hero-badge", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from(".hero-title-main", { y: 50, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.4")
        .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(".hero-image-container", { scale: 0.95, opacity: 0, duration: 1.2, ease: "expo.out" }, "-=0.4");

      // 2. Values - Scroll Reveal
      valuesRef.current.forEach((el, index) => {
        const imageEl = imageRefs.current[index];

        // Slide up reveal for the whole section
        gsap.fromTo(el,
          { 
            y: 80, 
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%", 
              end: "bottom 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Image Parallax 
        if (imageEl) {
           gsap.fromTo(imageEl.querySelector(".parallax-img"),
              { scale: 1.15 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1
                }
              }
           );
        }
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToValuesRef = (el: HTMLDivElement | null) => {
    if (el && !valuesRef.current.includes(el)) valuesRef.current.push(el);
  };

  const addToImageRefs = (el: HTMLDivElement | null) => {
     if (el && !imageRefs.current.includes(el)) imageRefs.current.push(el);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden pb-32">
      
      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative min-h-[95vh] flex flex-col justify-start pt-32 px-4 md:px-8 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="text-left space-y-8 z-20">
               <Badge
                  variant="outline"
                  className="hero-badge inline-flex px-4 py-1.5 text-sm uppercase tracking-widest border-primary/20 bg-background/50 backdrop-blur-md"
               >
                  Thông điệp Hiệu trưởng
               </Badge>

               <div className="hero-title-main space-y-2">
                 <h2 className="text-4xl md:text-5xl font-medium text-foreground/80">
                   Triết lý giáo dục
                 </h2>
                 <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-none">
                    Nhân bản <br/>
                    Sáng tạo <br/>
                    Hội nhập
                 </h1>
               </div>

               <p className="hero-subtitle text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-light">
                 {contentData.hero.description}
               </p>

               <div className="pt-4 flex items-center gap-4">
                  <div className="flex -space-x-4">
                     <div className="w-12 h-12 rounded-full border-2 border-background overflow-hidden relative">
                        <Image src={'/assets/FLOWER_UTE.png'} alt="Flower 1" fill className="object-cover" />
                     </div>
                     <div className="w-12 h-12 rounded-full border-2 border-background overflow-hidden relative bg-blue-50">
                        <Image src={'/assets/FLOWER_BLUE_GRADIENT_UTE.png'} alt="Flower 2" fill className="object-cover scale-75" />
                     </div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Biểu tượng của sự phát triển</span>
               </div>
            </div>

            {/* Right: Single Leader Image (LGH) */}
            <div className="hero-image-container relative h-[60vh] lg:h-[80vh] flex items-end justify-center lg:justify-end">
               {/* Decorative Circle Behind */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary/5 rounded-full animate-[spin_60s_linear_infinite]" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-primary/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
               
               {/* Main Image */}
               <div className="relative z-10 w-full h-full max-w-[500px] lg:max-w-full">
                  <Image 
                    src="/PGS_TS_LGH.png" 
                    alt="PGS.TS Le Hieu Giang" 
                    fill
                    className="object-contain object-bottom drop-shadow-2xl"
                    priority
                  />
                  
                  {/* Floating Name Card */}
                  <div className="absolute left-0 bottom-20 md:left-[-50px] max-w-[300px]">
                      <NeonGradientCard className="w-full bg-background/80 backdrop-blur-md !p-0" borderSize={2} borderRadius={20}>
                         <div className="p-6">
                            <p className="font-bold text-lg md:text-xl text-foreground">PGS.TS Lê Hiếu Giang</p>
                            <p className="text-sm text-muted-foreground">Hiệu trưởng Trường ĐH Sư phạm Kỹ thuật TP.HCM</p>
                         </div>
                      </NeonGradientCard>
                  </div>
               </div>
            </div>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="relative max-w-5xl mx-auto text-center space-y-10">
             <Quote className="w-20 h-20 text-foreground/5 mx-auto" />
             <h2 className="text-3xl md:text-5xl font-medium leading-tight text-foreground">
               "Giáo dục tại HCMUTE là sự kết hợp hài hòa giữa <span className="font-bold text-foreground">dạy chữ và dạy người</span>, giữa đào tạo chuyên môn và bồi dưỡng nhân cách."
             </h2>
             <Separator className="max-w-[100px] mx-auto opacity-30" />
          </div>
        </div>
      </section>

      {/* --- VALUES SHOWCASE --- */}
      <div className="space-y-40 py-24 pb-48">
        {contentData.values.map((value, index) => {
          const isEven = index % 2 === 0;
          return (
            <section 
               key={value.id} 
               ref={addToValuesRef}
               className="container mx-auto px-4 md:px-8"
            >
              <div className={cn(
                "flex flex-col md:flex-row items-center gap-16 lg:gap-24",
                isEven ? "" : "md:flex-row-reverse"
              )}>
                
                {/* Visual Side */}
                <div ref={addToImageRefs} className="w-full md:w-1/2 relative">
                   <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[3/4] md:aspect-[4/5] bg-black/5 dark:bg-white/5 group">
                      <Image 
                        src={value.image}
                        alt={value.title}
                        fill
                        className="parallax-img object-cover object-center transition-transform duration-700"
                      />
                      
                      {/* Magic UI Border Beam */}
                      <BorderBeam size={250} duration={12} delay={9} className="z-10" />

                      {/* Content Overlay at Bottom */}
                      <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent pt-32 z-20">
                         <div className="flex items-center gap-4 text-white">
                            <div className="w-12 h-12 relative rounded-full bg-white/10 backdrop-blur-md p-2 border border-white/20 flex-shrink-0">
                               <Image 
                                 src={value.flower} 
                                 alt="Flower Icon" 
                                 fill 
                                 className="object-contain p-2"
                               />
                            </div>
                            <div>
                               <p className="font-bold text-xl">{value.title}</p>
                               <p className="text-sm opacity-80">{value.subtitle}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 space-y-10 pl-4 md:pl-0">
                   <div className="flex flex-col space-y-4">
                      <span className="text-9xl font-black text-secondary/30 leading-none select-none -ml-2 block">
                        0{index + 1}
                      </span>
                      <h2 className={cn("text-5xl md:text-6xl font-bold tracking-tight block", value.textAccent)}>
                        {value.title}
                      </h2>
                   </div>

                   <p className="text-xl text-foreground/80 leading-relaxed font-light max-w-xl">
                     {value.description}
                   </p>

                   <div className="space-y-6 pt-6">
                      {value.details.map((detail, i) => (
                        <div key={`${value.id}-${i}`} className="flex gap-6 group">
                           <div className="relative mt-1.5 flex-shrink-0">
                              <div className={cn("w-3 h-3 rounded-full border-2", value.color)} />
                              <div className={cn("absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-20", value.color.replace('border-', 'bg-'))} />
                           </div>
                           <p className="text-lg text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                             {detail}
                           </p>
                        </div>
                      ))}
                   </div>
                   
                   <div className="pt-8">
                     <CoolMode>
                        <button className={cn("px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest border-2 transition-all duration-300 hover:bg-foreground hover:text-background", value.color, value.textAccent)}>
                          Tìm hiểu thêm
                        </button>
                     </CoolMode>
                   </div>
                </div>

              </div>
            </section>
          )
        })}
      </div>

    </div>
  );
}
