import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';

interface TopPostsChartProps {
  posts: Array<{ post_id: string; slug: string; title: string; views: number }>;
  totalViews: number;
}

export function TopPostsChart({ posts, totalViews }: TopPostsChartProps) {
  const maxViews = Math.max(1, ...posts.map((p) => p.views));

  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold">Artículos con mayor impacto</h2>
        <p className="text-xs text-[var(--fg-muted)]">Participación sobre el tráfico total</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-xs text-[var(--fg-muted)]">Sin datos de visitas todavía.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const barPct = Math.round((post.views / maxViews) * 100);
            const sharePct = totalViews > 0 ? Math.round((post.views / totalViews) * 100) : 0;
            return (
              <Link
                key={post.post_id}
                to={ROUTES.blogEditor(post.post_id)}
                className="block group space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium truncate group-hover:text-[var(--accent)] transition">
                    {post.title}
                  </span>
                  <span className="font-mono text-[var(--fg-muted)] shrink-0">
                    {post.views} ({sharePct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all"
                    style={{ width: `${Math.max(4, barPct)}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
