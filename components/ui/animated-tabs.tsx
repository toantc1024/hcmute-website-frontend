"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TabItem {
  label: string;
  value: string | number;
}

interface AnimatedTabsProps {
  items: TabItem[];
  activeIndex: number;
  onTabChange: (index: number) => void;
  className?: string;
  tabClassName?: string;
  draggable?: boolean;
  layoutId?: string;
}

export function AnimatedTabs({
  items,
  activeIndex,
  onTabChange,
  className,
  tabClassName,
  draggable = true,
  layoutId = "tab-indicator",
}: AnimatedTabsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    if (!draggable) return;
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.round(percentage * (items.length - 1));
    onTabChange(index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleDragMove(e.touches[0].clientX);
      }
    };

    const handleUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative inline-flex items-center bg-gray-100 rounded-lg p-1 cursor-pointer select-none",
        className,
      )}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {items.map((item, index) => (
        <button
          key={item.value}
          onClick={() => onTabChange(index)}
          className={cn(
            "relative z-10 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 text-xs sm:text-sm transition-colors duration-200 flex items-center justify-center flex-1 min-w-[80px] sm:min-w-[100px] lg:min-w-0 whitespace-nowrap rounded-md",
            activeIndex === index
              ? "text-foreground font-semibold"
              : "text-gray-500 hover:text-gray-700 font-medium",
            tabClassName,
          )}
        >
          {activeIndex === index && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />
          )}
          <span className="relative z-10">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
