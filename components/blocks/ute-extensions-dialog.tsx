"use client";

import {
  Link2,
  Mail,
  BookOpen,
  FileText,
  ImagePlus,
  Frame,
  CreditCard,
  ArrowUpRight,
  X,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UTEExtension {
  name: string;
  subtitle: string;
  url: string;
  icon: React.ElementType;
  accent: string;
  accentBorder: string;
}

const extensions: UTEExtension[] = [
  {
    name: "Short Link",
    subtitle: "Rút gọn & QR",
    url: "https://link.hcmute.edu.vn",
    icon: Link2,
    accent:
      "from-emerald-500 to-teal-600 shadow-emerald-500/25 group-hover:shadow-emerald-500/40",
    accentBorder: "group-hover:border-emerald-200",
  },
  {
    name: "Email",
    subtitle: "Marketing",
    url: "https://email.hcmute.edu.vn",
    icon: Mail,
    accent:
      "from-blue-500 to-indigo-600 shadow-blue-500/25 group-hover:shadow-blue-500/40",
    accentBorder: "group-hover:border-blue-200",
  },
  {
    name: "Flipbook",
    subtitle: "PDF tương tác",
    url: "https://flipbook.hcmute.edu.vn",
    icon: BookOpen,
    accent:
      "from-amber-500 to-orange-600 shadow-amber-500/25 group-hover:shadow-amber-500/40",
    accentBorder: "group-hover:border-amber-200",
  },
  {
    name: "Form",
    subtitle: "Biểu mẫu khảo sát",
    url: "https://form.hcmute.edu.vn",
    icon: FileText,
    accent:
      "from-violet-500 to-purple-600 shadow-violet-500/25 group-hover:shadow-violet-500/40",
    accentBorder: "group-hover:border-violet-200",
  },
  {
    name: "Enhance",
    subtitle: "Nâng cấp ảnh AI",
    url: "https://enhance.hcmute.edu.vn",
    icon: ImagePlus,
    accent:
      "from-rose-500 to-pink-600 shadow-rose-500/25 group-hover:shadow-rose-500/40",
    accentBorder: "group-hover:border-rose-200",
  },
  {
    name: "Frame",
    subtitle: "Khung avatar",
    url: "https://frame.hcmute.edu.vn",
    icon: Frame,
    accent:
      "from-cyan-500 to-sky-600 shadow-cyan-500/25 group-hover:shadow-cyan-500/40",
    accentBorder: "group-hover:border-cyan-200",
  },
  {
    name: "eID",
    subtitle: "Danh thiếp số",
    url: "https://eid.hcmute.edu.vn",
    icon: CreditCard,
    accent:
      "from-orange-500 to-red-600 shadow-orange-500/25 group-hover:shadow-orange-500/40",
    accentBorder: "group-hover:border-orange-200",
  },
];

interface UTEExtensionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UTEExtensionsDialog({
  open,
  onOpenChange,
}: UTEExtensionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-3xl overflow-hidden rounded-3xl border border-neutral-200/60 bg-white p-0 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.15)]"
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Layers className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900">
                  Hệ sinh thái UTE
                </DialogTitle>
                <p className="mt-0.5 text-sm text-neutral-400">
                  7 công cụ số · Truy cập nhanh
                </p>
              </div>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-8 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

        {/* Grid */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {extensions.map((ext) => {
              const Icon = ext.icon;
              return (
                <a
                  key={ext.name}
                  href={ext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group relative flex flex-col items-center gap-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 px-4 py-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg",
                    ext.accentBorder,
                  )}
                >
                  {/* Icon pill */}
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl",
                      ext.accent,
                    )}
                  >
                    <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <span className="block text-sm font-semibold text-neutral-800">
                      {ext.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-400">
                      {ext.subtitle}
                    </span>
                  </div>

                  {/* Arrow indicator */}
                  <ArrowUpRight className="absolute right-3 top-3 h-3.5 w-3.5 text-neutral-300 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-500 group-hover:opacity-100" />
                </a>
              );
            })}

            {/* "More" placeholder card */}
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/30 px-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
                <span className="text-lg font-bold text-neutral-300">+</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-neutral-300">
                  Sắp ra mắt
                </span>
                <span className="mt-0.5 block text-xs text-neutral-300">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
