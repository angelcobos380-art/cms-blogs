import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@dashboard': path.resolve(__dirname, 'src/modules/dashboard'),
      '@blogs': path.resolve(__dirname, 'src/modules/blogs'),
      '@templates': path.resolve(__dirname, 'src/modules/templates'),
    },
  },
});
