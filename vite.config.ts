import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// 本地开发（npm run dev）时使用根路径 /，避免访问 localhost 还要带子路径前缀
// 生产构建（npm run build → GitHub Pages）时使用仓库名子路径匹配 Pages URL
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/driverTaskCenter/' : '/',
  plugins: [vue()],
}))
