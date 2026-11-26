import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed bg-[var(--card)] p-10 text-center space-y-3">
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="text-xs text-[var(--fg-muted)] max-w-sm mx-auto">{description}</p>}
      {action && <div className="pt-1 flex justify-center">{action}</div>}
    </div>
  );
}
