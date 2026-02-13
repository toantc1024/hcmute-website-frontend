"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileArchive,
  Loader2,
  X,
  Trash2,
  Check,
  Download,
  ExternalLink,
  Code,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

import { filesApi, type FileDto } from "@/features/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// ============================================================================
// TYPES
// ============================================================================

export type AttachmentDisplayType = "iframe" | "link";

export interface FileAttachment {
  file: FileDto;
  displayType: AttachmentDisplayType;
  title?: string;
}

interface FileAttachmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAttach: (attachment: FileAttachment) => void;
  title?: string;
  description?: string;
}

// ============================================================================
// UTILITIES
// ============================================================================

function getFileIcon(fileType: string, fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();

  // PDF
  if (fileType === "application/pdf" || ext === "pdf") {
    return <FileText className="size-8 text-red-500" />;
  }

  // Images
  if (fileType.startsWith("image/")) {
    return <FileImage className="size-8 text-blue-500" />;
  }

  // Videos
  if (fileType.startsWith("video/")) {
    return <FileVideo className="size-8 text-purple-500" />;
  }

  // Audio
  if (fileType.startsWith("audio/")) {
    return <FileAudio className="size-8 text-green-500" />;
  }

  // Spreadsheets
  if (
    fileType.includes("spreadsheet") ||
    fileType.includes("excel") ||
    ext === "xlsx" ||
    ext === "xls" ||
    ext === "csv"
  ) {
    return <FileSpreadsheet className="size-8 text-emerald-600" />;
  }

  // Archives
  if (
    fileType.includes("zip") ||
    fileType.includes("rar") ||
    fileType.includes("tar") ||
    ext === "zip" ||
    ext === "rar" ||
    ext === "7z"
  ) {
    return <FileArchive className="size-8 text-yellow-600" />;
  }

  // Word documents
  if (
    fileType.includes("word") ||
    fileType.includes("document") ||
    ext === "doc" ||
    ext === "docx"
  ) {
    return <FileText className="size-8 text-blue-600" />;
  }

  // Default
  return <File className="size-8 text-gray-500" />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function isPdfFile(fileType: string, fileName: string): boolean {
  return (
    fileType === "application/pdf" ||
    fileName.toLowerCase().endsWith(".pdf")
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FileAttachmentModal({
  open,
  onOpenChange,
  onAttach,
  title = "Đính kèm tệp",
  description = "Tải lên tệp mới hoặc chọn từ thư viện",
}: FileAttachmentModalProps) {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const [libraryFiles, setLibraryFiles] = useState<FileDto[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [libraryLoaded, setLibraryLoaded] = useState(false);

  // Selected file state
  const [selectedFile, setSelectedFile] = useState<FileDto | null>(null);
  const [displayType, setDisplayType] = useState<AttachmentDisplayType>("link");
  const [attachmentTitle, setAttachmentTitle] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setPreviewFile(null);
    setSelectedFile(null);
    setDisplayType("link");
    setAttachmentTitle("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const loadLibrary = useCallback(
    async (forceRefresh = false) => {
      if (libraryLoaded && !forceRefresh) return;

      try {
        setIsLoadingLibrary(true);
        const files = await filesApi.getAdminFiles({ size: 100 });
        // Filter out images - we want documents and other files
        const documentFiles = files.filter(
          (f) => !f.fileType.startsWith("image/"),
        );
        setLibraryFiles(documentFiles);
        setLibraryLoaded(true);
      } catch (err) {
        toast.error("Không thể tải thư viện tệp");
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

    // Max file size: 50MB
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Kích thước tệp tối đa là 50MB");
      return;
    }

    setPreviewFile(file);
    setAttachmentTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension for title
  };

  const handleUpload = async () => {
    if (!previewFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const uploadedFile = await filesApi.uploadFile(previewFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success("Tải lên thành công");

      // Auto-select the uploaded file
      setSelectedFile(uploadedFile);
      setActiveTab("options");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tải lên tệp";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectLibraryFile = (file: FileDto) => {
    setSelectedFile(file);
    setAttachmentTitle(file.fileName.replace(/\.[^/.]+$/, ""));
    setActiveTab("options");
  };

  const handleAttach = () => {
    if (!selectedFile) return;

    onAttach({
      file: selectedFile,
      displayType,
      title: attachmentTitle || selectedFile.fileName,
    });

    toast.success("Đã đính kèm tệp");
    resetState();
    onOpenChange(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Kích thước tệp tối đa là 50MB");
      return;
    }

    setPreviewFile(file);
    setAttachmentTitle(file.name.replace(/\.[^/.]+$/, ""));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const clearPreview = () => {
    setPreviewFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isPdf = selectedFile
    ? isPdfFile(selectedFile.fileType, selectedFile.fileName)
    : previewFile
      ? isPdfFile(previewFile.type, previewFile.name)
      : false;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetState();
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Tải lên</TabsTrigger>
            <TabsTrigger value="library">Thư viện</TabsTrigger>
            <TabsTrigger value="options" disabled={!selectedFile}>
              Tùy chọn
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="flex-1 mt-4">
            <div className="space-y-4">
              {!previewFile ? (
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="mx-auto size-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">
                    Kéo thả tệp vào đây hoặc click để chọn
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, XLS, XLSX, ZIP... (tối đa 50MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.txt,.csv"
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {getFileIcon(previewFile.type, previewFile.name)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{previewFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(previewFile.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearPreview}
                      disabled={isUploading}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  {isUploading && (
                    <div className="mt-4">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        Đang tải lên... {uploadProgress}%
                      </p>
                    </div>
                  )}

                  {!isUploading && (
                    <Button
                      className="w-full mt-4"
                      onClick={handleUpload}
                    >
                      <Upload className="mr-2 size-4" />
                      Tải lên
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="flex-1 mt-4 min-h-0">
            <ScrollArea className="h-[300px]">
              {isLoadingLibrary ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : libraryFiles.length === 0 ? (
                <div className="text-center py-12">
                  <File className="mx-auto size-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Chưa có tệp nào trong thư viện
                  </p>
                </div>
              ) : (
                <div className="space-y-2 pr-4">
                  {libraryFiles.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                        selectedFile?.id === file.id &&
                          "border-primary bg-primary/5",
                      )}
                      onClick={() => handleSelectLibraryFile(file)}
                    >
                      {getFileIcon(file.fileType, file.fileName)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">
                          {file.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(file.createdDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      {selectedFile?.id === file.id && (
                        <Check className="size-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Options Tab */}
          <TabsContent value="options" className="flex-1 mt-4">
            {selectedFile && (
              <div className="space-y-6">
                {/* Selected file preview */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  {getFileIcon(selectedFile.fileType, selectedFile.fileName)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {selectedFile.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Đã chọn để đính kèm
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setActiveTab("upload");
                    }}
                  >
                    Thay đổi
                  </Button>
                </div>

                {/* Title input */}
                <div className="space-y-2">
                  <Label htmlFor="attachment-title">Tiêu đề hiển thị</Label>
                  <Input
                    id="attachment-title"
                    value={attachmentTitle}
                    onChange={(e) => setAttachmentTitle(e.target.value)}
                    placeholder="Nhập tiêu đề cho tệp đính kèm"
                  />
                </div>

                {/* Display type selection - only for PDF */}
                {isPdfFile(selectedFile.fileType, selectedFile.fileName) && (
                  <div className="space-y-3">
                    <Label>Kiểu hiển thị</Label>
                    <div className="space-y-3">
                      <div
                        className={cn(
                          "flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                          displayType === "iframe" &&
                            "border-primary bg-primary/5",
                        )}
                        onClick={() => setDisplayType("iframe")}
                      >
                        <div
                          className={cn(
                            "size-4 rounded-full border-2 flex items-center justify-center mt-0.5",
                            displayType === "iframe"
                              ? "border-primary"
                              : "border-muted-foreground/30",
                          )}
                        >
                          {displayType === "iframe" && (
                            <div className="size-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="cursor-pointer font-medium text-sm">
                            <Code className="inline-block mr-2 size-4" />
                            Nhúng trực tiếp (Iframe)
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Hiển thị PDF trực tiếp trong bài viết, người đọc có
                            thể xem mà không cần tải xuống
                          </p>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                          displayType === "link" &&
                            "border-primary bg-primary/5",
                        )}
                        onClick={() => setDisplayType("link")}
                      >
                        <div
                          className={cn(
                            "size-4 rounded-full border-2 flex items-center justify-center mt-0.5",
                            displayType === "link"
                              ? "border-primary"
                              : "border-muted-foreground/30",
                          )}
                        >
                          {displayType === "link" && (
                            <div className="size-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="cursor-pointer font-medium text-sm">
                            <LinkIcon className="inline-block mr-2 size-4" />
                            Liên kết tải xuống
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Hiển thị nút với biểu tượng tệp, người đọc click để
                            tải xuống
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* For non-PDF files, show info */}
                {!isPdfFile(selectedFile.fileType, selectedFile.fileName) && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <LinkIcon className="inline-block mr-2 size-4" />
                      Tệp này sẽ hiển thị dưới dạng liên kết tải xuống với biểu
                      tượng loại tệp
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleAttach} disabled={!selectedFile}>
            <Check className="mr-2 size-4" />
            Đính kèm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
