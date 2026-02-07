/**
 * Token 管理器
 * 负责访问令牌的获取、刷新和过期处理
 */

import { STORAGE_KEYS } from '@/config/constant'
import Storage from '@/utils/storage'

interface TokenInfo {
  accessToken: string
  refreshToken: string
  expire: number // 过期时间戳
}

/**
 * Token 管理器类（单例）
 */
class TokenManager {
  private static instance: TokenManager
  private tokenInfo: TokenInfo | null = null
  private refreshPromise: Promise<string> | null = null

  private constructor() {
    this.loadToken()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  /**
   * 从本地加载 Token
   */
  private async loadToken(): Promise<void> {
    try {
      const data = await Storage.get<TokenInfo>(STORAGE_KEYS.TOKEN)
      if (data && this.isTokenValid(data)) {
        this.tokenInfo = data
      } else {
        await this.clearToken()
      }
    } catch (error) {
      console.error('[TokenManager] 加载 Token 失败:', error)
    }
  }

  /**
   * 获取访问令牌
   */
  getToken(): string | null {
    if (!this.tokenInfo) {
      return null
    }

    // 检查是否即将过期（提前5分钟刷新）
    const willExpireSoon = this.tokenInfo.expire - Date.now() < 5 * 60 * 1000

    if (willExpireSoon) {
      // 触发异步刷新
      this.refreshTokenAsync()
    }

    return this.tokenInfo.accessToken
  }

  /**
   * 设置 Token
   */
  async setToken(tokenInfo: TokenInfo): Promise<void> {
    this.tokenInfo = {
      ...tokenInfo,
      expire: Date.now() + tokenInfo.expire * 1000
    }

    await Storage.set(STORAGE_KEYS.TOKEN, this.tokenInfo, {
      expire: tokenInfo.expire * 1000
    })

    console.log('[TokenManager] Token 已设置')
  }

  /**
   * 刷新 Token（异步）
   */
  private async refreshTokenAsync(): Promise<void> {
    // 避免并发刷新
    if (this.refreshPromise) {
      return
    }

    this.refreshPromise = this.doRefreshToken()

    try {
      await this.refreshPromise
    } finally {
      this.refreshPromise = null
    }
  }

  /**
   * 执行 Token 刷新
   */
  private async doRefreshToken(): Promise<string> {
    if (!this.tokenInfo?.refreshToken) {
      throw new Error('没有 Refresh Token')
    }

    try {
      // 调用刷新 Token 接口
      const response = await uni.request({
        url: '/api/auth/refresh',
        method: 'POST',
        data: {
          refreshToken: this.tokenInfo.refreshToken
        }
      }) as any

      if (response.data.code === 200) {
        const newTokenInfo = response.data.data
        await this.setToken(newTokenInfo)
        return newTokenInfo.accessToken
      } else {
        throw new Error('刷新 Token 失败')
      }
    } catch (error) {
      console.error('[TokenManager] 刷新 Token 失败:', error)
      await this.clearToken()
      throw error
    }
  }

  /**
   * 检查 Token 是否有效
   */
  private isTokenValid(tokenInfo: TokenInfo): boolean {
    return tokenInfo.expire > Date.now()
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  /**
   * 清除 Token
   */
  async clearToken(): Promise<void> {
    this.tokenInfo = null
    await Storage.remove(STORAGE_KEYS.TOKEN)
    console.log('[TokenManager] Token 已清除')
  }

  /**
   * 获取 Refresh Token
   */
  getRefreshToken(): string | null {
    return this.tokenInfo?.refreshToken || null
  }
}

export { TokenManager }
export default TokenManager
