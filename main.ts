/**
 * 应用入口文件
 * Uniapp + Vue 3 + TypeScript
 */

import App from './App.vue'
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'

// 导入全局样式
import './src/styles/index.scss'

export function createApp() {
  const app = createSSRApp(App)

  // 创建 Pinia 状态管理
  const pinia = createPinia()
  app.use(pinia)

  return {
    app,
    pinia
  }
}
