"use client";

import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  CodeSquare,
  Minus,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarProps {
  editor: Editor | null;
  onImageUpload?: (file: File) => Promise<string>;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  tooltip,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-8",
            isActive && "bg-muted text-muted-foreground"
          )}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export function Toolbar({ editor, onImageUpload }: ToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }

    setLinkUrl("");
    setIsLinkPopoverOpen(false);
  }, [editor, linkUrl]);

  const handleImageUpload = useCallback(async () => {
    if (!onImageUpload) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setIsImageUploading(true);
        const url = await onImageUpload(file);
        editor?.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error("Failed to upload image:", error);
      } finally {
        setIsImageUploading(false);
      }
    };

    input.click();
  }, [editor, onImageUpload]);

  if (!editor) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-wrap items-center gap-0.5 border-b p-1 bg-muted/30">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Hoàn tác (Ctrl+Z)"
        >
          <Undo className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Làm lại (Ctrl+Y)"
        >
          <Redo className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Đậm (Ctrl+B)"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Nghiêng (Ctrl+I)"
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          tooltip="Gạch chân (Ctrl+U)"
        >
          <Underline className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="Gạch ngang"
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          tooltip="Đánh dấu"
        >
          <Highlighter className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          tooltip="Mã inline"
        >
          <Code className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          tooltip="Tiêu đề 1"
        >
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          tooltip="Tiêu đề 2"
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          tooltip="Tiêu đề 3"
        >
          <Heading3 className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="Danh sách"
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="Danh sách đánh số"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          tooltip="Trích dẫn"
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          tooltip="Khối mã"
        >
          <CodeSquare className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          tooltip="Đường kẻ ngang"
        >
          <Minus className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          tooltip="Căn trái"
        >
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          tooltip="Căn giữa"
        >
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          tooltip="Căn phải"
        >
          <AlignRight className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          tooltip="Căn đều"
        >
          <AlignJustify className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-8",
                editor.isActive("link") && "bg-muted text-muted-foreground"
              )}
            >
              <LinkIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">URL liên kết</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setLink();
                    }
                  }}
                />
                <Button type="button" onClick={setLink} size="sm">
                  Thêm
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            tooltip="Xóa liên kết"
          >
            <Unlink className="size-4" />
          </ToolbarButton>
        )}

        {onImageUpload && (
          <ToolbarButton
            onClick={handleImageUpload}
            disabled={isImageUploading}
            tooltip="Chèn hình ảnh"
          >
            {isImageUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImageIcon className="size-4" />
            )}
          </ToolbarButton>
        )}
      </div>
    </TooltipProvider>
  );
}
