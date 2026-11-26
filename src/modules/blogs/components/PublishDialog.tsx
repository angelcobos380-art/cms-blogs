import { CheckCircle2, XCircle } from 'lucide-react';
import { normalizeApiError } from '@core/api/errors';
import { Button } from '@shared/components/ui/button';
import { Dialog } from '@shared/components/ui/dialog';
import { toast } from '@shared/components/Toaster';
import { usePostTransitions } from '../hooks/usePostTransitions';
import { usePublishChecklist } from '../hooks/usePublishChecklist';

interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  title: string;
  slug: string;
  contentHtml?: string | null;
  contentMarkdown?: string | null;
}

export function PublishDialog({
  open,
  onClose,
  postId,
  title,
  slug,
  contentHtml,
  contentMarkdown,
}: PublishDialogProps) {
  const { publish } = usePostTransitions();
  const { checks, canPublish } = usePublishChecklist({
    title,
    slug,
    contentHtml,
    contentMarkdown,
  });

  const handlePublish = async () => {
    try {
      await publish.mutateAsync(postId);
      toast.success('Publicación en vivo');
      onClose();
    } catch {
      // Displayed below via publish.error
    }
  };

  const serverError = publish.error ? normalizeApiError(publish.error) : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Publicar artículo"
      description="Verifica los requisitos mínimos antes de publicar en el sitio."
    >
      <div className="space-y-2.5">
        {checks.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-2 rounded-lg border bg-[var(--bg-subtle)] px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2">
              {item.ok ? (
                <CheckCircle2 className="h-4 w-4 text-[var(--success)] shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-[var(--danger)] shrink-0" />
              )}
              <span>{item.label}</span>
            </div>
            <span className="font-mono text-[var(--fg-muted)]">{item.detail}</span>
          </div>
        ))}
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 p-2.5 text-xs text-[var(--danger)]"
        >
          {serverError.message}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onClose} disabled={publish.isPending}>
          Cancelar
        </Button>
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={!canPublish || publish.isPending}
        >
          {publish.isPending ? 'Publicando…' : 'Confirmar publicación'}
        </Button>
      </div>
    </Dialog>
  );
}
