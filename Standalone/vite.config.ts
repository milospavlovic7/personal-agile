import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // To compile the application to a single standalone index.html file,
    // uncomment the line below (and run npm run build):
    viteSingleFile(),
  ],
  server: {
    port: 5173,
    host: true,
  },
});
