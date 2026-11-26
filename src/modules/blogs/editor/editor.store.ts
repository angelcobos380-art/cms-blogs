import { create } from 'zustand';

export type SaveStatus = 'saved' | 'dirty' | 'saving' | 'error' | 'local-pending';

export interface OutlineHeading {
  level: number;
  text: string;
}

interface EditorState {
  mode: 'edit' | 'reader';
  device: 'desktop' | 'mobile';
  inspectorOpen: boolean;
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  saveError: string | null;
  wordCount: number;
  outline: OutlineHeading[];
  setMode: (mode: 'edit' | 'reader') => void;
  setDevice: (device: 'desktop' | 'mobile') => void;
  toggleInspector: () => void;
  setSaveStatus: (status: SaveStatus, error?: string | null) => void;
  markSaved: () => void;
  setStats: (wordCount: number, outline: OutlineHeading[]) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: 'edit',
  device: 'desktop',
  inspectorOpen: true,
  saveStatus: 'saved',
  lastSavedAt: null,
  saveError: null,
  wordCount: 0,
  outline: [],
  setMode: (mode) => set({ mode }),
  setDevice: (device) => set({ device }),
  toggleInspector: () => set((s) => ({ inspectorOpen: !s.inspectorOpen })),
  setSaveStatus: (saveStatus, saveError = null) => set({ saveStatus, saveError }),
  markSaved: () =>
    set({
      saveStatus: 'saved',
      lastSavedAt: new Date().toISOString(),
      saveError: null,
    }),
  setStats: (wordCount, outline) => set({ wordCount, outline }),
  reset: () =>
    set({
      mode: 'edit',
      device: 'desktop',
      saveStatus: 'saved',
      lastSavedAt: null,
      saveError: null,
      wordCount: 0,
      outline: [],
    }),
}));
