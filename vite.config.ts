import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@app': '/src/app',
            '@shared': '/src/shared',
            '@pages': '/src/pages',
            '@widgets': '/src/widgets',
            '@store': '/src/store',
            // Если необходимо, добавьте алиасы для других зависимостей
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis', // Заменяем глобальную переменную "global" на "globalThis"
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                    process: true,
                }),
            ],
        },
    },
});
