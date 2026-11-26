import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface MetricCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon?: ReactNode;
  to?: string;
}

export function MetricCard({ label, value, hint, icon, to }: MetricCardProps) {
  const content = (
    <div className="rounded-2xl border bg-[var(--card)] p-4 space-y-2 transition hover:border-[var(--accent)]/60">
      <div className="flex items-center justify-between text-xs text-[var(--fg-muted)]">
        <span>{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
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
