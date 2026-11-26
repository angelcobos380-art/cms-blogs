import { describe, expect, it } from 'vitest';
import { markdownToTiptapDoc } from './importMarkdown';
import { extractOutline, jsonToMarkdown } from './serializers';

describe('editor serializers & markdown importer', () => {
  it('convierte Markdown antiguo a Tiptap JSON y de vuelta a Markdown', () => {
    const md = '## Introducción\n\nHola **mundo**';
    const doc = markdownToTiptapDoc(md);
    expect(doc.type).toBe('doc');
    expect(extractOutline(doc)).toEqual([{ level: 2, text: 'Introducción' }]);
    expect(jsonToMarkdown(doc)).toContain('## Introducción');
  });

  it('soporta callouts GFM (> [!TIP]) e imageWithCaption en Markdown', () => {
    const md = '> [!TIP]\n> Usa tokens JSON para estilos.\n\n![Portada](https://cdn.example.com/a.webp)';
    const doc = markdownToTiptapDoc(md);
    expect(doc.content?.[0]?.type).toBe('callout');
    expect(doc.content?.[0]?.attrs?.variant).toBe('tip');

    const serialized = jsonToMarkdown({
      type: 'doc',
      content: [
        doc.content![0],
        {
          type: 'imageWithCaption',
          attrs: { src: 'https://cdn.example.com/a.webp', alt: 'Portada', caption: 'Pie' },
        },
      ],
    });
    expect(serialized).toContain('> [!TIP]');
    expect(serialized).toContain('![Portada](https://cdn.example.com/a.webp)');
  });
});
