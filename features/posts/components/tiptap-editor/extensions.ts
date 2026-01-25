import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

export function getExtensions(placeholder?: string) {
  return [
    StarterKit.configure({
      codeBlock: false,
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    Placeholder.configure({
      placeholder: placeholder || 'Bắt đầu viết nội dung...',
      emptyEditorClass: 'is-editor-empty',
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline',
      },
    }),
    Image.configure({
      inline: true,
      allowBase64: false,
      HTMLAttributes: {
        class: 'rounded-lg max-w-full',
      },
    }),
    Underline,
    Highlight.configure({
      multicolor: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
  ];
}
