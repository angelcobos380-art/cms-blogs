import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuthSessionBootstrap } from '@core/auth/useAuth';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { Toaster } from '@shared/components/Toaster';
import { useThemeSync } from '@shared/hooks/useTheme';
import { queryClient } from './queryClient';

function SessionBootstrap({ children }: { children: ReactNode }) {
  useThemeSync();
  useAuthSessionBootstrap();
  return <>{children}</>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SessionBootstrap>
          {children}
          <Toaster />
        </SessionBootstrap>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
