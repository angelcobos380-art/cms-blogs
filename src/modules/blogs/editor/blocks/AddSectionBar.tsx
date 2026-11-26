import type { Editor } from '@tiptap/react';
import {
  AlertCircle,
  Code2,
  Heading2,
  Heading3,
  List,
  Minus,
  Pilcrow,
  Quote,
} from 'lucide-react';

interface AddSectionBarProps {
  editor: Editor | null;
  disabled?: boolean;
}

export function AddSectionBar({ editor, disabled = false }: AddSectionBarProps) {
  if (!editor || disabled) return null;

  const insertSection = (type: string) => {
    const chain = editor.chain().focus();
    switch (type) {
      case 'paragraph':
        chain.insertContent({ type: 'paragraph' }).run();
        break;
      case 'h2':
        chain.insertContent({ type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Nuevo subtítulo' }] }).run();
        break;
      case 'h3':
        chain.insertContent({ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Subsección' }] }).run();
        break;
      case 'callout':
        chain
          .insertContent({
            type: 'callout',
            attrs: { variant: 'info' },
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Nota destacada…' }] }],
          })
          .run();
        break;
      case 'code':
        chain.insertContent({ type: 'codeBlock', attrs: { language: 'ts' } }).run();
        break;
      case 'quote':
        chain
          .insertContent({
            type: 'blockquote',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cita destacada…' }] }],
          })
          .run();
        break;
      case 'list':
        chain.toggleBulletList().run();
        break;
      case 'hr':
        chain.setHorizontalRule().run();
        break;
    }
  };

  const items = [
    { id: 'paragraph', label: 'Párrafo', icon: Pilcrow },
    { id: 'h2', label: 'H2', icon: Heading2 },
    { id: 'h3', label: 'H3', icon: Heading3 },
    { id: 'callout', label: 'Callout', icon: AlertCircle },
    { id: 'code', label: 'Código', icon: Code2 },
    { id: 'quote', label: 'Cita', icon: Quote },
    { id: 'list', label: 'Lista', icon: List },
    { id: 'hr', label: 'Divisor', icon: Minus },
  ];

  return (
    <div className="mt-6 pt-4 border-t border-[var(--cms-border,var(--border))] flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-[var(--cms-text-muted,var(--fg-muted))] mr-1">
        Agregar sección:
      </span>
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => insertSection(id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--cms-border,var(--border))] bg-[var(--cms-surface,var(--bg-subtle))] px-2.5 py-1 text-xs text-[var(--cms-text,var(--fg))] hover:opacity-85 transition cursor-pointer"
        >
          <Icon className="h-3.5 w-3.5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
