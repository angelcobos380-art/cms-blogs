import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@core/auth/useAuth';
import { ROUTES } from './routes';

export function ProtectedRoute() {
  const { isAuthenticated, isHydrated } = useAuth();
  const location = useLocation();

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-sm text-[var(--fg-muted)]">
        Verificando sesión…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
