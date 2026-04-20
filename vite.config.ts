import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          // Heavy visual stack used only by Hero shader.
          if (
            id.includes('@shadergradient/react')
            || id.includes('three')
            || id.includes('@react-three/fiber')
            || id.includes('three-stdlib')
            || id.includes('camera-controls')
          ) {
            return 'vendor-hero-shader';
          }

          // Admin-only UI libraries and editor tooling.
          if (
            id.includes('@radix-ui/react-dialog')
            || id.includes('@radix-ui/react-tabs')
          ) {
            return 'vendor-admin-ui';
          }
        },
      },
    },
  },
});