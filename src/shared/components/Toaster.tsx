import { create } from 'zustand';
import { X } from 'lucide-react';
import { cn } from '@shared/lib/cn';

type ToastTone = 'info' | 'success' | 'warning' | 'error';

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastState {
  items: ToastItem[];
  push: (message: string, tone?: ToastTone) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (message, tone = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((s) => ({ items: [...s.items, { id, message, tone }] }));
    setTimeout(() => {
      set((s) => ({ items: s.items.filter((t) => t.id !== id) }));
    }, 3500);
  },
  dismiss: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}));

export const toast = {
  info: (msg: string) => useToastStore.getState().push(msg, 'info'),
  success: (msg: string) => useToastStore.getState().push(msg, 'success'),
  warning: (msg: string) => useToastStore.getState().push(msg, 'warning'),
  error: (msg: string) => useToastStore.getState().push(msg, 'error'),
};

const toneBorder: Record<ToastTone, string> = {
  info: 'border-[var(--accent)]/50',
  success: 'border-[var(--success)]/50',
  warning: 'border-[var(--warning)]/50',
  error: 'border-[var(--danger)]/50',
};

export function Toaster() {
  const items = useToastStore((s) => s.items);
  const dismiss = useToastStore((s) => s.dismiss);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'rounded-xl border bg-[var(--card)] px-3.5 py-2.5 text-xs shadow-lg flex items-center justify-between gap-3',
            toneBorder[item.tone],
          )}
        >
          <span>{item.message}</span>
          <button
            type="button"
            onClick={() => dismiss(item.id)}
            aria-label="Cerrar notificación"
            className="text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
