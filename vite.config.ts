import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the Authyntic demo.
export default defineConfig({
  plugins: [react()],
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
