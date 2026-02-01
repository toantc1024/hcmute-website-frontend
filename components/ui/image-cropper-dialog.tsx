"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
  RectangleHorizontal,
  Square,
  Smartphone,
  Monitor,
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

// ============================================================================
// TYPES
// ============================================================================

interface CroppedAreaResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AspectRatioPreset {
  value: string;
  label: string;
  aspectRatio?: number; // undefined = freeform
  icon: React.ReactNode;
}

export interface ImageCropperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob, croppedUrl: string) => void;
  /** Default aspect ratio. If undefined, starts in freeform mode */
  defaultAspectRatio?: number;
  /** Whether to allow freeform cropping */
  allowFreeform?: boolean;
  /** Custom aspect ratio presets. If not provided, uses default presets */
  aspectPresets?: AspectRatioPreset[];
  /** Title of the dialog */
  title?: string;
  /** Description of the dialog */
  description?: string;
}

// ============================================================================
// DEFAULT PRESETS
// ============================================================================

const DEFAULT_ASPECT_PRESETS: AspectRatioPreset[] = [
  {
    value: "freeform",
    label: "Tự do",
    aspectRatio: undefined,
    icon: <Crop className="size-4" />,
  },
  {
    value: "1:1",
    label: "Vuông",
    aspectRatio: 1,
    icon: <Square className="size-4" />,
  },
  {
    value: "16:9",
    label: "16:9",
    aspectRatio: 16 / 9,
    icon: <RectangleHorizontal className="size-4" />,
  },
  {
    value: "4:3",
    label: "4:3",
    aspectRatio: 4 / 3,
    icon: <RectangleHorizontal className="size-4" />,
  },
];

const COVER_IMAGE_PRESETS: AspectRatioPreset[] = [
  {
    value: "desktop",
    label: "Desktop (1200×630)",
    aspectRatio: 1200 / 630,
    icon: <Monitor className="size-4" />,
  },
  {
    value: "mobile",
    label: "Mobile (600×400)",
    aspectRatio: 600 / 400,
    icon: <Smartphone className="size-4" />,
  },
];

// ============================================================================
// UTILITIES
// ============================================================================

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

// ============================================================================
// COMPONENT
// ============================================================================

export function ImageCropperDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  defaultAspectRatio,
  allowFreeform = true,
  aspectPresets,
  title = "Cắt ảnh",
  description = "Kéo để di chuyển, cuộn để phóng to/thu nhỏ.",
}: ImageCropperDialogProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaResult | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>(
    defaultAspectRatio === undefined ? "freeform" : "custom",
  );
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(
    defaultAspectRatio,
  );

  // Determine which presets to use
  const presets =
    aspectPresets ||
    (allowFreeform ? DEFAULT_ASPECT_PRESETS : COVER_IMAGE_PRESETS);

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

  const handlePresetChange = useCallback(
    (value: string) => {
      setSelectedPreset(value);
      const preset = presets.find((p) => p.value === value);
      setAspectRatio(preset?.aspectRatio);
    },
    [presets],
  );

  useEffect(() => {
    if (open) {
      handleReset();
      setAspectRatio(defaultAspectRatio);
      setSelectedPreset(
        defaultAspectRatio === undefined ? "freeform" : "custom",
      );
    }
  }, [open, defaultAspectRatio, handleReset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="size-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Aspect Ratio Presets */}
          {presets.length > 1 && (
            <div className="flex items-center gap-3">
              <Label className="text-sm shrink-0">Tỷ lệ:</Label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={
                      selectedPreset === preset.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePresetChange(preset.value)}
                    className="gap-1.5 text-xs"
                  >
                    {preset.icon}
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Cropper */}
          <div className="relative h-[350px] rounded-xl overflow-hidden bg-black/90">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropAreaComplete}
              showGrid={true}
              classes={{
                containerClassName: "rounded-xl",
                cropAreaClassName: "!border-primary !border-2",
              }}
            />
          </div>

          {/* Controls */}
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

// Export presets for reuse
export { DEFAULT_ASPECT_PRESETS, COVER_IMAGE_PRESETS };
