import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Mengganti process.env.API_KEY dengan nilai string dari environment variables
      // Jika env.API_KEY tidak ada, gunakan string kosong agar tidak error saat runtime (akan ditangani logic aplikasi)
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});