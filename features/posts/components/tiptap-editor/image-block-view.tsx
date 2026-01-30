"use client";

import { useState, useCallback } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import {
  Pencil,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  GripVertical,
  Camera,
  Type,
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

export default function ImageBlockView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) {
  const { src, alt, caption, photoCredit, width, align } = node.attrs;
  const [isEditing, setIsEditing] = useState(false);
  const [tempCaption, setTempCaption] = useState(caption || "");
  const [tempPhotoCredit, setTempPhotoCredit] = useState(photoCredit || "");
  const [tempAlt, setTempAlt] = useState(alt || "");

  const handleSave = useCallback(() => {
    updateAttributes({
      caption: tempCaption,
      photoCredit: tempPhotoCredit,
      alt: tempAlt,
    });
    setIsEditing(false);
  }, [tempCaption, tempPhotoCredit, tempAlt, updateAttributes]);

  const handleAlignChange = (newAlign: string) => {
    updateAttributes({ align: newAlign });
  };

  const handleDoubleClick = useCallback(() => {
    setTempCaption(caption || "");
    setTempPhotoCredit(photoCredit || "");
    setTempAlt(alt || "");
    setIsEditing(true);
  }, [caption, photoCredit, alt]);

  const getAlignClass = () => {
    switch (align) {
      case "left":
        return "mr-auto";
      case "right":
        return "ml-auto";
      default:
        return "mx-auto";
    }
  };

  return (
    <NodeViewWrapper>
      <figure
        className={cn(
          "image-block relative group my-4",
          selected && "ring-2 ring-primary ring-offset-2 rounded-xl",
          getAlignClass(),
        )}
        style={{ maxWidth: width }}
        data-drag-handle
        onDoubleClick={handleDoubleClick}
      >
        {/* Toolbar */}
        <div
          className={cn(
            "absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-popover border rounded-lg p-1 shadow-lg z-10 transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <TooltipProvider delayDuration={0}>
            <div className="flex items-center gap-0.5">
              <div className="px-1 cursor-grab">
                <GripVertical className="size-4 text-muted-foreground" />
              </div>

              <div className="w-px h-4 bg-border mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("size-7", align === "left" && "bg-muted")}
                    onClick={() => handleAlignChange("left")}
                  >
                    <AlignLeft className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Căn trái</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("size-7", align === "center" && "bg-muted")}
                    onClick={() => handleAlignChange("center")}
                  >
                    <AlignCenter className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Căn giữa</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("size-7", align === "right" && "bg-muted")}
                    onClick={() => handleAlignChange("right")}
                  >
                    <AlignRight className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Căn phải</TooltipContent>
              </Tooltip>

              <div className="w-px h-4 bg-border mx-1" />

              <Popover open={isEditing} onOpenChange={setIsEditing}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-7">
                    <Pencil className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="center">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <Type className="size-3.5" />
                        Chú thích ảnh
                      </Label>
                      <Input
                        value={tempCaption}
                        onChange={(e) => setTempCaption(e.target.value)}
                        placeholder="Nhập chú thích cho ảnh..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <Camera className="size-3.5" />
                        Photo Credit
                      </Label>
                      <Input
                        value={tempPhotoCredit}
                        onChange={(e) => setTempPhotoCredit(e.target.value)}
                        placeholder="Tên người chụp ảnh..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alt Text (SEO)</Label>
                      <Input
                        value={tempAlt}
                        onChange={(e) => setTempAlt(e.target.value)}
                        placeholder="Mô tả ảnh cho SEO..."
                      />
                    </div>
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
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={deleteNode}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Xóa ảnh</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        {/* Image */}
        <img
          src={src}
          alt={alt || caption || ""}
          className="w-full rounded-xl object-cover cursor-pointer"
          title="Nhấn đúp để chỉnh sửa"
        />

        {/* Caption & Photo Credit - Italic style like [url](text) */}
        {(caption || photoCredit) && (
          <figcaption className="mt-2 text-center text-sm">
            {caption && (
              <span className="block italic text-muted-foreground">
                {caption}
              </span>
            )}
            {photoCredit && (
              <span className="block text-xs text-muted-foreground/70">
                Ảnh: {photoCredit}
              </span>
            )}
          </figcaption>
        )}

        {/* Quick caption input when no caption */}
        {!caption && !photoCredit && selected && (
          <div className="mt-2 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-1.5 size-3" />
              Thêm chú thích
            </Button>
          </div>
        )}
      </figure>
    </NodeViewWrapper>
  );
}
