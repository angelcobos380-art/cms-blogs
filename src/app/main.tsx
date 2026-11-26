import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { env } from '@core/config/env';
import '../styles/globals.css';
import { App } from './App';

async function prepareMocks() {
  if (env.VITE_ENABLE_MOCKS) {
    const { worker } = await import('../test/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

prepareMocks().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
