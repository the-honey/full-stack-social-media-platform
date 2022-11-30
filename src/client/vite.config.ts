import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/assets': path.resolve(__dirname, './assets/'),
      '@/pages': path.resolve(__dirname, './src/pages/'),
      '@/hooks': path.resolve(__dirname, './src/hooks/'),
      '@/context': path.resolve(__dirname, './src/context/'),
      '@/components': path.resolve(__dirname, './src/components/'),
    },
  },
});
