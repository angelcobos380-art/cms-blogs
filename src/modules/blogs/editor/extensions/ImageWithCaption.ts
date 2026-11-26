import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageWithCaption: {
      setImageWithCaption: (attrs: {
        src: string;
        alt?: string;
        caption?: string;
      }) => ReturnType;
    };
  }
}

export const ImageWithCaption = Node.create({
  name: 'imageWithCaption',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const img = el.querySelector('img');
          if (!img) return false;
          const cap = el.querySelector('figcaption');
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt') ?? '',
            caption: cap?.textContent ?? '',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = String(HTMLAttributes.src ?? '');
    const alt = String(HTMLAttributes.alt ?? '');
    const caption = String(HTMLAttributes.caption ?? '');

    if (caption) {
      return [
        'figure',
        mergeAttributes({ class: 'cms-figure' }),
        ['img', { src, alt, loading: 'lazy' }],
        ['figcaption', {}, caption],
      ];
    }

    return [
      'figure',
      mergeAttributes({ class: 'cms-figure' }),
      ['img', { src, alt, loading: 'lazy' }],
    ];
  },

  addCommands() {
    return {
      setImageWithCaption:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
});
