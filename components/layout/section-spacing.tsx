"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Consistent section spacing for the public pages.
 *
 * Usage:
 *   <SectionSpacing>
 *     <MySection />
 *   </SectionSpacing>
 *
 * The gap is controlled by a single CSS variable `--section-gap` (default 48px)
 * defined in globals.css so it can be changed in one place.
 *
 * Props:
 *  - noPaddingTop:  skip top padding  (e.g. first section after hero)
 *  - noPaddingBottom: skip bottom padding
 *  - className: extra classes
 */

interface SectionSpacingProps {
  children: React.ReactNode;
  className?: string;
  /** Remove top padding (useful for sections right after the hero) */
  noPaddingTop?: boolean;
  /** Remove bottom padding */
  noPaddingBottom?: boolean;
}

export function SectionSpacing({
  children,
  className,
  noPaddingTop = false,
  noPaddingBottom = false,
}: SectionSpacingProps) {
  return (
    <div
      className={cn(
        !noPaddingTop && "pt-[var(--section-gap)]",
        noPaddingBottom && "pb-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
