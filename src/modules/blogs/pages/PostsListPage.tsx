import { useState } from 'react';
import { Plus } from 'lucide-react';
import { normalizeApiError } from '@core/api/errors';
import { EmptyState } from '@shared/components/EmptyState';
import { ErrorState } from '@shared/components/ErrorState';
import { PageHeader } from '@shared/components/PageHeader';
import { Button } from '@shared/components/ui/button';
import { useDebounce } from '@shared/hooks/useDebounce';
import { NewPostDialog } from '../components/NewPostDialog';
import { PostsFilters } from '../components/PostsFilters';
import { PostsTable } from '../components/PostsTable';
import { usePosts } from '../hooks/usePosts';
import type { PostStatus, PostsFilters as PostsFiltersType } from '../types/post.types';

export function PostsListPage() {
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const debouncedQuery = useDebounce(searchText, 300);

  const [filters, setFilters] = useState<PostsFiltersType>({
    status: 'ALL',
    tag: '',
    sort: '-updated_at',
    page: 1,
    page_size: 20,
  });

  const activeFilters: PostsFiltersType = {
    ...filters,
    q: debouncedQuery,
  };

  const { data, isLoading, isError, error, refetch } = usePosts(activeFilters);
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <PageHeader
        title="Blogs"
        description="Crea borradores con autoguardado, edita publicaciones y gestiona su ciclo de vida."
        actions={
          <Button size="sm" onClick={() => setNewPostOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Nuevo post</span>
          </Button>
        }
      />

      <PostsFilters
        filters={filters}
        searchText={searchText}
        onSearchChange={(q) => {
          setSearchText(q);
          setFilters((prev) => ({ ...prev, page: 1 }));
        }}
        onStatusChange={(status: PostStatus | 'ALL') =>
          setFilters((prev) => ({ ...prev, status, page: 1 }))
        }
        onTagChange={(tag) => setFilters((prev) => ({ ...prev, tag, page: 1 }))}
        onSortChange={(sort) => setFilters((prev) => ({ ...prev, sort, page: 1 }))}
      />

      {isLoading && (
        <div className="rounded-xl border bg-[var(--card)] p-8 text-center text-sm text-[var(--fg-muted)]">
          Cargando publicaciones…
        </div>
      )}

      {isError && (
        <ErrorState message={normalizeApiError(error).message} onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <EmptyState
          title="No hay publicaciones que coincidan"
          description="Crea tu primer borrador o ajusta los filtros de búsqueda."
          action={
            <Button size="sm" onClick={() => setNewPostOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>Crear borrador</span>
            </Button>
          }
        />
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <>
          <PostsTable items={data.items} />
          <div className="flex items-center justify-between text-xs text-[var(--fg-muted)]">
            <span>
              Mostrando {data.items.length} de {data.total} publicaciones
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page ?? 1) <= 1}
                onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, (p.page ?? 1) - 1) }))}
              >
                Anterior
              </Button>
              <span>
                Página {data.page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page ?? 1) >= totalPages}
                onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      <NewPostDialog open={newPostOpen} onClose={() => setNewPostOpen(false)} />
    </div>
  );
}
