import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ViewsGranularity, ViewsRange } from '../types/metrics.types';

interface ViewsOverTimeChartProps {
  series: Array<{ date: string; views: number }>;
  range: ViewsRange;
  granularity: ViewsGranularity;
  onRangeChange: (range: ViewsRange) => void;
  onGranularityChange: (granularity: ViewsGranularity) => void;
}

export function ViewsOverTimeChart({
  series,
  range,
  granularity,
  onRangeChange,
  onGranularityChange,
}: ViewsOverTimeChartProps) {
  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Visitas en el tiempo</h2>
          <p className="text-xs text-[var(--fg-muted)]">Serie continua desde métricas diarias</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="inline-flex rounded-lg border bg-[var(--bg-subtle)] p-0.5">
            {(['7d', '30d', '12m'] as ViewsRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRangeChange(r)}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition ${
                  range === r
                    ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-lg border bg-[var(--bg-subtle)] p-0.5">
            <button
              type="button"
              onClick={() => onGranularityChange('day')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition ${
                granularity === 'day'
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
              }`}
            >
              Día
            </button>
            <button
              type="button"
              onClick={() => onGranularityChange('week')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition ${
                granularity === 'week'
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
              }`}
            >
              Semana
            </button>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--fg-muted)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: 'var(--fg-muted)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '0.75rem',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              name="Visitas"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#viewsFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
