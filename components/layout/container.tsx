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
        "w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 max-w-[1920px]",
        className
      )}
    >
      {children}
    </Component>
  );
}
