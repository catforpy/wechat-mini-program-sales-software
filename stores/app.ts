/**
 * 应用全局状态管理
 * 管理应用级别的状态，如主题、语言、网络状态等
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Storage from '@/utils/storage'
import { STORAGE_KEYS, THEME_MODE } from '@/config/constant'

export const useAppStore = defineStore('app', () => {
  // ========== 状态 ==========

  // 主题模式
  const theme = ref<THEME_MODE>(THEME_MODE.LIGHT)

  // 语言
  const language = ref<string>('zh-CN')

  // 网络状态
  const networkStatus = ref<boolean>(true)

  // 系统信息
  const systemInfo = ref<any>(null)

  // 加载状态
  const loading = ref<boolean>(false)

  // ========== 计算属性 ==========

  // 是否为深色主题
  const isDark = computed(() => theme.value === THEME_MODE.DARK)

  // ========== Actions ==========

  /**
   * 初始化应用
   */
  async function init() {
    // 加载本地配置
    await loadLocalConfig()

    // 获取系统信息
    getSystemInfo()

    // 监听网络状态
    watchNetworkStatus()
  }

  /**
   * 加载本地配置
   */
  async function loadLocalConfig() {
    try {
      // 加载主题配置
      const savedTheme = await Storage.get<THEME_MODE>(STORAGE_KEYS.THEME)
      if (savedTheme) {
        theme.value = savedTheme
      }

      // 加载语言配置
      const savedLanguage = await Storage.get<string>(STORAGE_KEYS.LANGUAGE)
      if (savedLanguage) {
        language.value = savedLanguage
      }
    } catch (error) {
      console.error('[App] 加载本地配置失败:', error)
    }
  }

  /**
   * 设置主题
   */
  async function setTheme(newTheme: THEME_MODE) {
    theme.value = newTheme
    await Storage.set(STORAGE_KEYS.THEME, newTheme)
  }

  /**
   * 切换主题
   */
  async function toggleTheme() {
    const newTheme = isDark.value ? THEME_MODE.LIGHT : THEME_MODE.DARK
    await setTheme(newTheme)
  }

  /**
   * 设置语言
   */
  async function setLanguage(lang: string) {
    language.value = lang
    await Storage.set(STORAGE_KEYS.LANGUAGE, lang)
  }

  /**
   * 获取系统信息
   */
  function getSystemInfo() {
    try {
      systemInfo.value = uni.getSystemInfoSync()
      console.log('[App] 系统信息:', systemInfo.value)
    } catch (error) {
      console.error('[App] 获取系统信息失败:', error)
    }
  }

  /**
   * 监听网络状态
   */
  function watchNetworkStatus() {
    uni.onNetworkStatusChange((res) => {
      networkStatus.value = res.isConnected
      console.log('[App] 网络状态变化:', res.isConnected)
    })
  }

  /**
   * 显示加载
   */
  function showLoading() {
    loading.value = true
  }

  /**
   * 隐藏加载
   */
  function hideLoading() {
    loading.value = false
  }

  return {
    // 状态
    theme,
    language,
    networkStatus,
    systemInfo,
    loading,

    // 计算属性
    isDark,

    // Actions
    init,
    setTheme,
    toggleTheme,
    setLanguage,
    getSystemInfo,
    showLoading,
    hideLoading
  }
})
