"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: "size-6 border-2",
  md: "size-10 border-3",
  lg: "size-14 border-4",
};

export function Loader({
  size = "md",
  className,
  text,
  fullScreen = false,
}: LoaderProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <motion.div
        className={cn(
          "rounded-full border-primary border-t-transparent",
          sizeMap[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
}

export function PageLoader({ text }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader size="lg" text={text} />
    </div>
  );
}

export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader size="sm" text={text} />
    </div>
  );
}

export function ButtonLoader() {
  return (
    <motion.div
      className="size-4 rounded-full border-2 border-current border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
