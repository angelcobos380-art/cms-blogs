import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';

interface TopTagsListProps {
  tags: Array<{ tag: string; count: number }>;
}

export function TopTagsList({ tags }: TopTagsListProps) {
  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold">Tags principales</h2>
        <p className="text-xs text-[var(--fg-muted)]">Haz clic para filtrar el listado</p>
      </div>

      {tags.length === 0 ? (
        <p className="text-xs text-[var(--fg-muted)]">Aún no hay tags asignados.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              to={`${ROUTES.BLOGS}?tag=${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border bg-[var(--bg-subtle)] px-3 py-1.5 text-xs hover:border-[var(--accent)] transition"
            >
              <span className="font-medium">#{tag}</span>
              <span className="text-[var(--fg-muted)] font-mono">{count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
