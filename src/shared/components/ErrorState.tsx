import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-sm text-[var(--danger)]">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
