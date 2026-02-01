"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  Trash2,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { filesApi, type FileDto } from "@/features/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImageId?: string;
  selectedImageUrl?: string;
  onSelect: (file: FileDto | null) => void;
  title?: string;
  description?: string;
}

export function ImageUploadModal({
  open,
  onOpenChange,
  selectedImageId,
  selectedImageUrl,
  onSelect,
  title = "Chọn hình ảnh",
  description = "Tải lên hình ảnh mới hoặc chọn từ thư viện",
}: ImageUploadModalProps) {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [libraryImages, setLibraryImages] = useState<FileDto[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadLibrary = useCallback(
    async (forceRefresh = false) => {
      if (libraryLoaded && !forceRefresh) return;

      try {
        setIsLoadingLibrary(true);
        const files = await filesApi.getAdminFiles({ size: 50 });
        const imageFiles = files.filter(
          (f) =>
            f.fileType.startsWith("image/") ||
            /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.fileName),
        );
        setLibraryImages(imageFiles);
        setLibraryLoaded(true);
      } catch (err) {
        toast.error("Không thể tải thư viện ảnh");
      } finally {
        setIsLoadingLibrary(false);
      }
    },
    [libraryLoaded],
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "library") {
      loadLibrary();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp hình ảnh");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước tệp tối đa là 10MB");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      let uploadedFile: FileDto;

      uploadedFile = await filesApi.uploadFile(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success("Tải lên thành công");
      onSelect(uploadedFile);

      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      setLibraryLoaded(false);
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tải lên tệp";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectLibraryImage = (file: FileDto) => {
    onSelect(file);
    toast.success("Đã chọn hình ảnh");
    onOpenChange(false);
  };

  const handleClearSelection = () => {
    onSelect(null);
    toast.info("Đã xóa hình ảnh");
    onOpenChange(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp hình ảnh");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước tệp tối đa là 10MB");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          clearPreview();
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="size-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {selectedImageUrl && (
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <img
              src={selectedImageUrl}
              alt="Current"
              className="size-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">Hình ảnh hiện tại</p>
              <p className="text-xs text-muted-foreground truncate max-w-xs">
                {selectedImageId}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearSelection}>
              <Trash2 className="mr-2 size-4" />
              Xóa
            </Button>
          </div>
        )}

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Tải lên</TabsTrigger>
            <TabsTrigger value="library">Thư viện</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                >
                  <Upload className="mx-auto size-12 text-muted-foreground" />
                  <p className="mt-4 text-sm font-medium">
                    Kéo thả hoặc nhấn để chọn hình ảnh
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG, GIF, WebP (tối đa 10MB)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={clearPreview}
                  >
                    <X className="size-4" />
                  </Button>
                  <p className="mt-2 text-sm text-center text-muted-foreground">
                    {selectedFile?.name} (
                    {Math.round((selectedFile?.size || 0) / 1024)}KB)
                  </p>
                </div>
              )}

              {isUploading && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="library" className="mt-4">
            <ScrollArea className="h-[320px]">
              {isLoadingLibrary ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
              ) : libraryImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="mx-auto size-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Thư viện trống. Hãy tải lên hình ảnh đầu tiên!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {libraryImages.map((file) => {
                    const isSelected = selectedImageId === file.id;
                    return (
                      <div
                        key={file.id}
                        className={cn(
                          "relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 transition-all",
                          isSelected
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent hover:border-primary/50",
                        )}
                        onClick={() => handleSelectLibraryImage(file)}
                        onMouseEnter={() => setHoveredImageId(file.id)}
                        onMouseLeave={() => setHoveredImageId(null)}
                      >
                        <img
                          src={file.publicUrl}
                          alt={file.fileName}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="size-8 text-primary" />
                          </div>
                        )}
                        {hoveredImageId === file.id && !isSelected && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <p className="text-white text-xs font-medium px-2 text-center truncate">
                              {file.fileName}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          {activeTab === "upload" && previewUrl && (
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <Upload className="mr-2 size-4" />
                  Tải lên & Chọn
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
