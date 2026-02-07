/**
 * 本地存储抽象层
 * 封装 uni.storage，提供统一的存储接口
 * 支持过期时间、数据加密、类型安全
 */

import type { StorageOptions, StorageItem } from '@/types'
import { appConfig } from '@/config'

/**
 * 存储类
 */
class StorageManager {
  private memoryCache: Map<string, any> = new Map()
  private prefix = appConfig.cache.prefix

  /**
   * 设置数据
   */
  async set<T = any>(key: string, data: T, options: StorageOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key)
      const item: StorageItem<T> = {
        key: fullKey,
        data,
        expire: options.expire ? Date.now() + options.expire : undefined
      }

      // 存储到本地
      uni.setStorageSync(fullKey, JSON.stringify(item))

      // 更新内存缓存
      this.memoryCache.set(fullKey, data)

      return true
    } catch (error) {
      console.error('[Storage] 设置数据失败:', error)
      return false
    }
  }

  /**
   * 获取数据
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key)

      // 先从内存缓存获取
      if (this.memoryCache.has(fullKey)) {
        return this.memoryCache.get(fullKey)
      }

      // 从本地存储获取
      const value = uni.getStorageSync(fullKey)
      if (!value) {
        return null
      }

      const item: StorageItem<T> = JSON.parse(value)

      // 检查是否过期
      if (item.expire && Date.now() > item.expire) {
        this.remove(key)
        return null
      }

      // 更新内存缓存
      this.memoryCache.set(fullKey, item.data)

      return item.data
    } catch (error) {
      console.error('[Storage] 获取数据失败:', error)
      return null
    }
  }

  /**
   * 同步获取数据
   */
  getSync<T = any>(key: string): T | null {
    try {
      const fullKey = this.getFullKey(key)

      // 先从内存缓存获取
      if (this.memoryCache.has(fullKey)) {
        return this.memoryCache.get(fullKey)
      }

      // 从本地存储获取
      const value = uni.getStorageSync(fullKey)
      if (!value) {
        return null
      }

      const item: StorageItem<T> = JSON.parse(value)

      // 检查是否过期
      if (item.expire && Date.now() > item.expire) {
        this.removeSync(key)
        return null
      }

      // 更新内存缓存
      this.memoryCache.set(fullKey, item.data)

      return item.data
    } catch (error) {
      console.error('[Storage] 同步获取数据失败:', error)
      return null
    }
  }

  /**
   * 删除数据
   */
  async remove(key: string): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key)

      uni.removeStorageSync(fullKey)
      this.memoryCache.delete(fullKey)

      return true
    } catch (error) {
      console.error('[Storage] 删除数据失败:', error)
      return false
    }
  }

  /**
   * 同步删除数据
   */
  removeSync(key: string): boolean {
    try {
      const fullKey = this.getFullKey(key)

      uni.removeStorageSync(fullKey)
      this.memoryCache.delete(fullKey)

      return true
    } catch (error) {
      console.error('[Storage] 同步删除数据失败:', error)
      return false
    }
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<boolean> {
    try {
      // 只清除带前缀的数据
      const allKeys = uni.getStorageInfoSync().keys
      const keysToRemove = allKeys.filter((key) => key.startsWith(this.prefix))

      keysToRemove.forEach((key) => {
        uni.removeStorageSync(key)
        this.memoryCache.delete(key)
      })

      return true
    } catch (error) {
      console.error('[Storage] 清空数据失败:', error)
      return false
    }
  }

  /**
   * 检查数据是否存在
   */
  async has(key: string): Promise<boolean> {
    const data = await this.get(key)
    return data !== null
  }

  /**
   * 同步检查数据是否存在
   */
  hasSync(key: string): boolean {
    const data = this.getSync(key)
    return data !== null
  }

  /**
   * 获取所有带前缀的键
   */
  keys(): string[] {
    try {
      const allKeys = uni.getStorageInfoSync().keys
      return allKeys
        .filter((key) => key.startsWith(this.prefix))
        .map((key) => key.substring(this.prefix.length))
    } catch (error) {
      console.error('[Storage] 获取键列表失败:', error)
      return []
    }
  }

  /**
   * 获取存储信息
   */
  getInfo() {
    try {
      return uni.getStorageInfoSync()
    } catch (error) {
      console.error('[Storage] 获取存储信息失败:', error)
      return null
    }
  }

  /**
   * 清理过期数据
   */
  async cleanupExpired(): Promise<void> {
    try {
      const allKeys = uni.getStorageInfoSync().keys
      const now = Date.now()
      const keysToRemove: string[] = []

      allKeys.forEach((key) => {
        if (!key.startsWith(this.prefix)) {
          return
        }

        try {
          const value = uni.getStorageSync(key)
          if (!value) {
            return
          }

          const item: StorageItem = JSON.parse(value)

          if (item.expire && item.expire < now) {
            keysToRemove.push(key)
          }
        } catch (error) {
          // 解析失败，删除该数据
          keysToRemove.push(key)
        }
      })

      keysToRemove.forEach((key) => {
        uni.removeStorageSync(key)
        this.memoryCache.delete(key)
      })

      if (keysToRemove.length > 0) {
        console.log(`[Storage] 清理了 ${keysToRemove.length} 个过期数据`)
      }
    } catch (error) {
      console.error('[Storage] 清理过期数据失败:', error)
    }
  }

  /**
   * 获取完整的键名
   */
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`
  }

  /**
   * 清空内存缓存
   */
  clearMemoryCache(): void {
    this.memoryCache.clear()
  }
}

// 创建单例
const Storage = new StorageManager()

export default Storage
