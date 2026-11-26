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
});
