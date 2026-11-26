import type { JSONContent } from '@tiptap/react';

export function markdownToTiptapDoc(markdown: string | null | undefined): JSONContent {
  if (!markdown || !markdown.trim()) {
    return { type: 'doc', content: [{ type: 'paragraph' }] };
  }

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: JSONContent[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || null;
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({
        type: 'codeBlock',
        attrs: { language },
        content: [{ type: 'text', text: codeLines.join('\n') }],
      });
      continue;
    }

    const calloutMatch = /^>\s*\[!(INFO|TIP|WARNING|DANGER)\]\s*$/i.exec(line);
    if (calloutMatch) {
      const variant = calloutMatch[1].toLowerCase();
      const calloutLines: string[] = [];
      i += 1;
      while (i < lines.length && lines[i].startsWith('>')) {
        calloutLines.push(lines[i].replace(/^>\s?/, '').trim());
        i += 1;
      }
      blocks.push({
        type: 'callout',
        attrs: { variant },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: calloutLines.join(' ') || 'Nota destacada' }],
          },
        ],
      });
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = Math.min(3, Math.max(2, headingMatch[1].length));
      blocks.push({
        type: 'heading',
        attrs: { level },
        content: [{ type: 'text', text: headingMatch[2].trim() }],
      });
      i += 1;
      continue;
    }

    if (line.trim() === '---' || line.trim() === '***') {
      blocks.push({ type: 'horizontalRule' });
      i += 1;
      continue;
    }

    if (line.startsWith('> ')) {
      blocks.push({
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: line.slice(2).trim() }],
          },
        ],
      });
      i += 1;
      continue;
    }

    blocks.push({
      type: 'paragraph',
      content: [{ type: 'text', text: line }],
    });
    i += 1;
  }

  return {
    type: 'doc',
    content: blocks.length > 0 ? blocks : [{ type: 'paragraph' }],
  };
}
