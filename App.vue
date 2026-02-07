<script lang="ts">
/**
 * 应用主组件
 * Uniapp App.vue 使用 Options API
 */
import { useAppStore, useUserStore } from './src/stores'
import mockDataManager from './src/mock/manager'
import { isMockEnabled } from './src/config/mock'

export default {
  onLaunch() {
    console.log('App Launch')
    console.log('应用版本: 1.0.0')

    // 初始化应用
    this.initApp()
  },

  onShow() {
    console.log('App Show')
  },

  onHide() {
    console.log('App Hide')
  },

  methods: {
    /**
     * 初始化应用
     */
    async initApp() {
      console.log('初始化应用...')

      // 1. 初始化 Mock 数据
      if (isMockEnabled()) {
        try {
          await mockDataManager.init()
          console.log('[App] Mock 数据初始化成功')
        } catch (error) {
          console.error('[App] Mock 数据初始化失败:', error)
        }
      }

      // 2. 初始化状态管理
      try {
        const appStore = useAppStore()
        await appStore.init()
        console.log('[App] 应用状态初始化成功')
      } catch (error) {
        console.error('[App] 应用状态初始化失败:', error)
      }

      // 3. 初始化用户状态
      try {
        const userStore = useUserStore()
        await userStore.init()
        console.log('[App] 用户状态初始化成功')
      } catch (error) {
        console.error('[App] 用户状态初始化失败:', error)
      }

      console.log('[App] 应用初始化完成')
    }
  }
}
</script>

<style lang="scss">
/* 全局样式已移至 src/styles/index.scss */
</style>
