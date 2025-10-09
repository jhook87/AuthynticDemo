import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    cors: true,
    open: false,
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['recharts', 'd3'],
          crypto: ['crypto-js'],
          demo: [
            './src/services/demo/demoCryptoService.ts',
            './src/services/demo/demoInteractionService.ts',
          ],
        },
      },
    },
  },
  base: './',
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts', 'd3', 'crypto-js'],
  },
});
