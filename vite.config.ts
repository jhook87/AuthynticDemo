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
    assetsDir: 'assets',
    // Ensure assets are properly handled in GitHub Codespaces
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Add base URL handling for GitHub Codespaces
  base: process.env.CODESPACE_NAME 
    ? `https://${process.env.CODESPACE_NAME}-5173.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/`
    : '/',
});
