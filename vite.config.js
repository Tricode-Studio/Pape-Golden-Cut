import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/cms-proxy': {
        target: 'https://cms.tricode.studio',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/cms-proxy/, '/api/v1'),
      },
    },
  },
});
