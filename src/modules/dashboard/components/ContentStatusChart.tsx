import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface ContentStatusChartProps {
  byStatus: {
    BORRADOR: number;
    PUBLICADO: number;
    ARCHIVADO: number;
  };
}

const ITEMS = [
  { key: 'PUBLICADO' as const, label: 'Publicados', color: '#16a34a' },
  { key: 'BORRADOR' as const, label: 'Borradores', color: '#d97706' },
  { key: 'ARCHIVADO' as const, label: 'Archivados', color: '#6b7280' },
];

export function ContentStatusChart({ byStatus }: ContentStatusChartProps) {
  const total = byStatus.PUBLICADO + byStatus.BORRADOR + byStatus.ARCHIVADO;
  const chartData = ITEMS.map((item) => ({
    name: item.label,
    value: byStatus[item.key],
    color: item.color,
  })).filter((d) => d.value > 0);

  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5 flex flex-col justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold">Salud del contenido</h2>
        <p className="text-xs text-[var(--fg-muted)]">Distribución por estado editorial</p>
      </div>

      {total === 0 ? (
        <p className="text-xs text-[var(--fg-muted)] py-8 text-center">
          Aún no hay artículos registrados.
        </p>
      ) : (
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={3}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="space-y-2 text-xs">
        {ITEMS.map((item) => {
          const count = byStatus[item.key];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
              <span className="font-mono text-[var(--fg-muted)]">
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
