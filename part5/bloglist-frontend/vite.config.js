import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
    alias: {
      'react-transition-group/TransitionGroupContext': 'react-transition-group/esm/TransitionGroupContext.js',
    },
    server: {
      deps: {
        inline: [/./],
      },
    },
  }
})
