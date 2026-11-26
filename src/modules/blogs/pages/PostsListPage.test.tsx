import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PostsListPage } from './PostsListPage';

function renderPostsList() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <PostsListPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PostsListPage (integración MSW)', () => {
  it('carga publicaciones desde la API y filtra por estado', async () => {
    renderPostsList();

    await waitFor(() => {
      expect(screen.getByText('Arquitectura CMS Headless')).toBeInTheDocument();
      expect(screen.getByText('Migraciones con Alembic')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/filtrar por estado/i), {
      target: { value: 'BORRADOR' },
    });

    await waitFor(() => {
      expect(screen.getByText('Migraciones con Alembic')).toBeInTheDocument();
      expect(screen.queryByText('Arquitectura CMS Headless')).not.toBeInTheDocument();
    });
  });
});
