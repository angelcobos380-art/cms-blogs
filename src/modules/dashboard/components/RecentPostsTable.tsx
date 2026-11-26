import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ROUTES } from '@app/router/routes';
import { httpClient } from '@core/api/httpClient';
import type { Paginated } from '@core/api/pagination';
import { StatusBadge } from '@shared/components/StatusBadge';
import { formatRelativeTime } from '@shared/lib/date';
import type { PostListItem } from '@blogs';

export function RecentPostsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'recent-dashboard'],
    queryFn: async () => {
      const res = await httpClient.get<Paginated<PostListItem>>('/posts', {
        params: { sort: '-updated_at', page: 1, page_size: 5 },
      });
      return res.data;
    },
  });

  const items = data?.items ?? [];

  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Publicaciones recientes</h2>
          <p className="text-xs text-[var(--fg-muted)]">Acceso rápido al editor</p>
        </div>
        <Link to={ROUTES.BLOGS} className="text-xs font-medium text-[var(--accent)] hover:underline">
          Ver todas →
        </Link>
      </div>

      {isLoading ? (
        <p className="text-xs text-[var(--fg-muted)]">Cargando recientes…</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-[var(--fg-muted)]">Aún no hay publicaciones.</p>
      ) : (
        <div className="divide-y">
          {items.map((post) => (
            <Link
              key={post.post_id}
              to={ROUTES.blogEditor(post.post_id)}
              className="py-2.5 flex items-center justify-between gap-3 hover:opacity-80 transition"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{post.title}</p>
                <p className="text-xs text-[var(--fg-muted)]">{formatRelativeTime(post.updated_at)}</p>
              </div>
              <StatusBadge
                label={post.status}
                tone={
                  post.status === 'PUBLICADO'
                    ? 'success'
                    : post.status === 'BORRADOR'
                      ? 'warning'
                      : 'neutral'
                }
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
