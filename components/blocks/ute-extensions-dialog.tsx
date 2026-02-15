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

/* ------------------------------------------------------------------ */
/*  Noise SVG filter – rendered once, referenced by every card         */
/* ------------------------------------------------------------------ */
function NoiseFilter({ id }: { id: string }) {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true">
      <filter id={id}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feBlend in="SourceGraphic" mode="soft-light" />
      </filter>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Extension data                                                     */
/* ------------------------------------------------------------------ */
interface UTEExtension {
  name: string;
  url: string;
  icon: React.ElementType;
  gradient: string;
}

const extensions: UTEExtension[] = [
  {
    name: "UTE Link",
    url: "https://link.hcmute.edu.vn",
    icon: Link2,
    gradient: "from-emerald-400 via-emerald-500 to-teal-600",
  },
  {
    name: "UTE Mail",
    url: "https://email.hcmute.edu.vn",
    icon: Mail,
    gradient: "from-blue-400 via-blue-500 to-indigo-600",
  },
  {
    name: "UTE Flipbook",
    url: "https://flipbook.hcmute.edu.vn",
    icon: BookOpen,
    gradient: "from-amber-400 via-amber-500 to-orange-600",
  },
  {
    name: "UTE Form",
    url: "https://form.hcmute.edu.vn",
    icon: FileText,
    gradient: "from-violet-400 via-violet-500 to-purple-600",
  },
  {
    name: "UTE Enhance",
    url: "https://enhance.hcmute.edu.vn",
    icon: ImagePlus,
    gradient: "from-rose-400 via-rose-500 to-pink-600",
  },
  {
    name: "UTE Frame",
    url: "https://frame.hcmute.edu.vn",
    icon: Frame,
    gradient: "from-cyan-400 via-cyan-500 to-sky-600",
  },
  {
    name: "UTE eID",
    url: "https://eid.hcmute.edu.vn",
    icon: CreditCard,
    gradient: "from-orange-400 via-orange-500 to-red-600",
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
        className="w-[calc(100%-1.5rem)] !max-w-[calc(100%-1.5rem)] sm:!max-w-xl md:!max-w-2xl overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl max-h-[90dvh] overflow-y-auto"
      >
        {/* Noise filter definition */}
        <NoiseFilter id={noiseId} />

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
                <a
                  key={ext.name}
                  href={ext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[20px] bg-gradient-to-br p-3 sm:p-4 transition-all duration-300 active:scale-[0.96]",
                    ext.gradient,
                  )}
                >
                  {/* Noise texture overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{ filter: `url(#${noiseId})` }}
                  />

                  {/* Shimmer on hover */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

                  {/* Label top-left */}
                  <span className="relative z-10 text-xs sm:text-sm font-bold leading-tight tracking-wide text-white drop-shadow-sm">
                    {ext.name}
                  </span>

                  {/* Big icon – overflows bottom-right, clipped by card */}
                  <Icon
                    className="absolute -bottom-3 -right-3 h-14 w-14 sm:h-16 sm:w-16 text-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:text-white/30"
                    strokeWidth={1.2}
                  />
                </a>
              );
            })}

            {/* Coming soon */}
            <div className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[20px] border-2 border-dashed border-neutral-200 bg-neutral-50 p-3 sm:p-4">
              <span className="text-xs sm:text-sm font-bold leading-tight tracking-wide text-neutral-300">
                Sắp ra mắt
              </span>
              <Plus
                className="absolute -bottom-3 -right-3 h-14 w-14 sm:h-16 sm:w-16 text-neutral-200"
                strokeWidth={1.2}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
