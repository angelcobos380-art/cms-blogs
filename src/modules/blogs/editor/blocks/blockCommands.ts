import type { Editor } from '@tiptap/react';

export function getActiveTopBlockIndex(editor: Editor): number {
  const { $from } = editor.state.selection;
  return $from.depth >= 1 ? $from.index(0) : -1;
}

export function moveActiveBlock(editor: Editor, direction: -1 | 1): boolean {
  const doc = editor.state.doc;
  const idx = getActiveTopBlockIndex(editor);
  const targetIdx = idx + direction;
  if (idx < 0 || targetIdx < 0 || targetIdx >= doc.childCount) {
    return false;
  }

  const json = editor.getJSON();
  const content = [...(json.content ?? [])];
  const [moved] = content.splice(idx, 1);
  content.splice(targetIdx, 0, moved);

  editor.commands.setContent({ ...json, content }, { emitUpdate: true });
  return true;
}

export function duplicateActiveBlock(editor: Editor): boolean {
  const idx = getActiveTopBlockIndex(editor);
  if (idx < 0) return false;

  const json = editor.getJSON();
  const content = [...(json.content ?? [])];
  const target = content[idx];
  if (!target) return false;

  const copy = JSON.parse(JSON.stringify(target)) as typeof target;
  content.splice(idx + 1, 0, copy);
  editor.commands.setContent({ ...json, content }, { emitUpdate: true });
  return true;
}

export function removeActiveBlock(editor: Editor): boolean {
  const idx = getActiveTopBlockIndex(editor);
  const json = editor.getJSON();
  const content = [...(json.content ?? [])];
  if (idx < 0 || content.length <= 1) return false;

  content.splice(idx, 1);
  editor.commands.setContent({ ...json, content }, { emitUpdate: true });
  return true;
}
