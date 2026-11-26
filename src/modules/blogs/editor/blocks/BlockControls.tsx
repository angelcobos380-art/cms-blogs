import type { Editor } from '@tiptap/react';
import { ArrowDown, ArrowUp, Copy, Trash2 } from 'lucide-react';
import type { CalloutVariant } from '../extensions/Callout';
import {
  duplicateActiveBlock,
  getActiveTopBlockIndex,
  moveActiveBlock,
  removeActiveBlock,
} from './blockCommands';

interface BlockControlsProps {
  editor: Editor | null;
  disabled?: boolean;
}

export function BlockControls({ editor, disabled = false }: BlockControlsProps) {
  if (!editor || disabled) return null;

  const idx = getActiveTopBlockIndex(editor);
  const total = editor.state.doc.childCount;
  const inCallout = editor.isActive('callout');
  const calloutVariant = (editor.getAttributes('callout').variant as CalloutVariant) ?? 'info';

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-[var(--card)] px-3 py-1.5 text-xs">
      <div className="flex items-center gap-2 text-[var(--fg-muted)]">
        <span>
          Sección activa: <strong className="text-[var(--fg)]">{idx >= 0 ? idx + 1 : 1}</strong> / {total}
        </span>

        {inCallout && (
          <select
            aria-label="Variante de callout"
            value={calloutVariant}
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .setCalloutVariant(e.target.value as CalloutVariant)
                .run()
            }
            className="h-7 rounded-md border bg-[var(--bg)] px-2 text-xs text-[var(--fg)]"
          >
            <option value="info">Callout: Info</option>
            <option value="tip">Callout: Tip</option>
            <option value="warning">Callout: Warning</option>
            <option value="danger">Callout: Danger</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          title="Subir sección"
          aria-label="Subir sección"
          disabled={idx <= 0}
          onClick={() => moveActiveBlock(editor, -1)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--bg-subtle)] disabled:opacity-40 cursor-pointer"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="Bajar sección"
          aria-label="Bajar sección"
          disabled={idx < 0 || idx >= total - 1}
          onClick={() => moveActiveBlock(editor, 1)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--bg-subtle)] disabled:opacity-40 cursor-pointer"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="Duplicar sección"
          aria-label="Duplicar sección"
          disabled={idx < 0}
          onClick={() => duplicateActiveBlock(editor)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--bg-subtle)] disabled:opacity-40 cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="Eliminar sección"
          aria-label="Eliminar sección"
          disabled={idx < 0 || total <= 1}
          onClick={() => removeActiveBlock(editor)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--danger)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
