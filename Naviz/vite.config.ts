import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const wasmMimeTypePlugin: Plugin = {
  name: 'wasm-mime-type',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm')
      }
      next()
    })
  }
}

export default defineConfig({
  plugins: [react(), wasmMimeTypePlugin],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './components'),
      '@/hooks': resolve(__dirname, './hooks'),
      '@/styles': resolve(__dirname, './styles'),
      '@/supabase': resolve(__dirname, './supabase'),
      '@/contexts': resolve(__dirname, './contexts')
    }
  },
  server: {
    port: 3000,
    host: true,
    fs: {
      allow: ['.']
    }
  },
  optimizeDeps: {
    include: ['@babylonjs/core'],
    exclude: ['@babylonjs/havok']
  },
  define: {
    global: 'globalThis'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          babylon: ['@babylonjs/core'],
          babylonExtras: ['@babylonjs/gui', '@babylonjs/loaders', '@babylonjs/materials'],
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
