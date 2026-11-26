import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';
import { formatRelativeTime } from '@shared/lib/date';
import type { PostListItem } from '../types/post.types';
import { PostActionsMenu } from './PostActionsMenu';
import { StatusPill } from './StatusPill';

export function PostsTable({ items }: { items: PostListItem[] }) {
  return (
    <div className="rounded-xl border bg-[var(--card)] overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b text-xs text-[var(--fg-muted)]">
            <th className="py-3 px-4 font-medium">Título</th>
            <th className="py-3 px-4 font-medium">Estado</th>
            <th className="py-3 px-4 font-medium">Tags</th>
            <th className="py-3 px-4 font-medium">Actualizado</th>
            <th className="py-3 px-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((post) => (
            <tr key={post.post_id} className="hover:bg-[var(--bg-subtle)]/60 transition">
              <td className="py-3.5 px-4 max-w-md">
                <Link
                  to={ROUTES.blogEditor(post.post_id)}
                  className="font-medium hover:text-[var(--accent)] transition line-clamp-1"
                >
                  {post.title}
                </Link>
                <p className="text-xs font-mono text-[var(--fg-muted)] mt-0.5 truncate">
                  /{post.slug}
                </p>
              </td>
              <td className="py-3.5 px-4">
                <StatusPill status={post.status} />
              </td>
              <td className="py-3.5 px-4">
                <div className="flex flex-wrap gap-1">
                  {post.tags.length > 0 ? (
                    post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border bg-[var(--bg-subtle)] px-2 py-0.5 text-xs text-[var(--fg-muted)]"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[var(--fg-muted)]">—</span>
                  )}
                </div>
              </td>
              <td className="py-3.5 px-4 text-xs text-[var(--fg-muted)] whitespace-nowrap">
                {formatRelativeTime(post.updated_at)}
              </td>
              <td className="py-3.5 px-4">
                <PostActionsMenu post={post} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
