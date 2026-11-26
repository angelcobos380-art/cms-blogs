import { useCallback, useEffect, useRef } from 'react';
import { normalizeApiError } from '@core/api/errors';
import { env } from '@core/config/env';
import { useEditorStore } from '../editor/editor.store';
import type { PatchPostPayload, PostStatus } from '../types/post.types';
import { useSavePost } from './useSavePost';

const localDraftKey = (postId: string) => `cms_published_draft_${postId}`;

export function readLocalPublishedDraft(postId: string): PatchPostPayload | null {
  try {
    const raw = window.localStorage.getItem(localDraftKey(postId));
    return raw ? (JSON.parse(raw) as PatchPostPayload) : null;
  } catch {
    return null;
  }
}

export function clearLocalPublishedDraft(postId: string) {
  window.localStorage.removeItem(localDraftKey(postId));
}

export function useAutosave(postId: string, status: PostStatus | undefined) {
  const saveMutation = useSavePost(postId);
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);
  const markSaved = useEditorStore((s) => s.markSaved);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<PatchPostPayload>({});
  const inFlightRef = useRef(false);

  const flushDraft = useCallback(async () => {
    if (inFlightRef.current) return;
    const payload = pendingRef.current;
    if (Object.keys(payload).length === 0) return;

    pendingRef.current = {};
    inFlightRef.current = true;
    setSaveStatus('saving');

    try {
      await saveMutation.mutateAsync(payload);
      markSaved();
    } catch (err) {
      pendingRef.current = { ...payload, ...pendingRef.current };
      setSaveStatus('error', normalizeApiError(err).message);
    } finally {
      inFlightRef.current = false;
      if (Object.keys(pendingRef.current).length > 0) {
        void flushDraft();
      }
    }
  }, [markSaved, saveMutation, setSaveStatus]);

  const queueChange = useCallback(
    (patch: PatchPostPayload) => {
      if (!status || status === 'ARCHIVADO') return;

      pendingRef.current = { ...pendingRef.current, ...patch };

      if (status === 'PUBLICADO') {
        try {
          window.localStorage.setItem(localDraftKey(postId), JSON.stringify(pendingRef.current));
        } catch {
          // Ignore storage quota errors
        }
        setSaveStatus('local-pending');
        return;
      }

      // BORRADOR: autoguardado debounced
      setSaveStatus('dirty');
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void flushDraft();
      }, env.VITE_AUTOSAVE_DELAY_MS);
    },
    [flushDraft, postId, setSaveStatus, status],
  );

  const commitPublishedChanges = useCallback(async () => {
    const localDraft = readLocalPublishedDraft(postId);
    const merged = { ...(localDraft ?? {}), ...pendingRef.current };
    if (Object.keys(merged).length === 0) return;

    pendingRef.current = {};
    setSaveStatus('saving');
    try {
      await saveMutation.mutateAsync(merged);
      clearLocalPublishedDraft(postId);
      markSaved();
    } catch (err) {
      pendingRef.current = merged;
      setSaveStatus('error', normalizeApiError(err).message);
      throw err;
    }
  }, [markSaved, postId, saveMutation, setSaveStatus]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    queueChange,
    flushDraft,
    commitPublishedChanges,
    isSaving: saveMutation.isPending,
  };
}
