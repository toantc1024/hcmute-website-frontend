"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArrowButtonProps {
  direction: "left" | "right";
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function ArrowButton({
  direction,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`border border-white/20 cursor-pointer select-none bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-200 ${className}`}
    >
      {direction === "right" ? (
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 pointer-events-none" />
      ) : (
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 pointer-events-none" />
      )}
    </button>
  );
}
