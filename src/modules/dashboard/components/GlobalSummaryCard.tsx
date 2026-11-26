interface GlobalSummaryCardProps {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  activeTagsCount: number;
  avgViewsPerPost: number;
  periodLabel: string;
}

export function GlobalSummaryCard({
  totalPosts,
  publishedPosts,
  draftPosts,
  totalViews,
  activeTagsCount,
  avgViewsPerPost,
  periodLabel,
}: GlobalSummaryCardProps) {
  const publishRate = totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;

  const cells = [
    {
      label: 'Total de artículos',
      value: totalPosts,
      sub: `${publishedPosts} publicados · ${draftPosts} borradores`,
    },
    {
      label: 'Vistas acumuladas',
      value: totalViews,
      sub: `Promedio ${avgViewsPerPost} por publicado`,
    },
    {
      label: 'Tasa de publicación',
      value: `${publishRate}%`,
      sub: 'Relación publicados / total',
    },
    {
      label: 'Tags en uso',
      value: activeTagsCount,
      sub: `Periodo activo: ${periodLabel}`,
    },
  ];

  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Resumen Global</h2>
          <p className="text-xs text-[var(--fg-muted)]">Indicadores consolidados del CMS</p>
        </div>
        <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
          {periodLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="rounded-xl border bg-[var(--bg-subtle)]/70 p-3.5 space-y-1"
          >
            <p className="text-[11px] font-medium text-[var(--fg-muted)]">{cell.label}</p>
            <p className="text-xl font-bold tracking-tight tabular-nums">{cell.value}</p>
            <p className="text-[11px] text-[var(--fg-muted)] truncate">{cell.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
