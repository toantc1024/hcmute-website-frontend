"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { CarouselNavButton } from "@/components/blocks/carousel-nav-button";
import { cn } from "@/lib/utils";

interface CarouselSlide {
  id: number;
  title: string;
  image: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh",
    image: "/carousel/image.png",
  },
  {
    id: 2,
    title: "Nghiên cứu Khoa học",
    image: "/carousel/image copy.png",
  },
  {
    id: 3,
    title: "Hợp tác Quốc tế",
    image: "/carousel/image copy 2.png",
  },
];

const AUTOPLAY_DURATION = 7; // seconds

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const isAnimating = useRef(false);
  const autoplayTimeline = useRef<gsap.core.Tween | null>(null);

  // Animate slide transition with GSAP
  const animateToSlide = useCallback(
    (nextIndex: number, direction: "left" | "right" = "right") => {
      if (isAnimating.current || nextIndex === currentSlide) return;
      isAnimating.current = true;

      const currentEl = slideRefs.current[currentSlide];
      const nextEl = slideRefs.current[nextIndex];

      if (!currentEl || !nextEl) {
        isAnimating.current = false;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setCurrentSlide(nextIndex);
        },
      });

      // Set next slide initial position
      gsap.set(nextEl, {
        opacity: 1,
        zIndex: 2,
        scale: 1.05,
      });
      gsap.set(currentEl, { zIndex: 1 });

      // Crossfade images with zoom
      tl.to(
        currentEl,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        },
        0.1,
      );

      tl.fromTo(
        nextEl,
        { scale: 1.05 },
        {
          scale: 1,
          duration: 1.0,
          ease: "power2.out",
        },
        0,
      );
    },
    [currentSlide],
  );

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % slides.length;
    animateToSlide(next, "right");
  }, [currentSlide, animateToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    animateToSlide(prev, "left");
  }, [currentSlide, animateToSlide]);

  const goToSlide = useCallback(
    (index: number) => {
      const direction = index > currentSlide ? "right" : "left";
      animateToSlide(index, direction);
    },
    [currentSlide, animateToSlide],
  );

  // Progress bar animation
  useEffect(() => {
    if (!progressRef.current) return;

    // Kill previous
    autoplayTimeline.current?.kill();

    gsap.set(progressRef.current, { width: "0%" });

    if (isAutoPlay) {
      autoplayTimeline.current = gsap.to(progressRef.current, {
        width: "100%",
        duration: AUTOPLAY_DURATION,
        ease: "none",
        onComplete: () => {
          nextSlide();
        },
      });
    }

    return () => {
      autoplayTimeline.current?.kill();
    };
  }, [currentSlide, isAutoPlay, nextSlide]);

  // Set initial slide visibility
  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (el) {
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
          zIndex: i === 0 ? 2 : 1,
          scale: 1,
        });
      }
    });
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="group/carousel relative w-full overflow-hidden bg-gray-900"
      style={{ aspectRatio: "2560/854" }}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => {
            slideRefs.current[index] = el;
          }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-center"
            priority={index === 0}
            quality={90}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Navigation arrows — glassmorphism style */}
      <div className="absolute left-2 sm:left-3 md:left-4 lg:left-6 xl:left-8 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300">
        <CarouselNavButton
          direction="prev"
          variant="glass"
          onClick={() => {
            setIsAutoPlay(false);
            prevSlide();
          }}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        />
      </div>

      <div className="absolute right-2 sm:right-3 md:right-4 lg:right-6 xl:right-8 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300">
        <CarouselNavButton
          direction="next"
          variant="glass"
          onClick={() => {
            setIsAutoPlay(false);
            nextSlide();
          }}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        />
      </div>

      {/* Slide indicators — glassmorphism pill */}
      <div className="absolute bottom-3 sm:bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlay(false);
                goToSlide(index);
              }}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
              className={cn(
                "rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-5 sm:w-6 md:w-8 h-1.5 sm:h-2 bg-white"
                  : "w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 bg-white/40 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-white/20 z-10">
        <div
          ref={progressRef}
          className="h-full bg-blue-500"
          style={{ width: "0%" }}
        />
      </div>
    </section>
  );
}
