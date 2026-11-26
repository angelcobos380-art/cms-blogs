import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { authStore } from './authStore';
import { LoginPage } from './LoginPage';

function renderLogin() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginPage (integración MSW)', () => {
  beforeEach(() => {
    authStore.getState().clearSession();
  });

  it('muestra error 401 con credenciales incorrectas', async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'wrong-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar al panel/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Credenciales incorrectas');
    });
  });

  it('inicia sesión y guarda token + usuario con credenciales válidas', async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'Admin123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar al panel/i }));

    await waitFor(() => {
      expect(authStore.getState().token).toBe('mock-jwt-token');
      expect(authStore.getState().user?.email).toBe('admin@example.com');
    });
  });
});
