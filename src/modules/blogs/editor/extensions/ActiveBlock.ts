import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

const activeBlockKey = new PluginKey('activeBlock');

export const ActiveBlock = Extension.create({
  name: 'activeBlock',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: activeBlockKey,
        props: {
          decorations: (state) => {
            const { doc, selection } = state;
            const { $from } = selection;
            if ($from.depth < 1) return DecorationSet.empty;

            const topIndex = $from.index(0);
            let pos = 0;
            for (let i = 0; i < doc.childCount; i += 1) {
              const child = doc.child(i);
              if (i === topIndex) {
                return DecorationSet.create(doc, [
                  Decoration.node(pos, pos + child.nodeSize, {
                    class: 'is-active-block',
                  }),
                ]);
              }
              pos += child.nodeSize;
            }
            return DecorationSet.empty;
          },
        },
      }),
    ];
  },
});
