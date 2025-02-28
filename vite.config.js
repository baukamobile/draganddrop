import { resolve } from 'path'
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
            '@': resolve(__dirname, 'src'),
        },
    },

    optimizeDeps: {
        exclude: ['.out'],
    },

    base: '/static/vue/dist/',
    
})
