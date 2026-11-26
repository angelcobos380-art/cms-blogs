import { create } from 'zustand';

export interface AuthUser {
  user_id: string;
  email: string;
  role: string;
}

const TOKEN_STORAGE_KEY = 'cms_admin_token';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  setToken: (token: string) => void;
  setUser: (user: AuthUser | null) => void;
  setHydrated: (value: boolean) => void;
  clearSession: () => void;
}

export const authStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_STORAGE_KEY) : null,
  user: null,
  isHydrated: false,
  setToken: (token) => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    set({ token });
  },
  setUser: (user) => set({ user }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  clearSession: () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    set({ token: null, user: null, isHydrated: true });
  },
}));
