import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuthSessionBootstrap } from '@core/auth/useAuth';
import { useThemeSync } from '@shared/hooks/useTheme';
import { queryClient } from './queryClient';

function SessionBootstrap({ children }: { children: ReactNode }) {
  useThemeSync();
  useAuthSessionBootstrap();
  return <>{children}</>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap>{children}</SessionBootstrap>
    </QueryClientProvider>
  );
}
