"use client";

import { useId } from "react";
import {
  Link2,
  Mail,
  BookOpen,
  FileText,
  ImagePlus,
  Frame,
  CreditCard,
  X,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Noise SVG filter                                                   */
/* ------------------------------------------------------------------ */
function NoiseFilter({ id }: { id: string }) {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true">
      <filter id={id}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.7"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feBlend in="SourceGraphic" mode="soft-light" />
      </filter>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Aurora Card — layered colour blobs blurred together                */
/* ------------------------------------------------------------------ */
function AuroraCard({
  colors,
  children,
  className,
  noiseId,
  ...rest
}: {
  colors: [string, string, string]; // three CSS color values
  noiseId: string;
  children: React.ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[20px] bg-white ring-1 ring-black/[0.06] p-3.5 sm:p-4 transition-all duration-300 active:scale-[0.96] hover:shadow-lg hover:ring-black/[0.08]",
        className,
      )}
      {...rest}
    >
      {/* — Wave band 1 (top, strongest) — */}
      <div
        className="pointer-events-none absolute -left-[30%] -top-[15%] h-[60%] w-[160%] rounded-[50%] blur-[25px] sm:blur-[35px] transition-all duration-700 group-hover:-translate-y-1 group-hover:rotate-[-2deg]"
        style={{ background: colors[0], opacity: 1 }}
      />
      {/* — Wave band 2 (middle) — */}
      <div
        className="pointer-events-none absolute -left-[20%] top-[20%] h-[55%] w-[150%] rounded-[50%] blur-[30px] sm:blur-[40px] transition-all duration-700 group-hover:translate-y-1 group-hover:rotate-[1deg]"
        style={{ background: colors[1], opacity: 0.9 }}
      />
      {/* — Wave band 3 (bottom) — */}
      <div
        className="pointer-events-none absolute -left-[25%] bottom-[-20%] h-[60%] w-[160%] rounded-[50%] blur-[20px] sm:blur-[30px] transition-all duration-700 group-hover:translate-y-[-4px] group-hover:rotate-[-1deg]"
        style={{ background: colors[2], opacity: 0.8 }}
      />

      {/* Noise grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply"
        style={{ filter: `url(#${noiseId})` }}
      />

      {/* Shimmer sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Extension data                                                     */
/* ------------------------------------------------------------------ */
interface UTEExtension {
  name: string;
  url: string;
  icon: React.ElementType;
  /** Three aurora blob colours [top-left, bottom-center, right] */
  aurora: [string, string, string];
}

const extensions: UTEExtension[] = [
  {
    name: "UTE Link",
    url: "https://link.hcmute.edu.vn",
    icon: Link2,
    aurora: ["#00c853", "#00e676", "#69f0ae"],
  },
  {
    name: "UTE Mail",
    url: "https://email.hcmute.edu.vn",
    icon: Mail,
    aurora: ["#2962ff", "#448aff", "#82b1ff"],
  },
  {
    name: "UTE Flipbook",
    url: "https://flipbook.hcmute.edu.vn",
    icon: BookOpen,
    aurora: ["#ff6d00", "#ff9100", "#ffab40"],
  },
  {
    name: "UTE Form",
    url: "https://form.hcmute.edu.vn",
    icon: FileText,
    aurora: ["#6200ea", "#7c4dff", "#b388ff"],
  },
  {
    name: "UTE Enhance",
    url: "https://enhance.hcmute.edu.vn",
    icon: ImagePlus,
    aurora: ["#d50000", "#ff1744", "#ff5252"],
  },
  {
    name: "UTE Frame",
    url: "https://frame.hcmute.edu.vn",
    icon: Frame,
    aurora: ["#0091ea", "#00b0ff", "#40c4ff"],
  },
  {
    name: "UTE eID",
    url: "https://eid.hcmute.edu.vn",
    icon: CreditCard,
    aurora: ["#ff3d00", "#ff6e40", "#ffab40"],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
interface UTEExtensionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UTEExtensionsDialog({
  open,
  onOpenChange,
}: UTEExtensionsDialogProps) {
  const noiseId = useId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1.5rem)] !max-w-[calc(100%-1.5rem)] sm:!max-w-xl md:!max-w-2xl overflow-hidden rounded-3xl border border-neutral-200/60 bg-white p-0 shadow-2xl max-h-[90dvh] overflow-y-auto"
      >
        {/* Noise filter definition (rendered once) */}
        <NoiseFilter id={noiseId} />

        {/* UTE Flower watermark decoration */}
        <div className="pointer-events-none absolute -top-12 -right-12 sm:-top-16 sm:-right-16 h-40 w-40 sm:h-56 sm:w-56 opacity-[0.04] select-none">
          <Image
            src="/assets/FLOWER_UTE.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        <div className="pointer-events-none absolute -bottom-10 -left-10 sm:-bottom-14 sm:-left-14 h-32 w-32 sm:h-44 sm:w-44 opacity-[0.03] rotate-45 select-none">
          <Image
            src="/assets/FLOWER_UTE.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-3">
          <DialogTitle className="text-base sm:text-lg font-semibold text-neutral-800">
            Hệ sinh thái UTE
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>

        {/* Grid */}
        <div className="px-2.5 pb-3 sm:px-5 sm:pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {extensions.map((ext) => {
              const Icon = ext.icon;
              return (
                <AuroraCard
                  key={ext.name}
                  href={ext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  colors={ext.aurora}
                  noiseId={noiseId}
                >
                  {/* Label top-left */}
                  <span className="relative z-10 text-2xl sm:text-3xl font-black leading-none tracking-tight text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.4)]">
                    {ext.name}
                  </span>

                  {/* Big icon — overflows bottom-right */}
                  <Icon
                    className="absolute -bottom-8 -right-8 h-36 w-36 sm:h-40 sm:w-40 text-white/30 transition-transform duration-300 group-hover:scale-110 group-hover:text-white/40"
                    strokeWidth={0.8}
                  />
                </AuroraCard>
              );
            })}

            {/* Coming soon */}
            <div className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[20px] border-2 border-dashed border-neutral-200 bg-neutral-50 p-3.5 sm:p-4">
              <span className="text-2xl sm:text-3xl font-black leading-none tracking-tight text-neutral-400">
                Sắp ra mắt
              </span>
              <Plus
                className="absolute -bottom-8 -right-8 h-36 w-36 sm:h-40 sm:w-40 text-neutral-200"
                strokeWidth={0.8}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
