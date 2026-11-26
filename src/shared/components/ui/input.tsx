import type { InputHTMLAttributes } from 'react';
import { cn } from '@shared/lib/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-9 w-full rounded-lg border bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
