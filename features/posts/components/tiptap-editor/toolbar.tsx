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
  Sparkles,
  Wand2,
  ChevronDown,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageUploadDialog } from "./image-upload-dialog";

interface ToolbarProps {
  editor: Editor | null;
  onImageUpload?: (file: File) => Promise<string>;
  onAIAssist?: (action: AIAction, selectedText?: string) => Promise<string>;
}

export type AIAction =
  | "improve"
  | "shorten"
  | "expand"
  | "translate_vi"
  | "translate_en"
  | "fix_grammar"
  | "make_formal"
  | "make_casual"
  | "summarize"
  | "generate";

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
          className={cn("size-8", isActive && "bg-muted text-muted-foreground")}
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

export function Toolbar({ editor, onImageUpload, onAIAssist }: ToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");

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

  const handleImageInsert = useCallback(
    (url: string, caption?: string, photoCredit?: string) => {
      editor
        ?.chain()
        .focus()
        .setImageBlock({ src: url, caption, photoCredit })
        .run();
    },
    [editor],
  );

  const handleAIAction = useCallback(
    async (action: AIAction) => {
      if (!onAIAssist || !editor) return;

      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, " ");

      try {
        setIsAILoading(true);
        const result = await onAIAssist(action, selectedText || undefined);

        if (selectedText) {
          // Replace selected text with AI result
          editor.chain().focus().deleteSelection().insertContent(result).run();
        } else {
          // Insert at cursor position
          editor.chain().focus().insertContent(result).run();
        }
      } catch (error) {
        console.error("AI assist failed:", error);
      } finally {
        setIsAILoading(false);
      }
    },
    [editor, onAIAssist],
  );

  const handleAIGenerate = useCallback(async () => {
    if (!onAIAssist || !editor || !aiPrompt.trim()) return;

    try {
      setIsAILoading(true);
      const result = await onAIAssist("generate", aiPrompt);
      editor.chain().focus().insertContent(result).run();
      setAIPrompt("");
      setShowAIPrompt(false);
    } catch (error) {
      console.error("AI generate failed:", error);
    } finally {
      setIsAILoading(false);
    }
  }, [editor, onAIAssist, aiPrompt]);

  if (!editor) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1 bg-muted/30">
        {/* Undo/Redo */}
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

        {/* Basic Formatting */}
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

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Headings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 gap-1 px-2",
                (editor.isActive("heading", { level: 1 }) ||
                  editor.isActive("heading", { level: 2 }) ||
                  editor.isActive("heading", { level: 3 })) &&
                  "bg-muted",
              )}
            >
              <Heading1 className="size-4" />
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 1 }) && "bg-muted",
              )}
            >
              <Heading1 className="mr-2 size-4" />
              Tiêu đề 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 2 }) && "bg-muted",
              )}
            >
              <Heading2 className="mr-2 size-4" />
              Tiêu đề 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 3 }) && "bg-muted",
              )}
            >
              <Heading3 className="mr-2 size-4" />
              Tiêu đề 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Lists */}
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

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Link */}
        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-8",
                editor.isActive("link") && "bg-muted text-muted-foreground",
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

        {/* Image */}
        {onImageUpload && (
          <ToolbarButton
            onClick={() => setShowImageDialog(true)}
            tooltip="Chèn hình ảnh"
          >
            <ImageIcon className="size-4" />
          </ToolbarButton>
        )}

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* AI Button */}
        {onAIAssist && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 gap-1.5 px-2 font-medium",
                  "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
                  "hover:from-violet-500/20 hover:to-purple-500/20",
                  "text-violet-600 dark:text-violet-400",
                )}
                disabled={isAILoading}
              >
                {isAILoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                AI
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleAIAction("improve")}>
                <Wand2 className="mr-2 size-4" />
                Cải thiện văn bản
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction("fix_grammar")}>
                <Wand2 className="mr-2 size-4" />
                Sửa lỗi ngữ pháp
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAIAction("shorten")}>
                Rút gọn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction("expand")}>
                Mở rộng
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction("summarize")}>
                Tóm tắt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAIAction("make_formal")}>
                Chuyển sang văn phong trang trọng
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction("make_casual")}>
                Chuyển sang văn phong thân thiện
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAIAction("translate_vi")}>
                🇻🇳 Dịch sang Tiếng Việt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction("translate_en")}>
                🇬🇧 Dịch sang Tiếng Anh
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowAIPrompt(true)}>
                <Sparkles className="mr-2 size-4" />
                Viết với AI...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* More Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2"
            >
              Công cụ khác
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(editor.isActive("strike") && "bg-muted")}
            >
              <Strikethrough className="mr-2 size-4" />
              Gạch ngang
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={cn(editor.isActive("highlight") && "bg-muted")}
            >
              <Highlighter className="mr-2 size-4" />
              Đánh dấu
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn(editor.isActive("code") && "bg-muted")}
            >
              <Code className="mr-2 size-4" />
              Mã inline
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn(editor.isActive("blockquote") && "bg-muted")}
            >
              <Quote className="mr-2 size-4" />
              Trích dẫn
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={cn(editor.isActive("codeBlock") && "bg-muted")}
            >
              <CodeSquare className="mr-2 size-4" />
              Khối mã
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <Minus className="mr-2 size-4" />
              Đường kẻ ngang
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={cn(
                editor.isActive({ textAlign: "left" }) && "bg-muted",
              )}
            >
              <AlignLeft className="mr-2 size-4" />
              Căn trái
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={cn(
                editor.isActive({ textAlign: "center" }) && "bg-muted",
              )}
            >
              <AlignCenter className="mr-2 size-4" />
              Căn giữa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={cn(
                editor.isActive({ textAlign: "right" }) && "bg-muted",
              )}
            >
              <AlignRight className="mr-2 size-4" />
              Căn phải
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={cn(
                editor.isActive({ textAlign: "justify" }) && "bg-muted",
              )}
            >
              <AlignJustify className="mr-2 size-4" />
              Căn đều
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* AI Generate Prompt Popover */}
        {onAIAssist && (
          <Popover open={showAIPrompt} onOpenChange={setShowAIPrompt}>
            <PopoverTrigger asChild>
              <span />
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    Viết với AI
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Mô tả nội dung bạn muốn AI viết
                  </p>
                </div>
                <Textarea
                  placeholder="Ví dụ: Viết đoạn giới thiệu về trường HCMUTE với phong cách chuyên nghiệp..."
                  value={aiPrompt}
                  onChange={(e) => setAIPrompt(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIPrompt(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAIGenerate}
                    disabled={isAILoading || !aiPrompt.trim()}
                  >
                    {isAILoading ? (
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1.5 size-3.5" />
                    )}
                    Tạo nội dung
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Image Upload Dialog */}
      {onImageUpload && (
        <ImageUploadDialog
          open={showImageDialog}
          onOpenChange={setShowImageDialog}
          onImageInsert={handleImageInsert}
          onUpload={onImageUpload}
        />
      )}
    </TooltipProvider>
  );
}
