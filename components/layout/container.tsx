"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 max-w-[1920px]",
        className
      )}
    >
      {children}
    </Component>
  );
}
