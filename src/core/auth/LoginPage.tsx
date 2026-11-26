import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail } from 'lucide-react';
import { normalizeApiError } from '@core/api/errors';
import { env } from '@core/config/env';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useAuth } from './useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginMutation } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
      const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      navigate(from, { replace: true });
    } catch {
      // Handled via loginMutation.error
    }
  };

  const errorMessage = loginMutation.error ? normalizeApiError(loginMutation.error).message : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-subtle)] px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-[var(--card)] p-6 shadow-sm space-y-6">
        <div className="space-y-1.5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] font-bold text-sm">
            C
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{env.VITE_APP_NAME}</h1>
          <p className="text-sm text-[var(--fg-muted)]">
            Inicia sesión para gestionar publicaciones, plantillas y métricas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-[var(--fg-muted)]">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--fg-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-[var(--fg-muted)]">
              Contraseña
            </label>
            <div className="relative">
              <LockKeyhole className="w-4 h-4 text-[var(--fg-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
              />
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-xs text-[var(--danger)]"
            >
              {errorMessage}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Verificando…' : 'Entrar al panel'}
          </Button>
        </form>
      </div>
    </div>
  );
}
