import { Node, mergeAttributes } from "@tiptap/core";

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
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, photoCredit, ...imgAttrs } = HTMLAttributes;

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
    )[] = [["img", imgAttrs as Record<string, unknown>]];

    if (figcaptionContent.length > 0) {
      content.push(["figcaption", {}, ...figcaptionContent]);
    }

    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": "image-block",
        class: "image-block",
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
});
