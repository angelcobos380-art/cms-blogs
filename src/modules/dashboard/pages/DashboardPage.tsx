import { useSearchParams } from 'react-router-dom';
import { Archive, Eye, FileEdit, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';
import { normalizeApiError } from '@core/api/errors';
import { ErrorState } from '@shared/components/ErrorState';
import { PageHeader } from '@shared/components/PageHeader';
import { Button } from '@shared/components/ui/button';
import { MetricCard } from '../components/MetricCard';
import { PostsPerMonthChart } from '../components/PostsPerMonthChart';
import { RecentPostsTable } from '../components/RecentPostsTable';
import { TopPostsChart } from '../components/TopPostsChart';
import { TopTagsList } from '../components/TopTagsList';
import { ViewsOverTimeChart } from '../components/ViewsOverTimeChart';
import { useMetricsSummary } from '../hooks/useMetricsSummary';
import { useViewsSeries } from '../hooks/useViewsSeries';
import type { ViewsGranularity, ViewsRange } from '../types/metrics.types';

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rangeParam = searchParams.get('range');
  const granularityParam = searchParams.get('granularity');

  const range: ViewsRange =
    rangeParam === '7d' || rangeParam === '30d' || rangeParam === '12m' ? rangeParam : '30d';
  const granularity: ViewsGranularity = granularityParam === 'week' ? 'week' : 'day';

  const summary = useMetricsSummary(12, 5);
  const views = useViewsSeries(range, granularity);

  const updateQuery = (next: { range?: ViewsRange; granularity?: ViewsGranularity }) => {
    const params = new URLSearchParams(searchParams);
    if (next.range) params.set('range', next.range);
    if (next.granularity) params.set('granularity', next.granularity);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Dashboard"
        description="Métricas de publicaciones, tags y audiencia en tiempo real."
        actions={
          <Link to={ROUTES.BLOGS}>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              <span>Ir a Blogs</span>
            </Button>
          </Link>
        }
      />

      {summary.isError && (
        <ErrorState
          message={normalizeApiError(summary.error).message}
          onRetry={() => summary.refetch()}
        />
      )}

      {/* 4 Tarjetas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Publicados"
          value={summary.data?.totals.by_status.PUBLICADO ?? 0}
          hint="En vivo en el sitio"
          icon={<FileText className="h-4 w-4 text-[var(--success)]" />}
          to={`${ROUTES.BLOGS}?status=PUBLICADO`}
        />
        <MetricCard
          label="Borradores"
          value={summary.data?.totals.by_status.BORRADOR ?? 0}
          hint="En edición"
          icon={<FileEdit className="h-4 w-4 text-[var(--warning)]" />}
          to={`${ROUTES.BLOGS}?status=BORRADOR`}
        />
        <MetricCard
          label="Archivados"
          value={summary.data?.totals.by_status.ARCHIVADO ?? 0}
          hint="Historial conservado"
          icon={<Archive className="h-4 w-4 text-[var(--fg-muted)]" />}
          to={`${ROUTES.BLOGS}?status=ARCHIVADO`}
        />
        <MetricCard
          label="Vistas totales"
          value={summary.data?.totals.views ?? 0}
          hint={`${summary.data?.totals.posts ?? 0} artículos totales`}
          icon={<Eye className="h-4 w-4 text-[var(--accent)]" />}
        />
      </div>

      {/* Gráfica principal de visitas + Top Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ViewsOverTimeChart
            series={views.data?.series ?? []}
            range={range}
            granularity={granularity}
            onRangeChange={(r) => updateQuery({ range: r })}
            onGranularityChange={(g) => updateQuery({ granularity: g })}
          />
        </div>

        <TopTagsList tags={summary.data?.top_tags ?? []} />
      </div>

      {/* Actividad mensual + Top posts + Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PostsPerMonthChart data={summary.data?.posts_per_month ?? []} />
        <TopPostsChart posts={summary.data?.top_posts ?? []} />
        <RecentPostsTable />
      </div>
    </div>
  );
}
