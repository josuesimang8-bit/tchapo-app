import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: ['es2015', 'safari11', 'ios11'],
    cssTarget: ['safari11', 'ios11']
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
