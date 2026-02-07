/**
 * 用户状态管理
 * 管理用户登录、用户信息、权限等
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Storage from '@/utils/storage'
import { httpRequest } from '@/utils'
import { showSuccess, showErrorToast } from '@/utils/ui'
import { STORAGE_KEYS, ERROR_CODE } from '@/config/constant'
import type { UserInfo, LoginParams, LoginResponse } from '@/types'

export const useUserStore = defineStore('user', () => {
  // ========== 状态 ==========

  // 用户信息
  const userInfo = ref<UserInfo | null>(null)

  // Token
  const token = ref<string>('')

  // Refresh Token
  const refreshToken = ref<string>('')

  // 登录状态
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 用户角色
  const userRole = computed(() => userInfo.value?.role || 'guest')

  // 用户名称
  const userName = computed(() => userInfo.value?.nickname || userInfo.value?.username || '游客')

  // 用户头像
  const userAvatar = computed(() => userInfo.value?.avatar || '')

  // ========== Actions ==========

  /**
   * 初始化用户状态
   */
  async function init() {
    // 从本地存储加载 Token
    const savedToken = await Storage.get<string>(STORAGE_KEYS.TOKEN)
    if (savedToken) {
      token.value = savedToken
    }

    // 加载用户信息
    const savedUserInfo = await Storage.get<UserInfo>(STORAGE_KEYS.USER_INFO)
    if (savedUserInfo) {
      userInfo.value = savedUserInfo
    }

    // 如果有 Token，验证是否过期
    if (token.value && !userInfo.value) {
      await getUserInfo()
    }
  }

  /**
   * 用户登录
   */
  async function login(params: LoginParams): Promise<boolean> {
    try {
      const response = await httpRequest.post<LoginResponse>('/auth/login', params, {
        showLoading: true,
        loadingText: '登录中...'
      })

      if (response.code === 200) {
        const { token: accessToken, refreshToken: newRefreshToken, userInfo: info } = response.data

        // 保存 Token
        token.value = accessToken
        refreshToken.value = newRefreshToken
        await Storage.set(STORAGE_KEYS.TOKEN, accessToken, {
          expire: 7 * 24 * 60 * 60 * 1000 // 7 天
        })

        // 保存用户信息
        userInfo.value = info
        await Storage.set(STORAGE_KEYS.USER_INFO, info)

        showSuccess('登录成功')
        return true
      } else {
        showErrorToast(response.message || '登录失败')
        return false
      }
    } catch (error: any) {
      console.error('[User] 登录失败:', error)
      showErrorToast(error.message || '登录失败')
      return false
    }
  }

  /**
   * 用户退出
   */
  async function logout() {
    try {
      // 调用退出接口
      await httpRequest.post('/auth/logout')

      showSuccess('退出成功')
    } catch (error) {
      console.error('[User] 退出失败:', error)
    } finally {
      // 清除本地数据
      await clearUserData()
    }
  }

  /**
   * 获取用户信息
   */
  async function getUserInfo(): Promise<UserInfo | null> {
    try {
      const response = await httpRequest.get<UserInfo>('/user/info')

      if (response.code === 200) {
        userInfo.value = response.data
        await Storage.set(STORAGE_KEYS.USER_INFO, response.data)
        return response.data
      }
      return null
    } catch (error) {
      console.error('[User] 获取用户信息失败:', error)
      return null
    }
  }

  /**
   * 更新用户信息
   */
  async function updateUserInfo(data: Partial<UserInfo>): Promise<boolean> {
    try {
      const response = await httpRequest.put<UserInfo>('/user/info', data)

      if (response.code === 200) {
        userInfo.value = { ...userInfo.value, ...response.data }
        await Storage.set(STORAGE_KEYS.USER_INFO, userInfo.value)
        showSuccess('更新成功')
        return true
      }
      return false
    } catch (error) {
      console.error('[User] 更新用户信息失败:', error)
      showErrorToast('更新失败')
      return false
    }
  }

  /**
   * 修改密码
   */
  async function changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      const response = await httpRequest.post('/user/change-password', {
        oldPassword,
        newPassword
      })

      if (response.code === 200) {
        showSuccess('密码修改成功，请重新登录')
        await logout()
        return true
      }
      return false
    } catch (error) {
      console.error('[User] 修改密码失败:', error)
      showErrorToast('修改密码失败')
      return false
    }
  }

  /**
   * 刷新 Token
   */
  async function refreshTokenAction(): Promise<boolean> {
    try {
      if (!refreshToken.value) {
        return false
      }

      const response = await httpRequest.post<{ token: string }>('/auth/refresh', {
        refreshToken: refreshToken.value
      })

      if (response.code === 200) {
        token.value = response.data.token
        await Storage.set(STORAGE_KEYS.TOKEN, response.data.token)
        return true
      }

      return false
    } catch (error) {
      console.error('[User] 刷新 Token 失败:', error)
      return false
    }
  }

  /**
   * 清除用户数据
   */
  async function clearUserData() {
    // 清除状态
    userInfo.value = null
    token.value = ''
    refreshToken.value = ''

    // 清除本地存储
    await Storage.remove(STORAGE_KEYS.TOKEN)
    await Storage.remove(STORAGE_KEYS.USER_INFO)
    await Storage.remove(STORAGE_KEYS.REFRESH_TOKEN)

    // 跳转到登录页
    uni.reLaunch({ url: '/pages/user/login/index' })
  }

  /**
   * 检查权限
   */
  function hasPermission(permission: string): boolean {
    if (!userInfo.value) {
      return false
    }

    // 管理员拥有所有权限
    if (userInfo.value.role === 'admin') {
      return true
    }

    // TODO: 实现权限检查逻辑
    return true
  }

  /**
   * 检查角色
   */
  function hasRole(role: string): boolean {
    return userInfo.value?.role === role
  }

  return {
    // 状态
    userInfo,
    token,
    refreshToken,

    // 计算属性
    isLoggedIn,
    userRole,
    userName,
    userAvatar,

    // Actions
    init,
    login,
    logout,
    getUserInfo,
    updateUserInfo,
    changePassword,
    refreshTokenAction,
    hasPermission,
    hasRole
  }
})
