import { fileURLToPath, URL } from 'node:url' // Make sure these imports are present

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify' // If you added the vuetify plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ 
      autoImport: true,
      // Only include icons we actually use to reduce bundle size
      icons: {
        iconfont: 'mdi',
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunking strategy
        manualChunks: {
          // Vendor chunks
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-vuetify': ['vuetify'],
          // App chunks
          'components': [
            './src/components/ChatInput.vue',
            './src/components/ChatMessage.vue',
            './src/components/FileUpload.vue'
          ],
          'views': [
            './src/views/ChatView.vue',
            './src/views/ProcessedDocumentsView.vue',
            './src/views/LoginView.vue'
          ],
          'stores': [
            './src/store/index.js',
            './src/store/chat.js',
            './src/store/documents.js'
          ]
        },
        // Optimize asset filenames
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    // Use default esbuild minification (faster than terser)
    minify: 'esbuild',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize source maps for production
    sourcemap: false,
  },
  // Optional: Add server config if needed
  // server: {
  //   port: 5173,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8000',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
})