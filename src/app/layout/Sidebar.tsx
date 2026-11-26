import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, LayoutDashboard, Palette, PanelLeftClose, PanelLeftOpen, Plus, Sparkles, X } from 'lucide-react';
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
  const [collapsed, setCollapsed] = useState(false);

  const handleQuickNew = () => {
    onCloseMobile?.();
    navigate(`${ROUTES.BLOGS}?new=1`);
  };

  const renderContent = (isCollapsed: boolean) => (
    <div className="flex h-full flex-col justify-between p-3.5 gap-6">
      {/* Top: Brand + Quick Action */}
      <div className="space-y-5">
        <div className={cn('flex items-center gap-2 px-1', isCollapsed ? 'flex-col' : 'justify-between')}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              C
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{env.VITE_APP_NAME}</p>
                <p className="text-[11px] text-[var(--fg-muted)] truncate">Headless Studio</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={isCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
            title={isCollapsed ? 'Expandir' : 'Contraer'}
            className="hidden md:inline-flex rounded-lg p-1.5 text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] cursor-pointer"
          >
            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>

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

        <Button
          onClick={handleQuickNew}
          className="w-full justify-center shadow-xs"
          size={isCollapsed ? 'icon' : 'sm'}
          title="Nuevo borrador"
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span>Nuevo borrador</span>}
        </Button>

        {/* Navigation */}
        <div className="space-y-1.5">
          {!isCollapsed && (
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
              Espacio de trabajo
            </p>
          )}
          <nav className="space-y-1" aria-label="Navegación principal">
            {NAV_ITEMS.map(({ to, label, hint, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                title={isCollapsed ? `${label}: ${hint}` : undefined}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl py-2.5 text-sm transition',
                    isCollapsed ? 'justify-center px-2' : 'px-3',
                    isActive
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                      : 'text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] font-medium',
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="leading-tight">{label}</p>
                    <p className="text-[11px] opacity-75 font-normal truncate">{hint}</p>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom: Tip card + Account */}
      <div className="space-y-3">
        {!isCollapsed && (
          <div className="rounded-xl border bg-[var(--bg)] p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Flujo Headless</span>
            </div>
            <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">
              Los borradores se autoguardan cada 2 s. Los publicados esperan tu confirmación.
            </p>
          </div>
        )}

        <div className={cn('flex items-center gap-2 px-1 pt-3 border-t text-xs', isCollapsed ? 'justify-center' : 'justify-between')}>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="font-medium truncate">{user?.email ?? 'Admin'}</p>
              <p className="text-[11px] text-[var(--fg-muted)]">API v1.3 · {user?.role ?? 'ADMIN'}</p>
            </div>
          )}
          <span
            className="h-2.5 w-2.5 rounded-full bg-[var(--success)] shrink-0"
            title={user?.email ?? 'Conectado'}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'hidden md:flex h-screen shrink-0 border-r bg-[var(--sidebar)] flex-col overflow-y-auto transition-[width] duration-150',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        {renderContent(collapsed)}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex md:hidden bg-black/50"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCloseMobile?.();
          }}
        >
          <aside className="w-64 bg-[var(--sidebar)] border-r h-full shadow-xl">
            {renderContent(false)}
          </aside>
        </div>
      )}
    </>
  );
}
