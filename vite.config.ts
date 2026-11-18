/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isDemo = mode === 'demo';

  return {
    plugins: [
      react(),
      ...(!isDemo ? [dts({ include: ['src/terminal'] })] : []),
    ],
    test: {
      environment: 'node',
    },
    base: isDemo ? '/react-terminal/' : '/',
    ...(!isDemo && {
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
    }),
  };
});
