import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@shared/lib/cn';

interface MetricCardProps {
  label: string;
  value: number | string;
  hint?: string;
  delta?: { label: string; positive: boolean } | null;
  icon?: ReactNode;
  to?: string;
}

export function MetricCard({ label, value, hint, delta, icon, to }: MetricCardProps) {
  const content = (
    <div className="rounded-2xl border bg-[var(--card)] p-4 space-y-2 transition hover:border-[var(--accent)]/60">
      <div className="flex items-center justify-between text-xs text-[var(--fg-muted)]">
        <span className="font-medium">{label}</span>
        {icon}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
        {delta && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
              delta.positive
                ? 'bg-[var(--success)]/12 text-[var(--success)]'
                : 'bg-[var(--danger)]/12 text-[var(--danger)]',
            )}
          >
            {delta.label}
          </span>
        )}
      </div>

      {hint && <p className="text-xs text-[var(--fg-muted)]">{hint}</p>}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
