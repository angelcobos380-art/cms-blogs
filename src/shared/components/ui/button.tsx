import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@shared/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90',
  secondary: 'bg-[var(--bg-subtle)] text-[var(--fg)] border hover:bg-[var(--border)]/40',
  outline: 'border bg-transparent text-[var(--fg)] hover:bg-[var(--bg-subtle)]',
  ghost: 'bg-transparent text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]',
  danger: 'bg-[var(--danger)] text-white hover:opacity-90',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  icon: 'h-9 w-9 p-0',
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
