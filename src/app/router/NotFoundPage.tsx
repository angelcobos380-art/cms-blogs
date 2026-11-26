import { Link } from 'react-router-dom';
import { PageHeader } from '@shared/components/PageHeader';
import { Button } from '@shared/components/ui/button';
import { ROUTES } from './routes';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-4">
        <PageHeader title="404 — Página no encontrada" description="La ruta solicitada no existe." />
        <Link to={ROUTES.DASHBOARD}>
          <Button variant="outline">Ir al Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
