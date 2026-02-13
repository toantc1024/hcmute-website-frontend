import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import FileAttachmentBlockView from "./file-attachment-view";

export interface FileAttachmentOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fileAttachment: {
      setFileAttachment: (attributes: {
        src: string;
        fileName: string;
        fileType: string;
        fileSize?: number;
        displayType: "iframe" | "link";
        title?: string;
      }) => ReturnType;
      updateFileAttachment: (
        attributes: Partial<{
          src: string;
          fileName: string;
          fileType: string;
          fileSize?: number;
          displayType: "iframe" | "link";
          title?: string;
        }>,
      ) => ReturnType;
    };
  }
}

export const FileAttachment = Node.create<FileAttachmentOptions>({
  name: "fileAttachment",

  group: "block",

  draggable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      fileName: {
        default: "",
      },
      fileType: {
        default: "",
      },
      fileSize: {
        default: 0,
      },
      displayType: {
        default: "link",
      },
      title: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='file-attachment']",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const element = node as HTMLElement;

          return {
            src: element.getAttribute("data-src") || null,
            fileName: element.getAttribute("data-filename") || "",
            fileType: element.getAttribute("data-filetype") || "",
            fileSize: parseInt(
              element.getAttribute("data-filesize") || "0",
              10,
            ),
            displayType: element.getAttribute("data-displaytype") || "link",
            title: element.getAttribute("data-title") || "",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, fileName, fileType, fileSize, displayType, title } =
      HTMLAttributes;

    const isPdf =
      fileType === "application/pdf" ||
      fileName?.toLowerCase().endsWith(".pdf");
    const displayTitle = title || fileName;

    // For iframe display (PDF only)
    if (displayType === "iframe" && isPdf && src) {
      return [
        "div",
        mergeAttributes(this.options.HTMLAttributes, {
          "data-type": "file-attachment",
          "data-src": src,
          "data-filename": fileName,
          "data-filetype": fileType,
          "data-filesize": fileSize,
          "data-displaytype": displayType,
          "data-title": title,
          class: "file-attachment-block iframe-view",
        }),
        [
          "div",
          { class: "file-attachment-header" },
          [
            "span",
            { class: "file-attachment-title" },
            displayTitle || "Tài liệu PDF",
          ],
        ],
        [
          "iframe",
          {
            src,
            width: "100%",
            height: "600",
            frameborder: "0",
            class: "file-attachment-iframe",
          },
        ],
      ];
    }

    // For link display
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": "file-attachment",
        "data-src": src,
        "data-filename": fileName,
        "data-filetype": fileType,
        "data-filesize": fileSize,
        "data-displaytype": displayType,
        "data-title": title,
        class: "file-attachment-block link-view",
      }),
      [
        "a",
        {
          href: src,
          target: "_blank",
          rel: "noopener noreferrer",
          download: fileName,
          class: "file-attachment-link",
        },
        displayTitle || fileName || "Tải tệp",
      ],
    ];
  },

  addCommands() {
    return {
      setFileAttachment:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
      updateFileAttachment:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileAttachmentBlockView);
  },
});
