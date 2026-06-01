import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/ba2plus-calculator/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
