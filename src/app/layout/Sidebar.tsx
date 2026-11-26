import { NavLink } from 'react-router-dom';
import { FileText, LayoutDashboard, Palette, X } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import { env } from '@core/config/env';
import { cn } from '@shared/lib/cn';

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.BLOGS, label: 'Blogs', icon: FileText },
  { to: ROUTES.TEMPLATES, label: 'Plantillas', icon: Palette },
] as const;

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const navContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2.5 px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-[var(--primary)] text-[var(--primary-fg)] flex items-center justify-center font-bold text-sm">
              C
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{env.VITE_APP_NAME}</p>
              <p className="text-xs text-[var(--fg-muted)] truncate">Headless Studio</p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Cerrar menú"
              className="md:hidden rounded-lg p-1 text-[var(--fg-muted)] hover:bg-[var(--bg)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="space-y-1" aria-label="Navegación principal">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                    : 'text-[var(--fg-muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)]',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-2 pt-4 border-t text-xs text-[var(--fg-muted)]">
        API v1.3 · Modo Headless
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r bg-[var(--sidebar)] flex-col">
        {navContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex md:hidden bg-black/50"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCloseMobile?.();
          }}
        >
          <aside className="w-64 bg-[var(--sidebar)] border-r h-full shadow-xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
