import { PageHeader } from '@shared/components/PageHeader';

export function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Plantillas"
        description="Galería de design tokens JSON para blogs (Fase 5)."
      />
      <div className="rounded-xl border bg-[var(--card)] p-6 text-sm text-[var(--fg-muted)]">
        Módulo de plantillas en preparación.
      </div>
    </div>
  );
}
