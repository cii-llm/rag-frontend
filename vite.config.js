import { fileURLToPath, URL } from 'node:url' // Make sure these imports are present

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify' // If you added the vuetify plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Configure vuetify plugin if you use it
  ],
  resolve: {
    alias: {
      // This line is crucial: it tells Vite that '@' maps to the './src' directory
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // Optional: Add server config if needed, e.g., for proxying API requests
  // server: {
  //   port: 5173, // Or your preferred port
  //   proxy: {
  //     '/api': { // Example: Proxy requests starting with /api to your backend
  //       target: 'http://localhost:8000', // Your FastAPI backend URL
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '') // Remove /api prefix before sending to backend
  //     }
  //   }
  // }
})