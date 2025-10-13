import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, '../../packages/api/src'),
      '@web': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  }
})
