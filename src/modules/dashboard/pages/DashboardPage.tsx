import { Link, useSearchParams } from 'react-router-dom';
import { BarChart3, CheckCircle2, Eye, FileEdit, Plus } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import { normalizeApiError } from '@core/api/errors';
import { ErrorState } from '@shared/components/ErrorState';
import { PageHeader } from '@shared/components/PageHeader';
import { Button } from '@shared/components/ui/button';
import { ContentStatusChart } from '../components/ContentStatusChart';
import { MetricCard } from '../components/MetricCard';
import { PostsPerMonthChart } from '../components/PostsPerMonthChart';
import { RecentPostsTable } from '../components/RecentPostsTable';
import { RankingTableCard } from '../components/RankingTableCard';
import { TopTagsList } from '../components/TopTagsList';
import { ViewsOverTimeChart } from '../components/ViewsOverTimeChart';
import { useMetricsSummary } from '../hooks/useMetricsSummary';
import { useViewsSeries } from '../hooks/useViewsSeries';
import type { ViewsGranularity, ViewsRange } from '../types/metrics.types';

function computeTrendDelta(series: Array<{ views: number }>): { label: string; positive: boolean } | null {
  if (series.length < 4) return null;
  const mid = Math.floor(series.length / 2);
  const firstHalf = series.slice(0, mid).reduce((a, b) => a + b.views, 0);
  const secondHalf = series.slice(mid).reduce((a, b) => a + b.views, 0);
  if (firstHalf === 0) return null;
  const pct = Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
  return {
    label: `${pct >= 0 ? '+' : ''}${pct}%`,
    positive: pct >= 0,
  };
}

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

  const totals = summary.data?.totals;
  const byStatus = totals?.by_status ?? { BORRADOR: 0, PUBLICADO: 0, ARCHIVADO: 0 };
  const totalPosts = totals?.posts ?? 0;
  const totalViews = totals?.views ?? 0;
  const publishRate = totalPosts > 0 ? Math.round((byStatus.PUBLICADO / totalPosts) * 100) : 0;
  const avgViewsPerPublished =
    byStatus.PUBLICADO > 0 ? Math.round(totalViews / byStatus.PUBLICADO) : 0;

  const series = views.data?.series ?? [];
  const periodViews = series.reduce((a, b) => a + b.views, 0);
  const trendDelta = computeTrendDelta(series);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Dashboard"
        description="Rendimiento editorial, alcance de artículos y estado de tu contenido."
        actions={
          <Link to={`${ROUTES.BLOGS}?new=1`}>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              <span>Nuevo borrador</span>
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

      {/* 4 KPI Scorecards accionables */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={`Vistas (${range})`}
          value={periodViews}
          delta={trendDelta}
          hint={`${totalViews} vistas acumuladas`}
          icon={<Eye className="h-4 w-4 text-[var(--accent)]" />}
        />
        <MetricCard
          label="Tasa de publicación"
          value={`${publishRate}%`}
          hint={`${byStatus.PUBLICADO} de ${totalPosts} artículos en vivo`}
          icon={<CheckCircle2 className="h-4 w-4 text-[var(--success)]" />}
          to={`${ROUTES.BLOGS}?status=PUBLICADO`}
        />
        <MetricCard
          label="Borradores pendientes"
          value={byStatus.BORRADOR}
          hint="Listos para terminar y publicar"
          icon={<FileEdit className="h-4 w-4 text-[var(--warning)]" />}
          to={`${ROUTES.BLOGS}?status=BORRADOR`}
        />
        <MetricCard
          label="Promedio / artículo"
          value={avgViewsPerPublished}
          hint="Vistas medias por post publicado"
          icon={<BarChart3 className="h-4 w-4 text-[var(--accent)]" />}
        />
      </div>

      {/* Gráfica de visitas + Salud editorial (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ViewsOverTimeChart
            series={series}
            range={range}
            granularity={granularity}
            onRangeChange={(r) => updateQuery({ range: r })}
            onGranularityChange={(g) => updateQuery({ granularity: g })}
          />
        </div>

        <ContentStatusChart byStatus={byStatus} />
      </div>

      {/* Cadencia mensual + Ranking Top + Tags & Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PostsPerMonthChart data={summary.data?.posts_per_month ?? []} />
        <div className="lg:col-span-2">
          <RankingTableCard posts={summary.data?.top_posts ?? []} totalViews={totalViews} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopTagsList tags={summary.data?.top_tags ?? []} />
        <RecentPostsTable />
      </div>
    </div>
  );
}
