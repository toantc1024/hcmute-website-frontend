"use client";

import { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";

import { cn } from "@/lib/utils";
import { getExtensions } from "./extensions";
import { Toolbar, type AIAction } from "./toolbar";

import "./styles.css";

export interface TiptapEditorProps {
  content?: string;
  contentJson?: JSONContent;
  onChange?: (html: string, json: JSONContent) => void;
  onImageUpload?: (file: File) => Promise<string>;
  onAIAssist?: (action: AIAction, selectedText?: string) => Promise<string>;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  showToolbar?: boolean;
}

export function TiptapEditor({
  content = "",
  contentJson,
  onChange,
  onImageUpload,
  onAIAssist,
  placeholder,
  editable = true,
  className,
  minHeight = 300,
  maxHeight,
  showToolbar = true,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: getExtensions(placeholder),
    content: contentJson || content,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none",
          "px-4 py-3 h-full",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      onChange?.(html, json);
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  useEffect(() => {
    if (editor && contentJson && !editor.isDestroyed) {
      const currentJson = JSON.stringify(editor.getJSON());
      const newJson = JSON.stringify(contentJson);
      if (currentJson !== newJson) {
        editor.commands.setContent(contentJson);
      }
    }
  }, [editor, contentJson]);

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background flex flex-col min-w-0 w-full overflow-hidden",
        !editable && "opacity-60",
        className,
      )}
      style={{ minHeight: minHeight ? `${minHeight}px` : undefined }}
    >
      {showToolbar && editable && (
        <div className="shrink-0">
          <Toolbar
            editor={editor}
            onImageUpload={onImageUpload}
            onAIAssist={onAIAssist}
          />
        </div>
      )}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
        style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
      >
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}

export function TiptapViewer({
  content,
  contentJson,
  className,
}: {
  content?: string;
  contentJson?: JSONContent;
  className?: string;
}) {
  const editor = useEditor({
    extensions: getExtensions(),
    content: contentJson || content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn("prose prose-sm dark:prose-invert max-w-none", "px-4 py-3"),
      },
    },
  });

  return (
    <div className={cn("rounded-md border bg-background", className)}>
      <EditorContent editor={editor} />
    </div>
  );
}
