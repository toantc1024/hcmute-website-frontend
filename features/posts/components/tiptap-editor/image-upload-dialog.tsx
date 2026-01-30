"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Loader2,
  Crop,
  Type,
  Camera,
  X,
  ImageIcon,
  Check,
} from "lucide-react";
import Cropper, { Area, Point } from "react-easy-crop";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CroppedAreaResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageInsert: (url: string, caption?: string, photoCredit?: string) => void;
  onUpload: (file: File) => Promise<string>;
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

type UploadStep = "select" | "crop" | "details";

export function ImageUploadDialog({
  open,
  onOpenChange,
  onImageInsert,
  onUpload,
}: ImageUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [step, setStep] = useState<UploadStep>("select");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Crop state
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaResult | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);

  // Caption state
  const [caption, setCaption] = useState("");
  const [photoCredit, setPhotoCredit] = useState("");

  const resetState = useCallback(() => {
    setStep("select");
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
    setUploadProgress(0);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsCropping(false);
    setCroppedPreview(null);
    setCaption("");
    setPhotoCredit("");
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onOpenChange(false);
  }, [onOpenChange, resetState]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setStep("crop");
    },
    [],
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStep("crop");
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onCropComplete = useCallback(
    (_: Area, croppedAreaPixels: CroppedAreaResult) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleSkipCrop = useCallback(() => {
    setStep("details");
  }, []);

  const handleApplyCrop = useCallback(async () => {
    if (!previewUrl || !croppedAreaPixels) {
      setStep("details");
      return;
    }

    try {
      setIsCropping(true);
      const { url } = await getCroppedImg(previewUrl, croppedAreaPixels);
      setCroppedPreview(url);
      setStep("details");
    } catch (error) {
      console.error("Crop failed:", error);
      setStep("details");
    } finally {
      setIsCropping(false);
    }
  }, [previewUrl, croppedAreaPixels]);

  const handleUploadAndInsert = useCallback(async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      let fileToUpload = selectedFile;

      // If we have a cropped image, create a file from it
      if (croppedPreview) {
        const response = await fetch(croppedPreview);
        const blob = await response.blob();
        fileToUpload = new File([blob], selectedFile.name, {
          type: "image/jpeg",
        });
      }

      const uploadedUrl = await onUpload(fileToUpload);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Insert image with caption
      onImageInsert(
        uploadedUrl,
        caption || undefined,
        photoCredit || undefined,
      );

      handleClose();
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
    }
  }, [
    selectedFile,
    croppedPreview,
    caption,
    photoCredit,
    onUpload,
    onImageInsert,
    handleClose,
  ]);

  const displayPreview = croppedPreview || previewUrl;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="size-5" />
            Chèn hình ảnh
          </DialogTitle>
          <DialogDescription>
            Tải lên hình ảnh, cắt và thêm chú thích
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Select Image */}
        {step === "select" && (
          <div
            className={cn(
              "relative flex flex-col items-center justify-center",
              "min-h-[300px] rounded-xl border-2 border-dashed",
              "border-muted-foreground/25 hover:border-primary/50",
              "transition-colors cursor-pointer",
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="size-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">
              Kéo thả hoặc nhấn để chọn ảnh
            </p>
            <p className="text-sm text-muted-foreground">
              Hỗ trợ JPG, PNG, GIF, WebP
            </p>
          </div>
        )}

        {/* Step 2: Crop Image */}
        {step === "crop" && previewUrl && (
          <div className="space-y-4">
            <div className="relative h-[350px] bg-muted rounded-xl overflow-hidden">
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-16 text-sm">Zoom</Label>
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={1}
                max={3}
                step={0.1}
                className="flex-1"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleSkipCrop}>
                Bỏ qua cắt ảnh
              </Button>
              <Button onClick={handleApplyCrop} disabled={isCropping}>
                {isCropping ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Crop className="mr-2 size-4" />
                )}
                Áp dụng
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Add Details */}
        {step === "details" && (
          <div className="space-y-4">
            {/* Preview */}
            {displayPreview && (
              <div className="relative">
                <img
                  src={displayPreview}
                  alt="Preview"
                  className="w-full max-h-[250px] object-contain rounded-xl bg-muted"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setStep("crop")}
                >
                  <Crop className="mr-1.5 size-3.5" />
                  Cắt lại
                </Button>
              </div>
            )}

            {/* Caption & Photo Credit */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Type className="size-3.5" />
                  Chú thích ảnh
                </Label>
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Nhập chú thích cho ảnh (hiển thị dưới ảnh)..."
                />
                <p className="text-xs text-muted-foreground">
                  Chú thích sẽ hiển thị dưới ảnh dạng in nghiêng
                </p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Camera className="size-3.5" />
                  Photo Credit (Tùy chọn)
                </Label>
                <Input
                  value={photoCredit}
                  onChange={(e) => setPhotoCredit(e.target.value)}
                  placeholder="Tên người chụp ảnh..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {step === "details" && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button onClick={handleUploadAndInsert} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Đang tải lên ({uploadProgress}%)
                </>
              ) : (
                <>
                  <Check className="mr-2 size-4" />
                  Chèn ảnh
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
