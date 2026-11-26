import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import { normalizeApiError } from '@core/api/errors';
import { ConfirmDialog } from '@shared/components/ConfirmDialog';
import { EmptyState } from '@shared/components/EmptyState';
import { ErrorState } from '@shared/components/ErrorState';
import { PageHeader } from '@shared/components/PageHeader';
import { toast } from '@shared/components/Toaster';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useDebounce } from '@shared/hooks/useDebounce';
import { TemplateGallery } from '../components/TemplateGallery';
import { useTemplateMutations } from '../hooks/useTemplateMutations';
import { useTemplates } from '../hooks/useTemplates';
import type { Template, TemplateStatus } from '../types/template.types';

export function TemplatesPage() {
  const [status, setStatus] = useState<TemplateStatus | 'ALL'>('ACTIVA');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [toDelete, setToDelete] = useState<Template | null>(null);

  const { data, isLoading, isError, error, refetch } = useTemplates(status, debouncedSearch);
  const { duplicate, setDefault, archive, restore, remove } = useTemplateMutations();

  const runAction = async (fn: () => Promise<unknown>, okMessage: string) => {
    try {
      await fn();
      toast.success(okMessage);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <PageHeader
        title="Plantillas"
        description="Crea y personaliza design tokens JSON reutilizables para el editor y tus sitios públicos."
        actions={
          <Link to={ROUTES.TEMPLATE_NEW}>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              <span>Nueva plantilla</span>
            </Button>
          </Link>
        }
      />

      <div className="rounded-xl border bg-[var(--card)] p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-4 w-4 text-[var(--fg-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar plantilla…"
            className="pl-9"
          />
        </div>

        <select
          aria-label="Filtrar estado de plantilla"
          value={status}
          onChange={(e) => setStatus(e.target.value as TemplateStatus | 'ALL')}
          className="h-9 rounded-lg border bg-[var(--bg)] px-3 text-sm text-[var(--fg)]"
        >
          <option value="ACTIVA">Activas</option>
          <option value="ARCHIVADA">Archivadas</option>
          <option value="ALL">Todas</option>
        </select>
      </div>

      {isLoading && (
        <div className="rounded-xl border bg-[var(--card)] p-8 text-center text-sm text-[var(--fg-muted)]">
          Cargando plantillas…
        </div>
      )}

      {isError && (
        <ErrorState message={normalizeApiError(error).message} onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <EmptyState
          title="No hay plantillas en esta vista"
          description="Crea una nueva plantilla desde cero con tus propios colores y tipografía."
          action={
            <Link to={ROUTES.TEMPLATE_NEW}>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                <span>Crear plantilla</span>
              </Button>
            </Link>
          }
        />
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <TemplateGallery
          items={data.items}
          onDuplicate={(id) => runAction(() => duplicate.mutateAsync(id), 'Plantilla duplicada')}
          onSetDefault={(id) =>
            runAction(() => setDefault.mutateAsync(id), 'Plantilla predeterminada actualizada')
          }
          onArchive={(id) => runAction(() => archive.mutateAsync(id), 'Plantilla archivada')}
          onRestore={(id) => runAction(() => restore.mutateAsync(id), 'Plantilla restaurada')}
          onDelete={(tpl) => setToDelete(tpl)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return;
          await runAction(() => remove.mutateAsync(toDelete.template_id), 'Plantilla eliminada');
          setToDelete(null);
        }}
        title="Eliminar plantilla"
        description={`¿Eliminar "${toDelete?.name ?? ''}"? Si algún post la usa, el servidor pedirá archivarla en su lugar.`}
        confirmLabel="Eliminar"
        danger
        isLoading={remove.isPending}
      />
    </div>
  );
}
