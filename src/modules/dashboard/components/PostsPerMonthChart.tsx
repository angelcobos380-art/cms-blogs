import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PostsPerMonthChartProps {
  data: Array<{ month: string; created: number; published: number }>;
}

export function PostsPerMonthChart({ data }: PostsPerMonthChartProps) {
  const [metric, setMetric] = useState<'published' | 'created'>('published');

  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">Actividad mensual</h2>
          <p className="text-xs text-[var(--fg-muted)]">Publicaciones por mes</p>
        </div>

        <div className="inline-flex rounded-lg border bg-[var(--bg-subtle)] p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMetric('published')}
            className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition ${
              metric === 'published'
                ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                : 'text-[var(--fg-muted)]'
            }`}
          >
            Publicados
          </button>
          <button
            type="button"
            onClick={() => setMetric('created')}
            className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition ${
              metric === 'created'
                ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                : 'text-[var(--fg-muted)]'
            }`}
          >
            Creados
          </button>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
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
            <Bar
              dataKey={metric}
              name={metric === 'published' ? 'Publicados' : 'Creados'}
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
