import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 样例
  server: {
    proxy: {
      '/api': {
        //'/api'是自行设置的请求前缀
        target: 'http://localhost:5000',
        changeOrigin: true, //用于控制请求头中的host值
        rewrite: (path) => path.replace(/^\/api/, '') //路径重写，（正则）匹配以api开头的路径为空（将请求前缀删除）
      }
    }
  }
})
