import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message || 'Error inesperado en la interfaz.' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6">
          <div className="max-w-md w-full rounded-2xl border bg-[var(--card)] p-6 space-y-4 text-center">
            <h1 className="text-lg font-semibold">Algo salió mal</h1>
            <p className="text-xs text-[var(--fg-muted)]">{this.state.message}</p>
            <Button onClick={() => window.location.reload()}>Recargar aplicación</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
