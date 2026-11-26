import { useParams } from 'react-router-dom';
import { PageHeader } from '@shared/components/PageHeader';

export function PostEditorPage() {
  const { postId } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editor de publicación"
        description={`Post ID: ${postId ?? 'nuevo'} (Fase 3).`}
      />
      <div className="rounded-xl border bg-[var(--card)] p-6 text-sm text-[var(--fg-muted)]">
        Editor WYSIWYG en preparación.
      </div>
    </div>
  );
}
