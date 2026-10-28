import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['jeep-sqlite/loader']
  }
});