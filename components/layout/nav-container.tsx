"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface NavContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * NavContainer - Dedicated container for navbar & topbar.
 * Uses tighter horizontal padding than the main Container so the
 * navigation spans wider while page content stays narrower.
 */
export const NavContainer = React.forwardRef<HTMLElement, NavContainerProps>(
  ({ children, className, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[1920px]",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

NavContainer.displayName = "NavContainer";
