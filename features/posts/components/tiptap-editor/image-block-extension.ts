import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageBlockView from "./image-block-view";

export interface ImageBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageBlock: {
      setImageBlock: (attributes: {
        src: string;
        alt?: string;
        caption?: string;
        photoCredit?: string;
      }) => ReturnType;
      updateImageCaption: (caption: string) => ReturnType;
      updateImagePhotoCredit: (photoCredit: string) => ReturnType;
    };
  }
}

export const ImageBlock = Node.create<ImageBlockOptions>({
  name: "imageBlock",

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
      alt: {
        default: "",
      },
      caption: {
        default: "",
      },
      photoCredit: {
        default: "",
      },
      width: {
        default: "100%",
      },
      align: {
        default: "center",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-type='image-block']",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const img = node.querySelector("img");
          const captionEl = node.querySelector("figcaption .caption");
          const photoCreditEl = node.querySelector("figcaption .photo-credit");

          return {
            src: img?.getAttribute("src") || null,
            alt: img?.getAttribute("alt") || "",
            width: img?.getAttribute("width") || "100%",
            caption: captionEl?.textContent || "",
            photoCredit:
              photoCreditEl?.textContent?.replace(/^Ảnh:\s*/, "") || "",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, photoCredit, align, width, ...imgAttrs } = HTMLAttributes;

    const figcaptionContent: (
      | string
      | [string, Record<string, unknown>, string]
    )[] = [];

    if (caption) {
      figcaptionContent.push(["span", { class: "caption" }, caption as string]);
    }
    if (photoCredit) {
      figcaptionContent.push([
        "span",
        { class: "photo-credit" },
        `Ảnh: ${photoCredit}`,
      ]);
    }

    const content: (
      | string
      | [string, Record<string, unknown>]
      | [
          string,
          Record<string, unknown>,
          ...(string | [string, Record<string, unknown>, string])[],
        ]
    )[] = [
      [
        "img",
        { ...imgAttrs, style: `max-width: ${width || "100%"}` } as Record<
          string,
          unknown
        >,
      ],
    ];

    if (figcaptionContent.length > 0) {
      content.push(["figcaption", {}, ...figcaptionContent]);
    }

    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": "image-block",
        class: `image-block align-${align || "center"}`,
        style: `max-width: ${width || "100%"}`,
      }),
      ...content,
    ];
  },

  addCommands() {
    return {
      setImageBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
      updateImageCaption:
        (caption) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { caption });
        },
      updateImagePhotoCredit:
        (photoCredit) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { photoCredit });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView);
  },
});
