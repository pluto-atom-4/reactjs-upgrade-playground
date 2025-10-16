import { fileURLToPath } from 'url';
import { configDefaults, defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, '**/playwright/**'],
    alias: {
      '~/': fileURLToPath(new URL('./src/', import.meta.url)),
    },
    setupFiles: ['dotenv/config'],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
});
