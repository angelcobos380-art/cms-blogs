import { PageHeader } from '@shared/components/PageHeader';

export function PostsListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Blogs"
        description="Listado de borradores, publicados y archivados (Fase 3)."
      />
      <div className="rounded-xl border bg-[var(--card)] p-6 text-sm text-[var(--fg-muted)]">
        Módulo de listado de blogs en preparación.
      </div>
    </div>
  );
}
