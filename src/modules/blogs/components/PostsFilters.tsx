import { Search } from 'lucide-react';
import { Input } from '@shared/components/ui/input';
import type { PostStatus, PostsFilters as PostsFiltersType } from '../types/post.types';

interface PostsFiltersProps {
  filters: PostsFiltersType;
  searchText: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: PostStatus | 'ALL') => void;
  onTagChange: (tag: string) => void;
  onSortChange: (sort: string) => void;
}

export function PostsFilters({
  filters,
  searchText,
  onSearchChange,
  onStatusChange,
  onTagChange,
  onSortChange,
}: PostsFiltersProps) {
  return (
    <div className="rounded-xl border bg-[var(--card)] p-3 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="h-4 w-4 text-[var(--fg-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título o slug…"
          className="pl-9"
        />
      </div>

      <select
        aria-label="Filtrar por estado"
        value={filters.status ?? 'ALL'}
        onChange={(e) => onStatusChange(e.target.value as PostStatus | 'ALL')}
        className="h-9 rounded-lg border bg-[var(--bg)] px-3 text-sm text-[var(--fg)]"
      >
        <option value="ALL">Todos los estados</option>
        <option value="BORRADOR">Borradores</option>
        <option value="PUBLICADO">Publicados</option>
        <option value="ARCHIVADO">Archivados</option>
      </select>

      <Input
        aria-label="Filtrar por tag"
        value={filters.tag ?? ''}
        onChange={(e) => onTagChange(e.target.value)}
        placeholder="Tag (ej. fastapi)…"
        className="w-40"
      />

      <select
        aria-label="Ordenar por"
        value={filters.sort ?? '-updated_at'}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-9 rounded-lg border bg-[var(--bg)] px-3 text-sm text-[var(--fg)]"
      >
        <option value="-updated_at">Más recientes</option>
        <option value="-published_at">Últimos publicados</option>
        <option value="title">Título (A–Z)</option>
        <option value="-created_at">Fecha de creación</option>
      </select>
    </div>
  );
}
