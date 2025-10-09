import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Use Vite's default port
    host: '0.0.0.0', // Important for GitHub Codespaces
    cors: true,
    // Add specific CORS headers for GitHub Codespaces
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'demo-core': ['react', 'react-dom'],
          'demo-crypto': [
            'crypto-js',
            './src/services/demo/demoCryptoService.ts',
            './src/services/crypto/hashService.ts',
          ],
          'demo-visualizations': ['d3', 'recharts'],
          'demo-ui': [
            './src/components/shared/Layout.tsx',
            './src/components/shared/TutorialOverlay.tsx',
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts', 'd3'],
  },
  server: {
    port: 3000,
    open: true,
  },
});
