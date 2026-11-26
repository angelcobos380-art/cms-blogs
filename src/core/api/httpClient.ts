import axios from 'axios';
import { authStore } from '@core/auth/authStore';
import { env } from '@core/config/env';

export const httpClient = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 20_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? '';
    if (status === 401 && !url.includes('/auth/login')) {
      authStore.getState().clearSession();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);
