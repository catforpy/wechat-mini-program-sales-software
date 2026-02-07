/**
 * LRU (Least Recently Used) 缓存管理器
 * 支持 TTL、最大数量限制、自动过期清理
 */

import type { LRUNode, CacheOptions } from '@/types'
import { appConfig } from '@/config'

/**
 * 缓存节点类
 */
class CacheNode<T = any> implements LRUNode<T> {
  key: string
  value: T
  prev: CacheNode<T> | null = null
  next: CacheNode<T> | null = null
  expire: number
  accessCount: number = 0
  lastAccess: number

  constructor(key: string, value: T, ttl: number) {
    this.key = key
    this.value = value
    this.expire = Date.now() + ttl
    this.lastAccess = Date.now()
  }
}

/**
 * LRU 缓存管理器
 */
export class CacheManager {
  private capacity: number
  private cache: Map<string, CacheNode> = new Map()
  private head: CacheNode | null = null
  private tail: CacheNode | null = null
  private defaultTTL: number
  private timer: number | null = null

  constructor(options: CacheOptions = {}) {
    this.capacity = options.max || appConfig.cache.memoryCacheMax
    this.defaultTTL = options.ttl || appConfig.cache.defaultTTL

    // 启动定时清理过期缓存
    this.startCleanupTimer()
  }

  /**
   * 设置缓存
   */
  set(key: string, value: any, ttl?: number): void {
    // 如果已存在，先删除
    if (this.cache.has(key)) {
      this.remove(key)
    }

    // 检查容量，删除最久未使用的
    if (this.cache.size >= this.capacity) {
      this.removeLeastRecentlyUsed()
    }

    // 创建新节点
    const node = new CacheNode(key, value, ttl || this.defaultTTL)

    // 添加到链表头部
    this.addToFront(node)
    this.cache.set(key, node)
  }

  /**
   * 获取缓存
   */
  get<T = any>(key: string): T | null {
    const node = this.cache.get(key)

    if (!node) {
      return null
    }

    // 检查是否过期
    if (this.isExpired(node)) {
      this.remove(key)
      return null
    }

    // 更新访问信息
    node.accessCount++
    node.lastAccess = Date.now()

    // 移动到链表头部
    this.moveToFront(node)

    return node.value as T
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    const node = this.cache.get(key)
    if (!node) {
      return false
    }

    if (this.isExpired(node)) {
      this.remove(key)
      return false
    }

    return true
  }

  /**
   * 删除缓存
   */
  remove(key: string): boolean {
    const node = this.cache.get(key)

    if (!node) {
      return false
    }

    // 从链表中移除
    this.removeFromList(node)
    this.cache.delete(key)

    return true
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
    this.head = null
    this.tail = null
  }

  /**
   * 根据模式清除缓存
   */
  clearByPattern(pattern: string): void {
    const regex = new RegExp(pattern)
    const keysToDelete: string[] = []

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach((key) => this.remove(key))
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const nodes = Array.from(this.cache.values())

    return {
      size: this.cache.size,
      capacity: this.capacity,
      usage: `${this.cache.size}/${this.capacity}`,
      utilizationRate: `${((this.cache.size / this.capacity) * 100).toFixed(2)}%`,
      // 最常访问的缓存
      mostAccessed: nodes
        .sort((a, b) => b.accessCount - a.accessCount)
        .slice(0, 5)
        .map((node) => ({
          key: node.key,
          accessCount: node.accessCount,
          lastAccess: new Date(node.lastAccess).toLocaleString()
        })),
      // 即将过期的缓存
      expiringSoon: nodes
        .filter((node) => node.expire - Date.now() < 5 * 60 * 1000)
        .map((node) => ({
          key: node.key,
          expireIn: `${Math.ceil((node.expire - Date.now()) / 1000)}秒`
        }))
    }
  }

  /**
   * 删除最久未使用的节点
   */
  private removeLeastRecentlyUsed(): void {
    if (this.tail) {
      this.remove(this.tail.key)
    }
  }

  /**
   * 添加节点到链表头部
   */
  private addToFront(node: CacheNode): void {
    node.prev = null
    node.next = this.head

    if (this.head) {
      this.head.prev = node
    }

    this.head = node

    if (!this.tail) {
      this.tail = node
    }
  }

  /**
   * 移动节点到链表头部
   */
  private moveToFront(node: CacheNode): void {
    if (node === this.head) {
      return
    }

    this.removeFromList(node)
    this.addToFront(node)
  }

  /**
   * 从链表中移除节点
   */
  private removeFromList(node: CacheNode): void {
    if (node.prev) {
      node.prev.next = node.next
    } else {
      this.head = node.next
    }

    if (node.next) {
      node.next.prev = node.prev
    } else {
      this.tail = node.prev
    }
  }

  /**
   * 检查节点是否过期
   */
  private isExpired(node: CacheNode): boolean {
    return Date.now() > node.expire
  }

  /**
   * 清理过期缓存
   */
  private cleanupExpired(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, node] of this.cache.entries()) {
      if (node.expire < now) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach((key) => this.remove(key))

    if (keysToDelete.length > 0) {
      console.log(`[Cache] 清理了 ${keysToDelete.length} 个过期缓存`)
    }
  }

  /**
   * 启动定时清理
   */
  private startCleanupTimer(): void {
    // 每分钟清理一次
    this.timer = setInterval(() => {
      this.cleanupExpired()
    }, 60 * 1000) as unknown as number
  }

  /**
   * 停止定时清理
   */
  stopCleanupTimer(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  /**
   * 销毁缓存管理器
   */
  destroy(): void {
    this.stopCleanupTimer()
    this.clear()
  }
}

/**
 * 全局缓存管理器实例
 */
export const globalCache = new CacheManager()

/**
 * 简单的内存缓存（不使用 LRU）
 */
export class SimpleCache {
  private cache: Map<string, { value: any; expire: number }> = new Map()

  set(key: string, value: any, ttl: number = appConfig.cache.defaultTTL): void {
    this.cache.set(key, {
      value,
      expire: Date.now() + ttl
    })
  }

  get<T = any>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    if (Date.now() > item.expire) {
      this.cache.delete(key)
      return null
    }

    return item.value as T
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) {
      return false
    }

    if (Date.now() > item.expire) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  remove(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (item.expire < now) {
        this.cache.delete(key)
      }
    }
  }
}

export default CacheManager
