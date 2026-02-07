/**
 * 认证相关 API
 */

import apiAdapter from './adapter'
import type { LoginParams, LoginResponse, UserInfo } from '@/types'

export const authApi = {
  /**
   * 用户登录
   */
  login(params: LoginParams): Promise<LoginResponse> {
    return apiAdapter.post<LoginResponse>('/api/auth/login', params)
  },

  /**
   * 用户退出
   */
  logout(): Promise<void> {
    return apiAdapter.post<void>('/api/auth/logout')
  },

  /**
   * 刷新 Token
   */
  refreshToken(refreshToken: string): Promise<{ token: string }> {
    return apiAdapter.post('/api/auth/refresh', { refreshToken })
  }
}

/**
 * 用户相关 API
 */
export const userApi = {
  /**
   * 获取用户信息
   */
  getUserInfo(): Promise<UserInfo> {
    return apiAdapter.get<UserInfo>('/api/user/info')
  },

  /**
   * 更新用户信息
   */
  updateUserInfo(data: Partial<UserInfo>): Promise<UserInfo> {
    return apiAdapter.put<UserInfo>('/api/user/info', data)
  },

  /**
   * 修改密码
   */
  changePassword(data: {
    oldPassword: string
    newPassword: string
  }): Promise<void> {
    return apiAdapter.post('/api/user/change-password', data)
  }
}
