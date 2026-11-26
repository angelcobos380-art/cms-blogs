import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { JSONContent } from '@tiptap/react';
import { ArrowLeft, Eye, Monitor, PanelRight, Send, Smartphone, Undo2 } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import { normalizeApiError } from '@core/api/errors';
import { ErrorState } from '@shared/components/ErrorState';
import { toast } from '@shared/components/Toaster';
import { Button } from '@shared/components/ui/button';
import { useUnsavedChangesGuard } from '@shared/hooks/useUnsavedChangesGuard';
import { useTemplates } from '@templates';
import { PublishDialog } from '../components/PublishDialog';
import { StatusPill } from '../components/StatusPill';
import { useEditorStore } from '../editor/editor.store';
import { markdownToTiptapDoc } from '../editor/importMarkdown';
import { ReaderPreview } from '../editor/preview/ReaderPreview';
import { RichEditor } from '../editor/RichEditor';
import { jsonToMarkdown } from '../editor/serializers';
import { InspectorPanel } from '../editor/sidebar/InspectorPanel';
import { readLocalPublishedDraft, useAutosave } from '../hooks/useAutosave';
import { usePost } from '../hooks/usePost';
import { usePostTransitions } from '../hooks/usePostTransitions';
import type { SeoMeta } from '../types/post.types';

export function PostEditorPage() {
  const { postId = '' } = useParams();
  const { data: post, isLoading, isError, error, refetch } = usePost(postId);
  const { data: templatesData } = useTemplates('ACTIVA');
  const { unpublish } = usePostTransitions();

  const mode = useEditorStore((s) => s.mode);
  const device = useEditorStore((s) => s.device);
  const inspectorOpen = useEditorStore((s) => s.inspectorOpen);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const saveError = useEditorStore((s) => s.saveError);
  const setMode = useEditorStore((s) => s.setMode);
  const setDevice = useEditorStore((s) => s.setDevice);
  const toggleInspector = useEditorStore((s) => s.toggleInspector);
  const resetEditor = useEditorStore((s) => s.reset);

  const [publishOpen, setPublishOpen] = useState(false);
  const [draft, setDraft] = useState<{
    postId: string;
    title: string;
    slug: string;
    tags: string[];
    excerpt: string;
    cover_image_url: string;
    template_id: string | null;
    seo: SeoMeta;
    content_json: JSONContent;
    content_html: string;
  } | null>(null);

  const { queueChange, flushDraft, commitPublishedChanges, isSaving } = useAutosave(
    postId,
    post?.status,
  );

  useUnsavedChangesGuard(
    saveStatus === 'dirty' || saveStatus === 'saving' || saveStatus === 'local-pending',
  );

  useEffect(() => {
    return () => resetEditor();
  }, [postId, resetEditor]);

  useEffect(() => {
    if (!post || draft?.postId === post.post_id) return;

    const localPublished = post.status === 'PUBLICADO' ? readLocalPublishedDraft(post.post_id) : null;
    const initialDoc =
      (localPublished?.content_json as JSONContent | undefined) ??
      (post.content_json as JSONContent | null) ??
      markdownToTiptapDoc(post.content);

    setDraft({
      postId: post.post_id,
      title: localPublished?.title ?? post.title,
      slug: localPublished?.slug ?? post.slug,
      tags: localPublished?.tags ?? post.tags ?? [],
      excerpt: localPublished?.excerpt ?? post.excerpt ?? '',
      cover_image_url: localPublished?.cover_image_url ?? post.cover_image_url ?? '',
      template_id: localPublished?.template_id !== undefined ? localPublished.template_id : post.template_id,
      seo: (localPublished?.seo ?? post.seo ?? {}) as SeoMeta,
      content_json: initialDoc,
      content_html: localPublished?.content_html ?? post.content_html ?? '',
    });
  }, [post, draft?.postId]);

  if (isLoading || !draft) {
    return (
      <div className="p-8 text-center text-sm text-[var(--fg-muted)]">
        {isError ? (
          <ErrorState message={normalizeApiError(error).message} onRetry={() => refetch()} />
        ) : (
          'Cargando editor…'
        )}
      </div>
    );
  }

  if (!post) return null;

  const isArchived = post.status === 'ARCHIVADO';
  const isPublished = post.status === 'PUBLICADO';
  const templates = templatesData?.items ?? [];
  const activeTemplate =
    templates.find((t) => t.template_id === draft.template_id) ??
    templates.find((t) => t.is_default) ??
    null;

  const saveLabel =
    isArchived
      ? 'Solo lectura'
      : saveStatus === 'saving'
        ? 'Guardando…'
        : saveStatus === 'dirty'
          ? 'Cambios pendientes…'
          : saveStatus === 'local-pending'
            ? 'Cambios locales sin publicar'
            : saveStatus === 'error'
              ? `Error: ${saveError ?? 'no se pudo guardar'}`
              : 'Guardado';

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Topbar del editor */}
      <div className="rounded-xl border bg-[var(--card)] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to={ROUTES.BLOGS}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              <span>Blogs</span>
            </Button>
          </Link>
          <StatusPill status={post.status} />
          <span className="text-xs text-[var(--fg-muted)]">{saveLabel}</span>
          {saveStatus === 'error' && (
            <Button variant="outline" size="sm" onClick={() => void flushDraft()}>
              Reintentar
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border bg-[var(--bg-subtle)] p-0.5">
            <Button
              variant={mode === 'edit' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setMode('edit')}
            >
              Editar
            </Button>
            <Button
              variant={mode === 'reader' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setMode('reader')}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Vista previa</span>
            </Button>
          </div>

          {mode === 'reader' && (
            <div className="inline-flex rounded-lg border bg-[var(--bg-subtle)] p-0.5">
              <Button
                variant={device === 'desktop' ? 'secondary' : 'ghost'}
                size="sm"
                aria-label="Vista escritorio"
                onClick={() => setDevice('desktop')}
              >
                <Monitor className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={device === 'mobile' ? 'secondary' : 'ghost'}
                size="sm"
                aria-label="Vista móvil"
                onClick={() => setDevice('mobile')}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {mode === 'edit' && (
            <Button variant="outline" size="sm" onClick={toggleInspector}>
              <PanelRight className="h-3.5 w-3.5" />
              <span>{inspectorOpen ? 'Ocultar panel' : 'Panel'}</span>
            </Button>
          )}

          {isPublished && saveStatus === 'local-pending' && (
            <Button
              size="sm"
              disabled={isSaving}
              onClick={async () => {
                try {
                  await commitPublishedChanges();
                  toast.success('Publicación actualizada');
                } catch {
                  toast.error('No se pudo actualizar la publicación');
                }
              }}
            >
              Actualizar publicación
            </Button>
          )}

          {post.status === 'BORRADOR' && (
            <Button size="sm" onClick={() => setPublishOpen(true)}>
              <Send className="h-3.5 w-3.5" />
              <span>Publicar</span>
            </Button>
          )}

          {isPublished && (
            <Button
              variant="outline"
              size="sm"
              disabled={unpublish.isPending}
              onClick={async () => {
                await unpublish.mutateAsync(post.post_id);
                toast.info('Movido a borrador');
              }}
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span>Despublicar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Superficie principal */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 min-w-0 w-full">
          {mode === 'edit' ? (
            <RichEditor
              title={draft.title}
              initialDoc={draft.content_json}
              tokens={activeTemplate?.tokens}
              tags={draft.tags}
              coverImageUrl={draft.cover_image_url}
              readOnly={isArchived}
              onTitleChange={(title) => {
                setDraft((prev) => (prev ? { ...prev, title } : prev));
                queueChange({ title });
              }}
              onDocChange={(doc, html) => {
                setDraft((prev) =>
                  prev ? { ...prev, content_json: doc, content_html: html } : prev,
                );
                queueChange({
                  content_json: doc as Record<string, unknown>,
                  content_html: html,
                  content: jsonToMarkdown(doc),
                  content_schema_version: 1,
                });
              }}
            />
          ) : (
            <ReaderPreview
              title={draft.title}
              excerpt={draft.excerpt}
              tags={draft.tags}
              coverImageUrl={draft.cover_image_url}
              htmlContent={draft.content_html}
              tokens={activeTemplate?.tokens}
              device={device}
            />
          )}
        </div>

        {mode === 'edit' && inspectorOpen && (
          <InspectorPanel
            slug={draft.slug}
            publishedAt={post.published_at}
            tags={draft.tags}
            excerpt={draft.excerpt}
            coverImageUrl={draft.cover_image_url}
            templateId={draft.template_id}
            seo={draft.seo}
            templates={templates}
            readOnly={isArchived}
            onChange={(patch) => {
              setDraft((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  slug: patch.slug ?? prev.slug,
                  tags: patch.tags ?? prev.tags,
                  excerpt: patch.excerpt !== undefined ? (patch.excerpt ?? '') : prev.excerpt,
                  cover_image_url:
                    patch.cover_image_url !== undefined
                      ? (patch.cover_image_url ?? '')
                      : prev.cover_image_url,
                  template_id:
                    patch.template_id !== undefined ? patch.template_id : prev.template_id,
                  seo: patch.seo !== undefined ? (patch.seo ?? {}) : prev.seo,
                };
              });
              queueChange(patch);
            }}
          />
        )}
      </div>

      <PublishDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        postId={post.post_id}
        title={draft.title}
        slug={draft.slug}
        contentHtml={draft.content_html}
        contentMarkdown={post.content}
      />
    </div>
  );
}
