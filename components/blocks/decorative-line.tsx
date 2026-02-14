"use client";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Full-width decorative line — clean engineering / university style  */
/*  Continuous precision line spanning edge-to-edge                    */
/* ------------------------------------------------------------------ */

interface DecorativeLineProps {
  className?: string;
  variant?: "default" | "light" | "primary";
}

export function DecorativeLine({
  className,
  variant = "default",
}: DecorativeLineProps) {
  const colors = {
    default: {
      line: "bg-neutral-200",
      dash: "bg-neutral-300",
    },
    light: {
      line: "bg-neutral-200/60",
      dash: "bg-neutral-200",
    },
    primary: {
      line: "bg-blue-200",
      dash: "bg-blue-300",
    },
  }[variant];

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("h-px w-full", colors.line)} />
    </div>
  );
}

export function SectionDivider({
  className,
  variant = "default",
}: DecorativeLineProps) {
  const colors = {
    default: {
      line: "bg-neutral-200",
    },
    light: {
      line: "bg-neutral-100",
    },
    primary: {
      line: "bg-blue-200",
    },
  }[variant];

  return (
    <div className={cn("w-full py-1", className)}>
      <div className={cn("h-px w-full", colors.line)} />
    </div>
  );
}
