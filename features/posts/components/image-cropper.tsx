"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Smartphone,
  Monitor,
  Check,
  X,
  Grid3X3,
} from "lucide-react";
import Cropper, { Area, Point } from "react-easy-crop";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Cover image sizes
export const COVER_IMAGE_SIZES = {
  desktop: {
    width: 1200,
    height: 630,
    aspectRatio: 1200 / 630,
    label: "Desktop (1200x630)",
    safeArea: { top: 60, right: 100, bottom: 60, left: 100 },
  },
  mobile: {
    width: 600,
    height: 400,
    aspectRatio: 600 / 400,
    label: "Mobile (600x400)",
    safeArea: { top: 40, right: 40, bottom: 40, left: 40 },
  },
  og: {
    width: 1200,
    height: 630,
    aspectRatio: 1200 / 630,
    label: "Open Graph (1200x630)",
    safeArea: { top: 80, right: 120, bottom: 80, left: 120 },
  },
} as const;

export type CropPreset = keyof typeof COVER_IMAGE_SIZES;

interface CroppedAreaResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob, croppedUrl: string) => void;
  aspectRatio?: number;
  preset?: CropPreset;
  title?: string;
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CroppedAreaResult,
): Promise<{ blob: Blob; url: string }> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      },
      "image/jpeg",
      0.95,
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = url;
  });
}

export function ImageCropper({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  aspectRatio: customAspectRatio,
  preset = "desktop",
  title = "Cắt ảnh",
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaResult | null>(null);
  const [activePreset, setActivePreset] = useState<CropPreset>(preset);
  const [showSafeArea, setShowSafeArea] = useState(true);

  const currentSize = COVER_IMAGE_SIZES[activePreset];
  const aspectRatio = customAspectRatio || currentSize.aspectRatio;

  const onCropAreaComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleCropConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;

    try {
      const { blob, url } = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(blob, url);
      onOpenChange(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete, onOpenChange]);

  const handleReset = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  }, []);

  useEffect(() => {
    if (open) {
      handleReset();
      setActivePreset(preset);
    }
  }, [open, preset, handleReset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="size-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Kéo để di chuyển, cuộn để phóng to/thu nhỏ. Vùng an toàn (Safe Area)
            đảm bảo nội dung quan trọng hiển thị trên mọi thiết bị.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activePreset}
          onValueChange={(v) => setActivePreset(v as CropPreset)}
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="desktop" className="gap-1.5">
                <Monitor className="size-4" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="mobile" className="gap-1.5">
                <Smartphone className="size-4" />
                Mobile
              </TabsTrigger>
              <TabsTrigger value="og" className="gap-1.5">
                <Grid3X3 className="size-4" />
                OG Image
              </TabsTrigger>
            </TabsList>

            <Button
              variant={showSafeArea ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowSafeArea(!showSafeArea)}
            >
              <Grid3X3 className="mr-1.5 size-4" />
              Safe Area
            </Button>
          </div>

          <div className="mt-4 relative h-[400px] rounded-xl overflow-hidden bg-black/90">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={COVER_IMAGE_SIZES[activePreset].aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropAreaComplete}
              showGrid={showSafeArea}
              classes={{
                containerClassName: "rounded-xl",
                cropAreaClassName: showSafeArea
                  ? "!border-primary !border-2"
                  : "",
              }}
            />

            {/* Safe area overlay indicators */}
            {showSafeArea && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="text-white/70 text-xs bg-black/50 px-2 py-1 rounded">
                  {COVER_IMAGE_SIZES[activePreset].label}
                </div>
              </div>
            )}
          </div>
        </Tabs>

        {/* Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Zoom control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Phóng to</Label>
                <Badge variant="outline" className="font-mono">
                  {(zoom * 100).toFixed(0)}%
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                      >
                        <ZoomOut className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Thu nhỏ</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.01}
                  onValueChange={(v: number[]) => setZoom(v[0])}
                  className="flex-1"
                />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                      >
                        <ZoomIn className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Phóng to</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Rotation control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Xoay</Label>
                <Badge variant="outline" className="font-mono">
                  {rotation}°
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={handleReset}
                      >
                        <RotateCcw className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Slider
                  value={[rotation]}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={(v: number[]) => setRotation(v[0])}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Size info */}
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg text-sm">
            <div className="flex-1">
              <p className="font-medium">
                {COVER_IMAGE_SIZES[activePreset].label}
              </p>
              <p className="text-muted-foreground text-xs">
                Kích thước xuất: {COVER_IMAGE_SIZES[activePreset].width}×
                {COVER_IMAGE_SIZES[activePreset].height}px
              </p>
            </div>
            <div className="text-right text-muted-foreground text-xs">
              <p>Safe Area (trái/phải): {currentSize.safeArea.left}px</p>
              <p>Safe Area (trên/dưới): {currentSize.safeArea.top}px</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 size-4" />
            Hủy
          </Button>
          <Button onClick={handleCropConfirm}>
            <Check className="mr-2 size-4" />
            Áp dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
