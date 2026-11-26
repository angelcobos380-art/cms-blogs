import { PageHeader } from '@shared/components/PageHeader';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen de publicaciones, tags y vistas (Fase 5)."
      />
      <div className="rounded-xl border bg-[var(--card)] p-6 text-sm text-[var(--fg-muted)]">
        Módulo de métricas en preparación.
      </div>
    </div>
  );
}
