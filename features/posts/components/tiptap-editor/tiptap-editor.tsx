"use client";

import { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";

import { cn } from "@/lib/utils";
import { getExtensions } from "./extensions";
import { Toolbar } from "./toolbar";

import "./styles.css";

export interface TiptapEditorProps {
  content?: string;
  contentJson?: JSONContent;
  onChange?: (html: string, json: JSONContent) => void;
  onImageUpload?: (file: File) => Promise<string>;
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
  placeholder,
  editable = true,
  className,
  minHeight = 300,
  maxHeight = 600,
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
          "px-4 py-3"
        ),
        style: `min-height: ${minHeight}px; max-height: ${maxHeight}px; overflow-y: auto;`,
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
        "rounded-md border bg-background overflow-hidden",
        !editable && "opacity-60",
        className
      )}
    >
      {showToolbar && editable && (
        <Toolbar editor={editor} onImageUpload={onImageUpload} />
      )}
      <EditorContent editor={editor} />
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
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none",
          "px-4 py-3"
        ),
      },
    },
  });

  return (
    <div className={cn("rounded-md border bg-background", className)}>
      <EditorContent editor={editor} />
    </div>
  );
}
