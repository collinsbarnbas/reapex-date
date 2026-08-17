import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@engine': resolve(__dirname, 'src/engine'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@components': resolve(__dirname, 'src/components'),
      '@a11y': resolve(__dirname, 'src/a11y'),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'engine/index': resolve(__dirname, 'src/engine/index.ts'),
        'hooks/index': resolve(__dirname, 'src/hooks/index.ts'),
        'components/index': resolve(__dirname, 'src/components/index.ts'),
        'locales/index': resolve(__dirname, 'src/locales/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    sourcemap: true,
    minify: false,
  },
});
