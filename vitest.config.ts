import { fileURLToPath } from 'url';
import { configDefaults, defineConfig } from 'vitest/config';

const srcPath = fileURLToPath(new URL('./src/', import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, '**/playwright/**'],
    alias: {
      '~': srcPath,
      '~/': srcPath,
    },
    setupFiles: ['dotenv/config', '@testing-library/jest-dom'],
  },
  resolve: {
    alias: {
      '~': srcPath,
      '~/': srcPath,
    },
  },
});
