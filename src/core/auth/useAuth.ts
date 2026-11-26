import { useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, type LoginPayload } from './authApi';
import { authStore } from './authStore';

export function useAuthSessionBootstrap() {
  const token = authStore((s) => s.token);
  const isHydrated = authStore((s) => s.isHydrated);
  const setUser = authStore((s) => s.setUser);
  const setHydrated = authStore((s) => s.setHydrated);
  const clearSession = authStore((s) => s.clearSession);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!token) {
        setHydrated(true);
        return;
      }
      try {
        const user = await authApi.me();
        if (!cancelled) {
          setUser(user);
          setHydrated(true);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [token, setUser, setHydrated, clearSession]);

  return { isHydrated };
}

export function useAuth() {
  const queryClient = useQueryClient();
  const token = authStore((s) => s.token);
  const user = authStore((s) => s.user);
  const isHydrated = authStore((s) => s.isHydrated);
  const setToken = authStore((s) => s.setToken);
  const setUser = authStore((s) => s.setUser);
  const clearSession = authStore((s) => s.clearSession);

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { access_token } = await authApi.login(payload);
      setToken(access_token);
      const me = await authApi.me();
      setUser(me);
      return me;
    },
  });

  const logout = useCallback(() => {
    clearSession();
    queryClient.clear();
  }, [clearSession, queryClient]);

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isHydrated,
    loginMutation,
    logout,
  };
}
