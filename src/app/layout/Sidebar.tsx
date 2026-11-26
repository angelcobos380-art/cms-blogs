import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, LayoutDashboard, Palette, Plus, Sparkles, X } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import { useAuth } from '@core/auth/useAuth';
import { env } from '@core/config/env';
import { Button } from '@shared/components/ui/button';
import { cn } from '@shared/lib/cn';

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', hint: 'Métricas y audiencia', icon: LayoutDashboard },
  { to: ROUTES.BLOGS, label: 'Blogs', hint: 'Artículos y borradores', icon: FileText },
  { to: ROUTES.TEMPLATES, label: 'Plantillas', hint: 'Estilos y tokens', icon: Palette },
] as const;

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleQuickNew = () => {
    onCloseMobile?.();
    navigate(`${ROUTES.BLOGS}?new=1`);
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between p-4 gap-6">
      {/* Top: Brand + Quick Action */}
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2.5 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              C
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{env.VITE_APP_NAME}</p>
              <p className="text-[11px] text-[var(--fg-muted)] truncate">Headless Studio</p>
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

        <Button onClick={handleQuickNew} className="w-full justify-center shadow-xs" size="sm">
          <Plus className="h-4 w-4" />
          <span>Nuevo borrador</span>
        </Button>

        {/* Navigation */}
        <div className="space-y-1.5">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Espacio de trabajo
          </p>
          <nav className="space-y-1" aria-label="Navegación principal">
            {NAV_ITEMS.map(({ to, label, hint, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                    isActive
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                      : 'text-[var(--fg-muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)] font-medium',
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="leading-tight">{label}</p>
                  <p className="text-[11px] opacity-75 font-normal truncate">{hint}</p>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom: Tip card + Account */}
      <div className="space-y-3">
        <div className="rounded-xl border bg-[var(--card)] p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Flujo Headless</span>
          </div>
          <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">
            Los borradores se autoguardan cada 2 s. Los publicados esperan tu confirmación.
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 px-2 pt-3 border-t text-xs">
          <div className="min-w-0">
            <p className="font-medium truncate">{user?.email ?? 'Admin'}</p>
            <p className="text-[11px] text-[var(--fg-muted)]">API v1.3 · {user?.role ?? 'ADMIN'}</p>
          </div>
          <span
            className="h-2 w-2 rounded-full bg-[var(--success)] shrink-0"
            title="Conectado"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 shrink-0 border-r bg-[var(--sidebar)] flex-col">
        {navContent}
      </aside>

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
