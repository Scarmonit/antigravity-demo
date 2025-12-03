import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: process.env.VERCEL ? '/' : '/antigravity-demo/',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'web-vitals': ['web-vitals'],
                },
            },
        },
        chunkSizeWarningLimit: 100,
    },
})
