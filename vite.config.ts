/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
  },
  plugins: [
    react(),
    dts({ include: ['src/terminal'] }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/terminal/index.tsx'),
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
