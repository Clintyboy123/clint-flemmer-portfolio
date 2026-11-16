import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Two separate apps are built: the public site (index.html) and the admin (admin/index.html).
// Keeping them apart means visitors never download the admin, and each has its own stylesheet.
const adminFallback = () => ({
  name: 'admin-spa-fallback',
  configureServer(server) {
    // Local development only: any /admin/... address opens the admin app (Nginx does this in production).
    server.middlewares.use((req, _res, next) => {
      const path = req.url.split('?')[0];
      if (path === '/admin' || (path.startsWith('/admin/') && !path.includes('.'))) req.url = '/admin/index.html';
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), adminFallback()],
  build: {
    rollupOptions: {
      input: {
        site: resolve(import.meta.dirname, 'index.html'),
        admin: resolve(import.meta.dirname, 'admin/index.html'),
      },
    },
  },
  server: {
    // Local development only: stands in for the Nginx /api proxy used in production.
    proxy: {
      '/api': {
        target: process.env.DEV_API_TARGET || 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
});
