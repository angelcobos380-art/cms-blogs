import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';
import { normalizeApiError } from '@core/api/errors';
import { Button } from '@shared/components/ui/button';
import { Dialog } from '@shared/components/ui/dialog';
import { Input } from '@shared/components/ui/input';
import { toast } from '@shared/components/Toaster';
import { useTemplates } from '@templates';
import { useCreatePost } from '../hooks/useSavePost';
import { createPostSchema } from '../schemas/post.schema';

interface NewPostDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NewPostDialog({ open, onClose }: NewPostDialogProps) {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const { data: templatesData } = useTemplates('ACTIVA');
  const [title, setTitle] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parsed = createPostSchema.safeParse({
      title,
      template_id: templateId || null,
    });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Datos inválidos');
      return;
    }

    try {
      const created = await createPost.mutateAsync({
        title: parsed.data.title,
        template_id: parsed.data.template_id,
      });
      setTitle('');
      setTemplateId('');
      onClose();
      toast.success('Borrador creado');
      navigate(ROUTES.blogEditor(created.post_id));
    } catch (err) {
      setValidationError(normalizeApiError(err).message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nuevo borrador"
      description="Empieza con un título. El slug se genera automáticamente y podrás editarlo después."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="new-post-title" className="text-xs font-medium text-[var(--fg-muted)]">
            Título inicial
          </label>
          <Input
            id="new-post-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Arquitectura de un CMS Headless"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="new-post-template" className="text-xs font-medium text-[var(--fg-muted)]">
            Plantilla visual (opcional)
          </label>
          <select
            id="new-post-template"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="h-9 w-full rounded-lg border bg-[var(--bg)] px-3 text-sm text-[var(--fg)]"
          >
            <option value="">Usar plantilla predeterminada</option>
            {(templatesData?.items ?? []).map((tpl) => (
              <option key={tpl.template_id} value={tpl.template_id}>
                {tpl.name}
              </option>
            ))}
          </select>
        </div>

        {validationError && (
          <p className="text-xs text-[var(--danger)]" role="alert">
            {validationError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" disabled={createPost.isPending}>
            {createPost.isPending ? 'Creando…' : 'Crear y abrir editor'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
