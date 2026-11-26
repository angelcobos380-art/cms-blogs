import { useParams } from 'react-router-dom';
import { PageHeader } from '@shared/components/PageHeader';

export function TemplateEditorPage() {
  const { templateId } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title={templateId ? 'Editar plantilla' : 'Nueva plantilla'}
        description="Editor de design tokens en vivo (Fase 5)."
      />
      <div className="rounded-xl border bg-[var(--card)] p-6 text-sm text-[var(--fg-muted)]">
        Editor de plantillas en preparación.
      </div>
    </div>
  );
}
