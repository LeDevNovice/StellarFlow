import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/StellarFlow/',
    build: {
        outDir: 'docs',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['@tanstack/react-router'],
                    animation: ['framer-motion'],
                    audio: ['howler']
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@types': path.resolve(__dirname, './src/types'),
            '@assets': path.resolve(__dirname, './src/assets')
        }
    },
    server: {
        port: 3000
    },
    define: {
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
    }
});