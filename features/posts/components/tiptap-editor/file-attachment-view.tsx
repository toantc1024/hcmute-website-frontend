"use client";

import { useState, useCallback, useRef } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import {
  Pencil,
  Trash2,
  GripVertical,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileArchive,
  File,
  Download,
  ExternalLink,
  RefreshCw,
  Monitor,
  Link as LinkIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ============================================================================
// UTILITIES
// ============================================================================

function getFileIcon(fileType: string, fileName: string) {
  const ext = fileName?.split(".").pop()?.toLowerCase();

  // PDF
  if (fileType === "application/pdf" || ext === "pdf") {
    return <FileText className="size-6 text-red-500" />;
  }

  // Images
  if (fileType?.startsWith("image/")) {
    return <FileImage className="size-6 text-blue-500" />;
  }

  // Videos
  if (fileType?.startsWith("video/")) {
    return <FileVideo className="size-6 text-purple-500" />;
  }

  // Audio
  if (fileType?.startsWith("audio/")) {
    return <FileAudio className="size-6 text-green-500" />;
  }

  // Spreadsheets
  if (
    fileType?.includes("spreadsheet") ||
    fileType?.includes("excel") ||
    ext === "xlsx" ||
    ext === "xls" ||
    ext === "csv"
  ) {
    return <FileSpreadsheet className="size-6 text-emerald-600" />;
  }

  // Archives
  if (
    fileType?.includes("zip") ||
    fileType?.includes("rar") ||
    fileType?.includes("7z") ||
    fileType?.includes("tar") ||
    ext === "zip" ||
    ext === "rar" ||
    ext === "7z"
  ) {
    return <FileArchive className="size-6 text-amber-600" />;
  }

  // Word documents
  if (
    fileType?.includes("word") ||
    fileType?.includes("document") ||
    ext === "doc" ||
    ext === "docx"
  ) {
    return <FileText className="size-6 text-blue-600" />;
  }

  // Default
  return <File className="size-6 text-gray-500" />;
}

function isPdfFile(fileType: string, fileName: string): boolean {
  return (
    fileType === "application/pdf" ||
    fileName?.toLowerCase().endsWith(".pdf")
  );
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// ============================================================================
// COMPONENT
// ============================================================================

interface FileAttachmentBlockViewProps extends NodeViewProps {
  onUpdateFile?: () => void;
}

export default function FileAttachmentBlockView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: FileAttachmentBlockViewProps) {
  const { src, fileName, fileType, fileSize, displayType, title } = node.attrs;
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title || "");
  const [tempDisplayType, setTempDisplayType] = useState<"iframe" | "link">(
    displayType || "link"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPdf = isPdfFile(fileType, fileName);
  const displayTitle = title || fileName;

  const handleSave = useCallback(() => {
    updateAttributes({
      title: tempTitle,
      displayType: tempDisplayType,
    });
    setIsEditing(false);
  }, [tempTitle, tempDisplayType, updateAttributes]);

  const handleDoubleClick = useCallback(() => {
    setTempTitle(title || "");
    setTempDisplayType(displayType || "link");
    setIsEditing(true);
  }, [title, displayType]);

  const handleOpenEdit = useCallback(() => {
    setTempTitle(title || "");
    setTempDisplayType(displayType || "link");
    setIsEditing(true);
  }, [title, displayType]);

  // Render iframe view for PDF
  if (displayType === "iframe" && isPdf && src) {
    return (
      <NodeViewWrapper>
        <div
          className={cn(
            "file-attachment-block relative group my-4 mx-auto rounded-xl border bg-card overflow-hidden",
            selected && "ring-2 ring-primary ring-offset-2",
          )}
          data-drag-handle
          onDoubleClick={handleDoubleClick}
        >
          {/* Toolbar */}
          <div
            className={cn(
              "absolute top-2 right-2 flex items-center gap-1 bg-popover/95 backdrop-blur-sm border rounded-lg p-1.5 shadow-lg z-10 transition-opacity",
              selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
          >
            <TooltipProvider delayDuration={0}>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="px-1.5 cursor-grab">
                      <GripVertical className="size-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Kéo để di chuyển</TooltipContent>
                </Tooltip>

                <div className="w-px h-5 bg-border" />

                <Popover open={isEditing} onOpenChange={setIsEditing}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={handleOpenEdit}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Chỉnh sửa</TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tiêu đề hiển thị</Label>
                        <Input
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          placeholder={fileName}
                        />
                      </div>
                      
                      {isPdf && (
                        <div className="space-y-2">
                          <Label>Kiểu hiển thị</Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={tempDisplayType === "iframe" ? "default" : "outline"}
                              size="sm"
                              className="flex-1"
                              onClick={() => setTempDisplayType("iframe")}
                            >
                              <Monitor className="mr-2 size-4" />
                              Xem trực tiếp
                            </Button>
                            <Button
                              type="button"
                              variant={tempDisplayType === "link" ? "default" : "outline"}
                              size="sm"
                              className="flex-1"
                              onClick={() => setTempDisplayType("link")}
                            >
                              <LinkIcon className="mr-2 size-4" />
                              Link tải
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <Button className="w-full" onClick={handleSave}>
                        Lưu thay đổi
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => window.open(src, "_blank")}
                    >
                      <ExternalLink className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mở trong tab mới</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={deleteNode}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Xóa</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/50">
            {getFileIcon(fileType, fileName)}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{displayTitle}</div>
              {fileSize > 0 && (
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(fileSize)}
                </div>
              )}
            </div>
          </div>

          {/* PDF Iframe */}
          <iframe
            src={src}
            className="w-full border-0"
            style={{ height: "600px" }}
            title={displayTitle}
          />
        </div>
      </NodeViewWrapper>
    );
  }

  // Render link view
  return (
    <NodeViewWrapper>
      <div
        className={cn(
          "file-attachment-block relative group my-4 mx-auto max-w-md",
          selected && "ring-2 ring-primary ring-offset-2 rounded-xl",
        )}
        data-drag-handle
        onDoubleClick={handleDoubleClick}
      >
        {/* Toolbar */}
        <div
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-popover/95 backdrop-blur-sm border rounded-lg p-1.5 shadow-lg z-10 transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <TooltipProvider delayDuration={0}>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="px-1.5 cursor-grab">
                    <GripVertical className="size-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Kéo để di chuyển</TooltipContent>
              </Tooltip>

              <div className="w-px h-5 bg-border" />

              <Popover open={isEditing} onOpenChange={setIsEditing}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={handleOpenEdit}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Chỉnh sửa</TooltipContent>
                </Tooltip>
                <PopoverContent className="w-80" align="center">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tiêu đề hiển thị</Label>
                      <Input
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        placeholder={fileName}
                      />
                    </div>
                    
                    {isPdf && (
                      <div className="space-y-2">
                        <Label>Kiểu hiển thị</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={tempDisplayType === "iframe" ? "default" : "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={() => setTempDisplayType("iframe")}
                          >
                            <Monitor className="mr-2 size-4" />
                            Xem trực tiếp
                          </Button>
                          <Button
                            type="button"
                            variant={tempDisplayType === "link" ? "default" : "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={() => setTempDisplayType("link")}
                          >
                            <LinkIcon className="mr-2 size-4" />
                            Link tải
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full" onClick={handleSave}>
                      Lưu thay đổi
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={deleteNode}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Xóa</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        {/* File Card */}
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          download={fileName}
          className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 p-3 rounded-lg bg-muted">
            {getFileIcon(fileType, fileName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{displayTitle}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {fileSize > 0 && <span>{formatFileSize(fileSize)}</span>}
              <span className="text-xs uppercase">
                {fileName?.split(".").pop()}
              </span>
            </div>
          </div>
          <Download className="size-5 text-muted-foreground shrink-0" />
        </a>
      </div>
    </NodeViewWrapper>
  );
}
