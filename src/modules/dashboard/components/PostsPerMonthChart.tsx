import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PostsPerMonthChartProps {
  data: Array<{ month: string; created: number; published: number }>;
}

export function PostsPerMonthChart({ data }: PostsPerMonthChartProps) {
  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold">Cadencia editorial</h2>
        <p className="text-xs text-[var(--fg-muted)]">Artículos creados vs. publicados al mes</p>
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
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="created" name="Creados" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="published" name="Publicados" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
