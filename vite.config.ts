import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
