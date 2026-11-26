import { LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@core/auth/useAuth';
import { Button } from '@shared/components/ui/button';
import { useThemeStore } from '@shared/hooks/useTheme';

export function Topbar() {
  const { user, logout } = useAuth();
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <header className="h-14 border-b bg-[var(--card)] px-6 flex items-center justify-between gap-4">
      <div className="text-xs text-[var(--fg-muted)]">Panel de administración</div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {user && (
          <span className="hidden sm:inline-block text-xs text-[var(--fg-muted)] px-2">
            {user.email}
          </span>
        )}

        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="h-3.5 w-3.5" />
          <span>Salir</span>
        </Button>
      </div>
    </header>
  );
}
