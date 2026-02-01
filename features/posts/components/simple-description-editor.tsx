"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Link2, Unlink, ExternalLink } from "lucide-react";

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

interface SimpleDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

export function SimpleDescriptionEditor({
  value,
  onChange,
  placeholder = "Mô tả ngắn gọn về bài viết...",
  maxLength = 500,
  disabled = false,
  className,
}: SimpleDescriptionEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable all formatting except basic text
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        bold: false,
        italic: false,
        strike: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-2 cursor-pointer hover:text-primary/80",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[80px] max-h-[120px] overflow-y-auto",
          "text-sm leading-relaxed",
          "focus:outline-none",
          "px-3 py-2",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const textLength = editor.state.doc.textContent.length;
      setCharacterCount(textLength);

      // Only update if within limit
      if (textLength <= maxLength) {
        onChange(html);
      }
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
      setCharacterCount(editor.state.doc.textContent.length);
    }
  }, [value, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  // Initial character count
  useEffect(() => {
    if (editor) {
      setCharacterCount(editor.state.doc.textContent.length);
    }
  }, [editor]);

  const handleAddLink = useCallback(() => {
    if (!editor || !linkUrl) return;

    // Validate URL - add https:// if missing
    let finalUrl = linkUrl.trim();
    if (finalUrl && !finalUrl.match(/^https?:\/\//i)) {
      finalUrl = `https://${finalUrl}`;
    }

    // If there's selected text, wrap it with link
    if (editor.state.selection.empty) {
      // No selection, insert link with URL as text
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${finalUrl}">${finalUrl}</a>`)
        .run();
    } else {
      // Wrap only the selected text with link (don't extend mark range)
      editor.chain().focus().setLink({ href: finalUrl }).run();
    }

    setLinkUrl("");
    setLinkPopoverOpen(false);
  }, [editor, linkUrl]);

  const handleRemoveLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const isLinkActive = editor?.isActive("link") ?? false;

  if (!editor) return null;

  return (
    <div
      className={cn(
        "rounded-xl border  border-border bg-background transition-colors",
        "focus-within:ring-1 focus-within:ring-ring focus-within:border-ring",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {/* Mini Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border/50 bg-muted/30 rounded-t-xl">
        <TooltipProvider delayDuration={300}>
          <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant={isLinkActive ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={disabled}
                  >
                    <Link2 className="size-3.5 mr-1" />
                    Thêm link
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Thêm liên kết</TooltipContent>
            </Tooltip>
            <PopoverContent
              className="w-80"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">URL liên kết</Label>
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="h-8 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      // Stop propagation to prevent editor shortcuts
                      e.stopPropagation();
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLink();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        setLinkPopoverOpen(false);
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLinkPopoverOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleAddLink} disabled={!linkUrl}>
                    <ExternalLink className="size-3 mr-1" />
                    Thêm
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {isLinkActive && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  onClick={handleRemoveLink}
                  disabled={disabled}
                >
                  <Unlink className="size-3.5 mr-1" />
                  Xóa link
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xóa liên kết</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>

        {/* Character count */}
        <div className="ml-auto">
          <span
            className={cn(
              "text-xs",
              characterCount >= maxLength * 0.8
                ? "text-orange-500"
                : "text-muted-foreground",
              characterCount >= maxLength && "text-destructive",
            )}
          >
            {characterCount}/{maxLength}
          </span>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
