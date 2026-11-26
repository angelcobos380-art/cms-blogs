import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, Edit3, Eye, RotateCcw, Send, Trash2, Undo2 } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import { normalizeApiError } from '@core/api/errors';
import { ConfirmDialog } from '@shared/components/ConfirmDialog';
import { toast } from '@shared/components/Toaster';
import { Button } from '@shared/components/ui/button';
import { postsApi } from '../api/postsApi';
import { usePostTransitions } from '../hooks/usePostTransitions';
import type { PostListItem } from '../types/post.types';
import { PublishDialog } from './PublishDialog';

export function PostActionsMenu({ post }: { post: PostListItem }) {
  const { unpublish, archive, restore, remove } = usePostTransitions();
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishDetail, setPublishDetail] = useState<{
    contentHtml: string | null;
    contentMarkdown: string | null;
  } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openPublishChecklist = async () => {
    try {
      const full = await postsApi.getById(post.post_id);
      setPublishDetail({ contentHtml: full.content_html, contentMarkdown: full.content });
      setPublishOpen(true);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  const handleAction = async (fn: () => Promise<unknown>, successMsg: string) => {
    try {
      await fn();
      toast.success(successMsg);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Link to={ROUTES.blogEditor(post.post_id)}>
          <Button variant="outline" size="sm">
            {post.status === 'ARCHIVADO' ? <Eye className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
            <span>{post.status === 'ARCHIVADO' ? 'Ver' : 'Editar'}</span>
          </Button>
        </Link>

        {post.status === 'BORRADOR' && (
          <>
            <Button size="sm" onClick={openPublishChecklist}>
              <Send className="h-3.5 w-3.5" />
              <span>Publicar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Eliminar borrador"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5 text-[var(--danger)]" />
            </Button>
          </>
        )}

        {post.status === 'PUBLICADO' && (
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={unpublish.isPending}
              onClick={() => handleAction(() => unpublish.mutateAsync(post.post_id), 'Movido a borrador')}
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span>Despublicar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Archivar"
              disabled={archive.isPending}
              onClick={() => handleAction(() => archive.mutateAsync(post.post_id), 'Publicación archivada')}
            >
              <Archive className="h-3.5 w-3.5" />
            </Button>
          </>
        )}

        {post.status === 'ARCHIVADO' && (
          <Button
            variant="outline"
            size="sm"
            disabled={restore.isPending}
            onClick={() => handleAction(() => restore.mutateAsync(post.post_id), 'Restaurado a borrador')}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restaurar</span>
          </Button>
        )}
      </div>

      {publishDetail && (
        <PublishDialog
          open={publishOpen}
          onClose={() => setPublishOpen(false)}
          postId={post.post_id}
          title={post.title}
          slug={post.slug}
          contentHtml={publishDetail.contentHtml}
          contentMarkdown={publishDetail.contentMarkdown}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await handleAction(() => remove.mutateAsync(post.post_id), 'Borrador eliminado');
          setDeleteOpen(false);
        }}
        title="Eliminar borrador"
        description={`¿Seguro que deseas eliminar "${post.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        isLoading={remove.isPending}
      />
    </>
  );
}
