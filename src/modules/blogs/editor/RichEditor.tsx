import { useEffect } from 'react';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import type { TemplateTokens } from '@templates';
import { useEditorStore } from './editor.store';
import { createEditorExtensions } from './extensions';
import { countWordsFromDoc, extractOutline } from './serializers';
import { TemplateScope } from './TemplateScope';
import { EditorToolbar } from './toolbar/EditorToolbar';

interface RichEditorProps {
  title: string;
  initialDoc: JSONContent;
  tokens?: TemplateTokens | null;
  tags: string[];
  coverImageUrl?: string | null;
  readOnly?: boolean;
  onTitleChange: (title: string) => void;
  onDocChange: (doc: JSONContent, html: string) => void;
}

export function RichEditor({
  title,
  initialDoc,
  tokens,
  tags,
  coverImageUrl,
  readOnly = false,
  onTitleChange,
  onDocChange,
}: RichEditorProps) {
  const setStats = useEditorStore((s) => s.setStats);

  const editor = useEditor({
    extensions: createEditorExtensions(),
    content: initialDoc,
    editable: !readOnly,
    onCreate: ({ editor: instance }) => {
      const json = instance.getJSON();
      setStats(countWordsFromDoc(json), extractOutline(json));
    },
    onUpdate: ({ editor: instance }) => {
      const json = instance.getJSON();
      setStats(countWordsFromDoc(json), extractOutline(json));
      onDocChange(json, instance.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.isEditable !== !readOnly) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  const isCentered = tokens?.layout.headerStyle === 'editorial-centered';

  return (
    <div className="space-y-3">
      <EditorToolbar editor={editor} disabled={readOnly} />

      <TemplateScope tokens={tokens}>
        <header className={isCentered ? 'text-center space-y-3 pb-6 border-b' : 'space-y-3 pb-6 border-b'}>
          {tags.length > 0 && (
            <div className={isCentered ? 'flex flex-wrap gap-1.5 justify-center' : 'flex flex-wrap gap-1.5'}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-2.5 py-0.5 text-xs text-[var(--cms-text-muted,var(--fg-muted))]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <input
            type="text"
            value={title}
            disabled={readOnly}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Título del artículo…"
            className="w-full bg-transparent text-3xl md:text-4xl font-bold tracking-tight focus:outline-none [font-family:var(--cms-heading-font,inherit)] disabled:opacity-80"
            style={{ textAlign: isCentered ? 'center' : 'left' }}
          />
        </header>

        {coverImageUrl && (
          <figure className="my-6">
            <img
              src={coverImageUrl}
              alt={title || 'Imagen de portada'}
              className="w-full h-auto object-cover border"
              style={{ borderRadius: 'var(--cms-image-radius, 12px)' }}
            />
          </figure>
        )}

        <div className="pt-2">
          <EditorContent editor={editor} />
        </div>
      </TemplateScope>
    </div>
  );
}
