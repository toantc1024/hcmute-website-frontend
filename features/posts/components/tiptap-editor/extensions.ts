import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { ImageBlock } from "./image-block-extension";

const lowlight = createLowlight(common);

export interface ExtensionOptions {
  placeholder?: string;
  openLinksOnClick?: boolean;
}

export function getExtensions(options?: ExtensionOptions | string) {
  // Support legacy string parameter for placeholder
  const opts: ExtensionOptions =
    typeof options === "string" ? { placeholder: options } : options || {};

  const { placeholder, openLinksOnClick = false } = opts;

  return [
    StarterKit.configure({
      codeBlock: false,
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    Placeholder.configure({
      placeholder: placeholder || "Bắt đầu viết nội dung...",
      emptyEditorClass: "is-editor-empty",
    }),
    Link.configure({
      openOnClick: openLinksOnClick,
      HTMLAttributes: {
        class: "text-primary underline",
        ...(openLinksOnClick && {
          target: "_blank",
          rel: "noopener noreferrer",
        }),
      },
    }),
    Image.configure({
      inline: true,
      allowBase64: false,
      HTMLAttributes: {
        class: "rounded-lg max-w-full",
      },
    }),
    ImageBlock,
    Underline,
    Highlight.configure({
      multicolor: true,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
  ];
}
