import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  // Public path the site is served under (e.g. /ecell/ behind csea.psgtech.ac.in). Defaults to / for local dev.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    cors: true,
    allowedHosts: true,
    proxy: {
      // 1. Google Sheets data (Members & Projects) -> Node.js Express backend (Port 4000)
      '/api/members': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
      },
      '/api/projects': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
      },
      // 2. Private Portal API (Enquiries, Collaboration, Auth) -> Python Flask backend (Port 5000)
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
});