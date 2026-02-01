"use client";

import { useState, useCallback, useEffect } from "react";
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
  Info,
} from "lucide-react";
import Cropper, { Area, Point } from "react-easy-crop";
import { toast } from "sonner";

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

// ============================================================================
// COVER IMAGE SIZE CONSTANTS
// ============================================================================
// Desktop: Full width banner (1200x630) - 1.9:1 ratio
// Mobile: Same height as desktop but narrower width (420x630) - 2:3 ratio (portrait-ish)
// The mobile safe zone is centered horizontally within desktop crop
// ============================================================================

export const COVER_IMAGE_SIZES = {
  // Desktop banner - main crop area
  desktop: {
    width: 1200,
    height: 630,
    aspectRatio: 1200 / 630, // ~1.905
    label: "Desktop (1200×630)",
  },
  // Mobile view - same height, narrower width (centered crop from desktop)
  mobile: {
    width: 420,
    height: 630,
    aspectRatio: 420 / 630, // ~0.667 (2:3)
    label: "Mobile (420×630)",
  },
} as const;

// Calculate mobile safe zone as percentage of desktop width
// Mobile width / Desktop width = 420 / 1200 = 0.35 (35%)
export const MOBILE_SAFE_ZONE_WIDTH_PERCENT =
  (COVER_IMAGE_SIZES.mobile.width / COVER_IMAGE_SIZES.desktop.width) * 100;

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

  // Ensure valid crop dimensions
  const cropWidth = Math.max(1, Math.round(pixelCrop.width));
  const cropHeight = Math.max(1, Math.round(pixelCrop.height));

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    cropWidth,
    cropHeight,
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

async function createImage(url: string): Promise<HTMLImageElement> {
  // For blob/data URLs, load directly without CORS
  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
      image.src = url;
    });
  }

  // For external URLs, try to fetch as blob first to avoid CORS issues with canvas
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        // Don't revoke the blob URL here as we need it for drawing
        resolve(image);
      };
      image.onerror = (error) => {
        URL.revokeObjectURL(blobUrl);
        reject(error);
      };
      image.src = blobUrl;
    });
  } catch {
    // Fallback: try loading with crossOrigin (may fail for some servers)
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
      image.crossOrigin = "anonymous";
      image.src = url;
    });
  }
}

export function ImageCropper({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  aspectRatio: customAspectRatio,
  preset = "desktop",
  title = "Cắt ảnh bìa bài viết",
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaResult | null>(null);
  const [croppedAreaPercent, setCroppedAreaPercent] = useState<Area | null>(
    null,
  );
  const [showSafeArea, setShowSafeArea] = useState(true);
  const [cropSize, setCropSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Always use desktop aspect ratio for the crop
  const desktopAspect = COVER_IMAGE_SIZES.desktop.aspectRatio;

  const onCropAreaComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
      setCroppedAreaPercent(croppedArea);
    },
    [],
  );

  // Track crop size for mobile overlay positioning
  const onCropSizeChange = useCallback(
    (size: { width: number; height: number }) => {
      setCropSize(size);
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
      toast.error("Không thể cắt ảnh. Vui lòng thử lại với ảnh khác.");
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
    }
  }, [open, handleReset]);

  // Calculate mobile overlay width based on crop area size
  const mobileOverlayWidth = cropSize
    ? cropSize.width * (MOBILE_SAFE_ZONE_WIDTH_PERCENT / 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Crop className="size-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Kéo để di chuyển, cuộn để phóng to/thu nhỏ. Vùng an toàn (Safe Area)
            đảm bảo nội dung quan trọng hiển thị trên mọi thiết bị.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-2">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded border-2 border-blue-500 bg-blue-500/20" />
              <span className="text-muted-foreground flex items-center gap-1">
                <Monitor className="size-3.5" />
                Desktop ({COVER_IMAGE_SIZES.desktop.width}×
                {COVER_IMAGE_SIZES.desktop.height})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded border-2 border-dashed border-orange-500 bg-orange-500/20" />
              <span className="text-muted-foreground flex items-center gap-1">
                <Smartphone className="size-3.5" />
                Mobile ({COVER_IMAGE_SIZES.mobile.width}×
                {COVER_IMAGE_SIZES.mobile.height})
              </span>
            </div>
            <Button
              variant={showSafeArea ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowSafeArea(!showSafeArea)}
              className="ml-auto"
            >
              <Grid3X3 className="mr-1.5 size-4" />
              Hiển thị lưới
            </Button>
          </div>

          {/* Cropper with overlay grids */}
          <div className="relative h-[300px] sm:h-[350px] md:h-[400px] rounded-xl overflow-hidden bg-black image-cropper-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={desktopAspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropAreaComplete}
              onCropSizeChange={onCropSizeChange}
              showGrid={false}
              classes={{
                cropAreaClassName: cn(showSafeArea && "desktop-crop-area"),
              }}
              style={{
                containerStyle: {
                  backgroundColor: "#000",
                },
                cropAreaStyle: showSafeArea
                  ? {
                      border: "3px dashed #3b82f6",
                    }
                  : undefined,
              }}
            />

            {/* CSS for mobile safe zone and labels inside crop area */}
            <style jsx global>{`
              /* Mobile safe zone - dashed orange border with label */
              .image-cropper-container .desktop-crop-area::after {
                content: "Mobile";
                display: flex;
                align-items: flex-start;
                justify-content: flex-start;
                padding: 8px;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: ${MOBILE_SAFE_ZONE_WIDTH_PERCENT}%;
                border: 2px dashed #f97316;
                background: rgba(249, 115, 22, 0.08);
                pointer-events: none;
                box-sizing: border-box;
                font-size: 11px;
                font-weight: 600;
                color: #f97316;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
              }

              /* Desktop label - top left inside crop area */
              .image-cropper-container .desktop-crop-area::before {
                content: "Desktop";
                position: absolute;
                top: 8px;
                left: 8px;
                color: #3b82f6;
                font-size: 11px;
                font-weight: 600;
                pointer-events: none;
                z-index: 10;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
              }
            `}</style>
          </div>

          {/* Info box */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl text-sm">
            <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-muted-foreground text-xs space-y-1">
              <p>
                <span className="text-blue-600 font-medium">
                  Vùng xanh (Desktop):
                </span>{" "}
                Toàn bộ ảnh ({COVER_IMAGE_SIZES.desktop.width}×
                {COVER_IMAGE_SIZES.desktop.height}px) hiển thị trên màn hình lớn
              </p>
              <p>
                <span className="text-orange-600 font-medium">
                  Vùng cam (Mobile):
                </span>{" "}
                Phần hiển thị trên điện thoại ({COVER_IMAGE_SIZES.mobile.width}×
                {COVER_IMAGE_SIZES.mobile.height}px). Đặt nội dung quan trọng ở
                giữa.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 bg-muted/50 rounded-xl text-sm">
              <div className="flex-1">
                <p className="font-medium">Kích thước xuất: 1200×630px</p>
                <p className="text-muted-foreground text-xs">
                  Tỷ lệ khung hình: {desktopAspect.toFixed(2)} (16:9 gần đúng)
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 pt-4 border-t">
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
