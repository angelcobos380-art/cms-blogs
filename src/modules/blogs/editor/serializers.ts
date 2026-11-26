import type { JSONContent } from '@tiptap/react';
import type { OutlineHeading } from './editor.store';

function serializeInline(nodes?: JSONContent[]): string {
  if (!nodes) return '';
  return nodes
    .map((node) => {
      if (node.type === 'hardBreak') return '  \n';
      let text = node.text ?? '';
      for (const mark of node.marks ?? []) {
        if (mark.type === 'bold') text = `**${text}**`;
        else if (mark.type === 'italic') text = `*${text}*`;
        else if (mark.type === 'strike') text = `~~${text}~~`;
        else if (mark.type === 'code') text = `\`${text}\``;
        else if (mark.type === 'link') {
          const href = String(mark.attrs?.href ?? '');
          text = `[${text}](${href})`;
        }
      }
      return text;
    })
    .join('');
}

function serializeNode(node: JSONContent): string {
  switch (node.type) {
    case 'paragraph':
      return serializeInline(node.content);
    case 'heading': {
      const level = Math.min(6, Math.max(1, Number(node.attrs?.level ?? 2)));
      return `${'#'.repeat(level)} ${serializeInline(node.content)}`;
    }
    case 'bulletList':
      return (node.content ?? [])
        .map((li) => `- ${(li.content ?? []).map(serializeNode).join('\n  ')}`)
        .join('\n');
    case 'orderedList':
      return (node.content ?? [])
        .map((li, idx) => `${idx + 1}. ${(li.content ?? []).map(serializeNode).join('\n   ')}`)
        .join('\n');
    case 'blockquote':
      return (node.content ?? [])
        .map((child) => `> ${serializeNode(child)}`)
        .join('\n');
    case 'codeBlock': {
      const lang = String(node.attrs?.language ?? '');
      const code = (node.content ?? []).map((c) => c.text ?? '').join('');
      return `\`\`\`${lang}\n${code}\n\`\`\``;
    }
    case 'horizontalRule':
      return '---';
    case 'image': {
      const alt = String(node.attrs?.alt ?? '');
      const src = String(node.attrs?.src ?? '');
      return `![${alt}](${src})`;
    }
    default:
      return (node.content ?? []).map(serializeNode).join('\n\n');
  }
}

export function jsonToMarkdown(doc: JSONContent | null | undefined): string {
  if (!doc || !doc.content) return '';
  return doc.content
    .map(serializeNode)
    .filter((block) => block.trim().length > 0)
    .join('\n\n');
}

export function extractOutline(doc: JSONContent | null | undefined): OutlineHeading[] {
  if (!doc?.content) return [];
  const headings: OutlineHeading[] = [];
  for (const node of doc.content) {
    if (node.type === 'heading') {
      const level = Number(node.attrs?.level ?? 2);
      const text = serializeInline(node.content).trim();
      if (text) headings.push({ level, text });
    }
  }
  return headings;
}

export function countWordsFromDoc(doc: JSONContent | null | undefined): number {
  if (!doc?.content) return 0;
  const collectText = (n: JSONContent): string => {
    if (n.text) return n.text;
    return (n.content ?? []).map(collectText).join(' ');
  };
  const plain = collectText(doc).replace(/\s+/g, ' ').trim();
  return plain ? plain.split(' ').length : 0;
}
