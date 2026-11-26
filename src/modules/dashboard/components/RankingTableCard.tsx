import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';
import { Input } from '@shared/components/ui/input';

interface RankingTableCardProps {
  posts: Array<{ post_id: string; slug: string; title: string; views: number }>;
  totalViews: number;
}

export function RankingTableCard({ posts, totalViews }: RankingTableCardProps) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(5);

  const filtered = posts
    .filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, limit);

  const maxViews = Math.max(1, ...posts.map((p) => p.views));

  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Ranking de artículos más vistos</h2>
          <p className="text-xs text-[var(--fg-muted)]">{filtered.length} entradas mostradas</p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar artículo…"
            className="h-8 w-44 text-xs"
          />
          <select
            aria-label="Cantidad en ranking"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="h-8 rounded-lg border bg-[var(--bg)] px-2 text-xs text-[var(--fg)]"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Todos</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-[var(--fg-muted)] py-6 text-center">
          No hay artículos que coincidan con la búsqueda.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b text-[var(--fg-muted)]">
                <th className="py-2 pr-3 font-medium w-8">#</th>
                <th className="py-2 pr-3 font-medium">Artículo</th>
                <th className="py-2 pr-3 font-medium w-44">Visualizaciones</th>
                <th className="py-2 font-medium text-right">Tráfico</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((post, idx) => {
                const barPct = Math.round((post.views / maxViews) * 100);
                const sharePct = totalViews > 0 ? Math.round((post.views / totalViews) * 100) : 0;
                return (
                  <tr key={post.post_id} className="hover:bg-[var(--bg-subtle)]/60 transition">
                    <td className="py-2.5 pr-3 font-semibold text-[var(--fg-muted)]">{idx + 1}</td>
                    <td className="py-2.5 pr-3">
                      <Link
                        to={ROUTES.blogEditor(post.post_id)}
                        className="font-medium hover:text-[var(--accent)] transition line-clamp-1"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[var(--accent)]"
                            style={{ width: `${Math.max(4, barPct)}%` }}
                          />
                        </div>
                        <span className="font-mono tabular-nums w-8 text-right">{post.views}</span>
                      </div>
                    </td>
                    <td className="py-2.5 font-mono text-right text-[var(--fg-muted)]">
                      {sharePct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
