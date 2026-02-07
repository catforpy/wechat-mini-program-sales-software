/**
 * 全局类型定义
 * 定义项目中通用的类型
 */

/**
 * 通用响应结构
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: number
}

/**
 * 分页请求参数
 */
export interface PageParams {
  page: number
  pageSize: number
}

/**
 * 分页响应数据
 */
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * HTTP 请求配置
 */
export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: any
  header?: Record<string, string>
  timeout?: number
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
  cache?: boolean | number // true: 永久缓存, number: 缓存秒数
  retry?: number // 重试次数
}

/**
 * HTTP 响应拦截器
 */
export interface ResponseInterceptor {
  onSuccess: (response: any) => any
  onError: (error: any) => any
}

/**
 * 存储数据项
 */
export interface StorageItem<T = any> {
  key: string
  data: T
  expire?: number // 过期时间戳
}

/**
 * 缓存配置
 */
export interface CacheOptions {
  ttl?: number // 过期时间(毫秒)
  max?: number // 最大缓存数量
  prefix?: string // key 前缀
}

/**
 * LRU 缓存节点
 */
export interface LRUNode<T = any> {
  key: string
  value: T
  prev: LRUNode<T> | null
  next: LRUNode<T> | null
  expire: number // 过期时间戳
  accessCount: number // 访问次数
}

/**
 * 事件监听器
 */
export type EventListener<T = any> = (data: T) => void

/**
 * 事件类型映射
 */
export interface EventMap {
  [event: string]: EventListener[]
}
