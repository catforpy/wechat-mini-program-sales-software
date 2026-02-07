/**
 * 认证相关的 Composable
 * 提供登录、登出、权限检查等功能
 */
import { computed } from 'vue'
import { useUserStore } from '@/stores'

export function useAuth() {
  const userStore = useUserStore()

  // 是否已登录
  const isLoggedIn = computed(() => userStore.isLoggedIn)

  // 用户信息
  const userInfo = computed(() => userStore.userInfo)

  // 用户角色
  const userRole = computed(() => userStore.userRole)

  // 用户名称
  const userName = computed(() => userStore.userName)

  // 用户头像
  const userAvatar = computed(() => userStore.userAvatar)

  // 是否为管理员
  const isAdmin = computed(() => userStore.hasRole('admin'))

  /**
   * 登录
   */
  const login = async (username: string, password: string) => {
    return await userStore.login({ username, password })
  }

  /**
   * 退出登录
   */
  const logout = () => {
    return userStore.logout()
  }

  /**
   * 检查权限
   */
  const hasPermission = (permission: string) => {
    return userStore.hasPermission(permission)
  }

  /**
   * 检查角色
   */
  const hasRole = (role: string) => {
    return userStore.hasRole(role)
  }

  /**
   * 需要登录才能访问
   */
  const requireAuth = () => {
    if (!isLoggedIn.value) {
      uni.navigateTo({
        url: '/pages/user/login/index'
      })
      return false
    }
    return true
  }

  /**
   * 需要特定角色才能访问
   */
  const requireRole = (role: string) => {
    if (!requireAuth()) {
      return false
    }
    if (!hasRole(role)) {
      showError('没有权限访问')
      return false
    }
    return true
  }

  return {
    isLoggedIn,
    userInfo,
    userRole,
    userName,
    userAvatar,
    isAdmin,
    login,
    logout,
    hasPermission,
    hasRole,
    requireAuth,
    requireRole
  }
}
