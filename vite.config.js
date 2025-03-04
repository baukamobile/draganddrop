import * as path from 'path'; // Заменяем import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJSX()],
    server: {
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
            secure: false,
          },
        },
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // Теперь path работает
        },
    },

    optimizeDeps: {
        exclude: ['.out'],
    },
    base: '/',
    // base: '/static/vue/dist/',
})
