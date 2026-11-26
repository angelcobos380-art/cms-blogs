import { mergeAttributes, Node } from '@tiptap/core';

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'danger';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (variant?: CalloutVariant) => ReturnType;
      setCalloutVariant: (variant: CalloutVariant) => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: 'info',
        parseHTML: (element) => {
          const cls = element.getAttribute('class') ?? '';
          const match = /callout-(info|tip|warning|danger)/.exec(cls);
          return (match?.[1] as CalloutVariant) ?? 'info';
        },
        renderHTML: (attributes) => ({
          class: `callout callout-${String(attributes.variant ?? 'info')}`,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.callout' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setCallout:
        (variant: CalloutVariant = 'info') =>
        ({ commands }) => {
          return commands.wrapIn(this.name, { variant });
        },
      setCalloutVariant:
        (variant: CalloutVariant) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { variant });
        },
    };
  },
});
