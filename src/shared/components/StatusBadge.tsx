import { cn } from '@shared/lib/cn';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--fg-muted)]',
  success: 'border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]',
  warning: 'border-[var(--warning)]/40 bg-[var(--warning)]/10 text-[var(--warning)]',
  danger: 'border-[var(--danger)]/40 bg-[var(--danger)]/10 text-[var(--danger)]',
  info: 'border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)]',
};

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  className?: string;
}

export function StatusBadge({ label, tone = 'neutral', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
