import { fileURLToPath } from 'url';
import { configDefaults, defineConfig } from 'vitest/config';

const srcPath = fileURLToPath(new URL('./src/', import.meta.url));
export default defineConfig({
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, '**/playwright/**'],
    environment: 'jsdom',
    setupFiles: ['dotenv/config', '@testing-library/jest-dom'],
  },
  resolve: {
    alias: {
      '~': srcPath,
      '~/': srcPath,
    },
  },
});
